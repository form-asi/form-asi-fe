/**
 * tokens/tokens.json(Tokens Studio) → src/app/tokens.generated.css
 *
 * - `bun run tokens:build`: 생성 파일을 다시 쓴다
 * - `--check`: 생성 파일이 tokens.json과 같은지, globals.css가 참조하는 변수가 모두 정의돼 있는지 검사한다
 */
import { readFileSync, writeFileSync } from "node:fs";
import { expandTypesMap, register } from "@tokens-studio/sd-transforms";
import StyleDictionary, { type TransformedToken } from "style-dictionary";

const TOKENS_PATH = "tokens/tokens.json";
const OUTPUT_PATH = "src/app/tokens.generated.css";
const GLOBALS_PATH = "src/app/globals.css";
// next/font가 런타임에 주입하는 변수
const EXTERNAL_VARIABLES = new Set(["--font-pretendard"]);
const SIZE_SUFFIX: Record<string, string> = { large: "lg", medium: "md", small: "sm" };
const TYPOGRAPHY_ROLES = new Set(["display", "heading", "title", "body", "label", "caption"]);

type TokenSets = Record<string, unknown> & { $metadata: { tokenSetOrder: string[] } };

async function loadTokens() {
  const tokenSets: TokenSets = JSON.parse(readFileSync(TOKENS_PATH, "utf8"));
  const mergedTokens = Object.assign(
    {},
    ...tokenSets.$metadata.tokenSetOrder.map((setName) => tokenSets[setName]),
  );
  register(StyleDictionary);
  const styleDictionary = new StyleDictionary({
    tokens: mergedTokens,
    preprocessors: ["tokens-studio"],
    expand: { include: ["typography"], typesMap: expandTypesMap },
    platforms: { css: { transformGroup: "tokens-studio" } },
    log: { verbosity: "silent", warnings: "disabled" },
  });
  const { allTokens } = await styleDictionary.getPlatformTokens("css");
  return allTokens;
}

/** Figma `color/surface/brand/primary/default` → `--surface-brand-primary` */
function toColorVariable(token: TransformedToken) {
  const [, ...path] = token.path;
  const statePath = path.at(-1) === "default" ? path.slice(0, -1) : path;
  return `  --${statePath.join("-")}: ${readTokenValue(token)};`;
}

/**
 * 타이포는 역할+크기까지만 토큰화한다. 굵기는 font-* 유틸리티로 조합하므로 첫 굵기 값만 쓴다.
 * Figma `label/medium/regular` → `--text-label-md`, `emphasis/label/medium` → `--text-emphasis-label-md`
 */
function toTypographyVariables(tokens: TransformedToken[]) {
  const scales = new Map<string, Record<string, string>>();
  for (const token of tokens) {
    const [role, ...rest] = token.path;
    const isEmphasis = role === "emphasis";
    if (!isEmphasis && !TYPOGRAPHY_ROLES.has(role)) continue;
    const [group, size] = isEmphasis ? [`emphasis-${rest[0]}`, rest[1]] : [role, rest[0]];
    const property = token.path.at(-1) ?? "";
    const name = `--text-${group}-${SIZE_SUFFIX[size] ?? size}`;
    const scale = scales.get(name) ?? {};
    scale[property] ??= readTokenValue(token);
    scales.set(name, scale);
  }
  return [...scales].flatMap(([name, scale]) => [
    `  ${name}: ${toRem(scale.fontSize)};`,
    `  ${name}--line-height: ${scale.lineHeight};`,
    `  ${name}--letter-spacing: ${scale.letterSpacing};`,
  ]);
}

// tokens.json은 Tokens Studio 기존 형식(`value`)이라 DTCG(`$value`)와 둘 다 받는다
function readTokenValue(token: TransformedToken) {
  return String(token.$value ?? token.value);
}

function toRem(pixelValue: string) {
  return `${Number.parseFloat(pixelValue) / 16}rem`;
}

async function generateCss() {
  const tokens = await loadTokens();
  const colorLines = tokens.filter((token) => token.path[0] === "color").map(toColorVariable);
  const typographyLines = toTypographyVariables(tokens);
  return [
    "/* 자동 생성 파일. 직접 고치지 말고 tokens/tokens.json 수정 후 `bun run tokens:build` */",
    "",
    ":root {",
    ...colorLines,
    "}",
    "",
    "@theme {",
    ...typographyLines,
    "}",
    "",
  ].join("\n");
}

function findUndefinedVariables(generatedCss: string) {
  const globalsCss = readFileSync(GLOBALS_PATH, "utf8");
  const definedVariables = new Set(
    [...`${globalsCss}\n${generatedCss}`.matchAll(/(--[\w-]+)\s*:/g)].map(([, name]) => name),
  );
  const referencedVariables = new Set(
    [...globalsCss.matchAll(/var\((--[\w-]+)/g)].map(([, name]) => name),
  );
  return [...referencedVariables].filter(
    (name) => !definedVariables.has(name) && !EXTERNAL_VARIABLES.has(name),
  );
}

const generatedCss = await generateCss();

if (process.argv.includes("--check")) {
  const errors: string[] = [];
  if (readFileSync(OUTPUT_PATH, "utf8") !== generatedCss) {
    errors.push(`${OUTPUT_PATH}가 tokens.json과 다릅니다. \`bun run tokens:build\`를 실행하세요.`);
  }
  const undefinedVariables = findUndefinedVariables(generatedCss);
  if (undefinedVariables.length > 0) {
    errors.push(`globals.css가 정의되지 않은 변수를 참조합니다: ${undefinedVariables.join(", ")}`);
  }
  if (errors.length > 0) {
    console.error(errors.join("\n"));
    process.exit(1);
  }
} else {
  writeFileSync(OUTPUT_PATH, generatedCss);
}
