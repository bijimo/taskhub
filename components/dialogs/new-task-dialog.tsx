"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useApp } from "@/context/app-context"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

interface NewTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId?: string
}

export function NewTaskDialog({ open, onOpenChange, projectId }: NewTaskDialogProps) {
  const { users, projects, addTask } = useApp()
  const { user } = useAuth()
  const { toast } = useToast()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedProject, setSelectedProject] = useState(projectId || "")
  const [dueDate, setDueDate] = useState("")
  const [status, setStatus] = useState<"To Do" | "In Progress" | "Review" | "Completed">("To Do")
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium")
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([])

  // Initialize selectedAssignees with current user when dialog opens
  useState(() => {
    if (user) {
      setSelectedAssignees([user.id])
    }
  })

  const handleSubmit = () => {
    if (!user) return

    if (!title.trim() || !selectedProject || !dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Make sure current user is always in the assignees
    const assigneesWithCurrentUser = selectedAssignees.includes(user.id)
      ? selectedAssignees
      : [...selectedAssignees, user.id]

    addTask({
      title,
      description,
      projectId: selectedProject,
      status,
      priority,
      assignees: assigneesWithCurrentUser,
      dueDate: new Date(dueDate).toISOString(),
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    })

    toast({
      title: "Task created",
      description: "Your task has been created successfully",
    })

    // Reset form and close dialog
    setTitle("")
    setDescription("")
    setSelectedProject(projectId || "")
    setDueDate("")
    setStatus("To Do")
    setPriority("Medium")
    setSelectedAssignees([user.id])
    onOpenChange(false)
  }

  const toggleAssignee = (userId: string) => {
    setSelectedAssignees((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  // Filter users based on selected project's team
  const availableAssignees = selectedProject
    ? users.filter((u) => {
        const project = projects.find((p) => p.id === selectedProject)
        return project ? project.team.includes(u.id) : true
      })
    : users

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Task Title*</label>
            <Input placeholder="Enter task title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Project*</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              disabled={!!projectId}
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Due Date*</label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Status</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Priority</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Assignees</label>
            <div className="max-h-[150px] overflow-y-auto border rounded-md p-2">
              {availableAssignees.map((assignee) => (
                <div key={assignee.id} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    id={`assignee-${assignee.id}`}
                    checked={selectedAssignees.includes(assignee.id)}
                    onCheckedChange={() => toggleAssignee(assignee.id)}
                  />
                  <label
                    htmlFor={`assignee-${assignee.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {assignee.name} {assignee.id === user.id ? "(You)" : ""}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
