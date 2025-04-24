'use client'

import { useUser } from "@/lib/hooks/useUser"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { Loading } from "@/components/ui/loading"
import { useRouter } from "next/navigation"
import { useTags } from "@/lib/hooks/useTags"
import { Trash } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

export default function ProfilePage() {
  const router = useRouter()
  const { data: user, isLoading: isUserLoading } = useUser()
  const { tags, isLoading: isTagsLoading, deleteTag } = useTags()
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null)

  if (isUserLoading || isTagsLoading) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <Loading text="Loading profile..." />
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  const handleDeleteTag = (tagId: string) => {
    deleteTag.mutate(tagId, {
      onSuccess: () => {
        setShowDeleteDialog(null)
      }
    })
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <Card className="border-none shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-sm text-muted-foreground">Account Created</p>
                <p className="font-medium">
                  {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Your Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tags?.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="font-medium">{tag.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => setShowDeleteDialog(tag.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {tags?.length === 0 && (
                <div className="col-span-2 flex items-center justify-center p-6 rounded-lg border border-dashed">
                  <p className="text-sm text-muted-foreground">No categories created yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!showDeleteDialog} onOpenChange={() => setShowDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => showDeleteDialog && handleDeleteTag(showDeleteDialog)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 