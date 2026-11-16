import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[480px] flex-1 flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold">폼앗이</h1>
      <Button>시작하기</Button>
    </main>
  );
}
