"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateTag, useDeleteTag } from "@/lib/hooks/useTags";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CreateTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTagDialog({ open, onOpenChange }: CreateTagDialogProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");
  const { mutate: createTag } = useCreateTag();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      toast.error("Please enter a category name");
      return;
    }

    createTag(
      { name, color },
      {
        onSuccess: () => {
          toast.success("Category created successfully");
          onOpenChange(false);
          setName("");
          setColor("#000000");
        },
        onError: () => {
          toast.error("Failed to create category");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-20 p-1"
              />
              <span className="text-muted-foreground text-sm">
                Choose category color
              </span>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Category</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteTagDialog({
  open,
  onOpenChange,
  tagId,
  tagName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tagId: string;
  tagName: string;
}) {
  const deleteTag = useDeleteTag();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the category &rdquo;{tagName}
            &rdquo;? This will remove the category from all associated notes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteTag.mutate(tagId)}
            className="bg-red-500 hover:bg-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
