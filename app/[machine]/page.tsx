import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findMachine, machines } from "@/machines";

type Props = { params: Promise<{ machine: string }> };

// 登録済みの機種だけページを作る（それ以外の URL は 404）
export const dynamicParams = false;

export function generateStaticParams() {
  return machines.map((machine) => ({ machine: machine.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { machine } = await params;
  const entry = findMachine(machine);
  return { title: entry ? `${entry.name} 設定判別` : "機種が見つかりません" };
}

export default async function MachinePage({ params }: Props) {
  const { machine } = await params;
  const entry = findMachine(machine);
  if (!entry) notFound();

  const { Screen } = entry;
  return <Screen />;
}
