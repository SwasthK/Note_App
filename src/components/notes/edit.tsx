"use client";

import { useNote } from "@/lib/hooks/useNotes";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Loading } from "@/components/ui/loading";
import { Card, CardContent } from "@/components/ui/card";

export const Edit = ({ id }: { id: string }) => {
  const { data: note, isLoading } = useNote(id);

  if (isLoading) {
    return (
      <Card className="mx-auto max-w-4xl">
        <CardContent className="p-6">
          <Loading text="Loading note..." />
        </CardContent>
      </Card>
    );
  }

  if (!note) {
    return (
      <Card className="mx-auto max-w-4xl">
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Note not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href={`/dashboard/notes/${note.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>

        <NoteEditor
          initialData={{
            id: note.id,
            title: note.title,
            content: note.content,
            tags: note.tags ? [note.tags.id] : [],
          }}
        />
      </div>
    </div>
  );
};
