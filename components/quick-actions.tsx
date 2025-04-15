"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MessageSquare, FolderClosed, StickyNote } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { QuickNoteDialog } from "@/components/dialogs/quick-note-dialog"
import { FileUploadDialog } from "@/components/dialogs/file-upload-dialog"
import { ScheduleMeetingDialog } from "@/components/dialogs/schedule-meeting-dialog"

export function QuickActions() {
  const router = useRouter()
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false)
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false)
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)

  const actions = [
    {
      name: "Schedule",
      icon: <Calendar className="h-5 w-5" />,
      color: "text-blue-500",
      onClick: () => setIsScheduleDialogOpen(true),
    },
    {
      name: "Message",
      icon: <MessageSquare className="h-5 w-5" />,
      color: "text-green-500",
      onClick: () => router.push("/messages"),
    },
    {
      name: "Files",
      icon: <FolderClosed className="h-5 w-5" />,
      color: "text-amber-500",
      onClick: () => setIsFileDialogOpen(true),
    },
    {
      name: "Notes",
      icon: <StickyNote className="h-5 w-5" />,
      color: "text-purple-500",
      onClick: () => setIsNoteDialogOpen(true),
    },
  ]

  return (
    <>
      <Card className="border bg-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {actions.map((action) => (
              <Button
                key={action.name}
                variant="outline"
                className="flex h-24 flex-col items-center justify-center gap-2"
                onClick={action.onClick}
              >
                <div className={action.color}>{action.icon}</div>
                <span className="text-xs">{action.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <QuickNoteDialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen} />
      <FileUploadDialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen} />
      <ScheduleMeetingDialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen} />
    </>
  )
}
