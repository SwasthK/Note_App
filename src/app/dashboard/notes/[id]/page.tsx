import { Note } from "@/components/notes/note";

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <Note id={id} />;
}
