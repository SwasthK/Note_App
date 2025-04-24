import { Edit } from "@/components/notes/edit";

export default async function EditNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <Edit id={id} />;
}
