"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useApp } from "@/context/app-context"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface QuickNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editNote?: {
    id: string
    title: string
    content: string
    color: string
    projectId?: string
    isPublic?: boolean
  }
}

export function QuickNoteDialog({ open, onOpenChange, editNote }: QuickNoteDialogProps) {
  const { addNote, updateNote, projects } = useApp()
  const { user } = useAuth()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState<"private" | "public">("private")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [projectId, setProjectId] = useState("")
  const [color, setColor] = useState("#3b82f6") // Default blue
  const [isPublic, setIsPublic] = useState(false)

  // Initialize form with editNote data when dialog opens or editNote changes
  useEffect(() => {
    if (open && editNote) {
      setTitle(editNote.title || "")
      setContent(editNote.content || "")
      setProjectId(editNote.projectId || "")
      setColor(editNote.color || "#3b82f6")
      setIsPublic(editNote.isPublic || false)
      setActiveTab(editNote.isPublic ? "public" : "private")
    } else if (open && !editNote) {
      // Reset form when opening for a new note
      setTitle("")
      setContent("")
      setProjectId("")
      setColor("#3b82f6")
      setIsPublic(false)
      setActiveTab("private")
    }
  }, [open, editNote])

  const colors = [
    { value: "#3b82f6", label: "Blue" },
    { value: "#10b981", label: "Green" },
    { value: "#f59e0b", label: "Amber" },
    { value: "#8b5cf6", label: "Purple" },
    { value: "#ef4444", label: "Red" },
  ]

  const handleSubmit = () => {
    if (!user) return

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your note",
        variant: "destructive",
      })
      return
    }

    if (editNote) {
      // Update existing note
      updateNote(editNote.id, {
        title,
        content,
        color,
        projectId: projectId || undefined,
        isPublic,
      })

      toast({
        title: "Note updated",
        description: "Your note has been updated successfully",
      })
    } else {
      // Add new note
      addNote({
        userId: user.id,
        title,
        content,
        color,
        projectId: projectId || undefined,
        isPublic,
      })

      toast({
        title: "Note created",
        description: "Your note has been saved successfully",
      })
    }

    // Close dialog
    onOpenChange(false)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as "private" | "public")
    setIsPublic(value === "public")
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{editNote ? "Edit Note" : "Create a Quick Note"}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="private">Private Note</TabsTrigger>
            <TabsTrigger value="public">Public Note</TabsTrigger>
          </TabsList>

          <TabsContent value="private" className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">This note is only visible to you</p>
              <div className="flex items-center space-x-2">
                <Switch
                  id="private-mode"
                  checked={!isPublic}
                  onCheckedChange={(checked) => setIsPublic(!checked)}
                  className="data-[state=checked]:bg-primary"
                />
                <Label htmlFor="private-mode">Private</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="public" className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">This note is visible to all team members</p>
              <div className="flex items-center space-x-2">
                <Switch
                  id="public-mode"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                  className="data-[state=checked]:bg-primary"
                />
                <Label htmlFor="public-mode">Public</Label>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input placeholder="Note Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Textarea
              placeholder="Note Content"
              className="min-h-[150px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Related Project (Optional)</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              <option value="">None</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Note Color</label>
            <div className="flex gap-2">
              {colors.map((colorOption) => (
                <button
                  key={colorOption.value}
                  type="button"
                  className={`h-8 w-8 rounded-full ${color === colorOption.value ? "ring-2 ring-ring ring-offset-2" : ""}`}
                  style={{ backgroundColor: colorOption.value }}
                  onClick={() => setColor(colorOption.value)}
                  title={colorOption.label}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{editNote ? "Update Note" : "Save Note"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
