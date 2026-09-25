import { notFound } from "next/navigation";
import { getChoreo } from "@/lib/data";
import { ChoreoPractice } from "./practice";

export default async function ChoreoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const choreo = getChoreo(id);
  if (!choreo) notFound();
  return <ChoreoPractice choreo={choreo} />;
}
