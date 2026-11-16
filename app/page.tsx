import Link from "next/link";
import { machines } from "@/machines";

/** トップページ：機種選択画面 */
export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="max-w-md mx-auto">
        <h1 className="text-center font-bold mt-4 mb-8">
          <span className="block text-3xl">パチスロ</span>
          <span className="block text-2xl mt-1 text-white/80">設定判別ツール</span>
        </h1>

        <h2 className="mb-3 text-sm font-bold text-white/60">機種を選んでください</h2>

        <ul className="space-y-3">
          {machines.map((machine) => (
            <li key={machine.slug}>
              <Link
                href={`/${machine.slug}`}
                className="flex min-h-20 items-center justify-between gap-3 rounded-xl border-2 bg-black/30 px-5 py-4 transition-colors hover:bg-white/5 active:bg-white/10"
                style={{ borderColor: machine.theme.accent }}
              >
                <span className="flex flex-col">
                  <span className="text-xl font-bold">{machine.name}</span>
                  <span className="mt-1 text-sm font-semibold" style={{ color: machine.theme.sub }}>
                    設定 {machine.settings.join("・")} を判別
                  </span>
                </span>
                <span className="text-3xl font-bold" style={{ color: machine.theme.accent }} aria-hidden="true">
                  ›
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
