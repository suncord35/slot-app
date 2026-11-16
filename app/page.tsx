import { MachineList } from "@/components/MachineList";

/** トップページ：機種選択画面 */
export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="max-w-md mx-auto">
        <h1 className="text-center font-bold mt-4 mb-6">
          <span className="block text-3xl">パチスロ</span>
          <span className="block text-2xl mt-1 text-white/80">設定判別ツール</span>
        </h1>
        <MachineList />
      </div>
    </main>
  );
}
