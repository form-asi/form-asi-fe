import { UI_MESSAGES } from "@/lib/ui-messages";

export default function HomePage() {
  return (
    <div className="flex flex-1 items-center justify-center p-page-inset">
      <h1 className="text-lg font-medium">{UI_MESSAGES.comingSoon}</h1>
    </div>
  );
}
