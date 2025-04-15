"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Plus, Search, Trash2, Edit, Lock, Globe } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useApp } from "@/context/app-context"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { QuickNoteDialog } from "@/components/dialogs/quick-note-dialog"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function NotesPage() {
  const { notes, removeNote } = useApp()
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "private" | "public">("all")
  const [editingNote, setEditingNote] = useState<any>(null)

  if (!user) return null

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab =
      activeTab === "all" || (activeTab === "private" && !note.isPublic) || (activeTab === "public" && note.isPublic)

    const isOwner = note.userId === user.id
    const isPublicNote = note.isPublic

    // Show notes that the user owns or public notes
    return (isOwner || isPublicNote) && matchesSearch && matchesTab
  })

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleDeleteNote = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation()
    removeNote(noteId)
    toast({
      title: "Note deleted",
      description: "Your note has been deleted successfully",
    })
  }

  const handleEditNote = (e: React.MouseEvent, note: any) => {
    e.stopPropagation()
    setEditingNote(note)
    setIsNoteDialogOpen(true)
  }

  const closeNoteDialog = () => {
    setIsNoteDialogOpen(false)
    setEditingNote(null)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground md:flex-row">
      <Sidebar />
      <main className="flex-1 overflow-auto pb-16 pt-16 md:pt-0">
        <div className="container mx-auto p-4">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Notes</h1>
              <p className="text-muted-foreground">Capture and organize your thoughts</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                onClick={() => {
                  setEditingNote(null)
                  setIsNoteDialogOpen(true)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Note
              </Button>
            </div>
          </div>

          <Tabs
            defaultValue="all"
            onValueChange={(value) => setActiveTab(value as "all" | "private" | "public")}
            className="mb-6"
          >
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="all">All Notes</TabsTrigger>
              <TabsTrigger value="private">Private</TabsTrigger>
              <TabsTrigger value="public">Public</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <Card
                key={note.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
                style={{ borderTopColor: note.color, borderTopWidth: "4px" }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{note.title}</h3>
                      {note.isPublic ? (
                        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleEditNote(e, note)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {note.userId === user.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={(e) => handleDeleteNote(e, note.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="whitespace-pre-line text-sm text-muted-foreground mb-4 max-h-40 overflow-hidden">
                    {note.content}
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="text-xs text-muted-foreground">{formatDate(note.timestamp)}</div>
                    {note.projectId && (
                      <div className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">Project</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredNotes.length === 0 && (
            <div className="mt-10 text-center">
              <p className="text-muted-foreground">No notes found</p>
              <Button variant="outline" className="mt-2" onClick={() => setIsNoteDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create a new note
              </Button>
            </div>
          )}
        </div>
      </main>

      <QuickNoteDialog open={isNoteDialogOpen} onOpenChange={closeNoteDialog} editNote={editingNote} />
    </div>
  )
}
