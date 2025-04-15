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

interface NewProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewProjectDialog({ open, onOpenChange }: NewProjectDialogProps) {
  const { users, addProject } = useApp()
  const { user } = useAuth()
  const { toast } = useToast()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [status, setStatus] = useState<"Planning" | "In Progress" | "On Hold" | "Completed">("Planning")
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium")
  const [selectedTeam, setSelectedTeam] = useState<string[]>([])
  const [color, setColor] = useState("#3b82f6") // Default blue

  // Initialize selectedTeam with current user when dialog opens
  useState(() => {
    if (user) {
      setSelectedTeam([user.id])
    }
  })

  const colors = [
    { value: "#3b82f6", label: "Blue" },
    { value: "#10b981", label: "Green" },
    { value: "#f59e0b", label: "Amber" },
    { value: "#8b5cf6", label: "Purple" },
    { value: "#ef4444", label: "Red" },
  ]

  const handleSubmit = () => {
    if (!user) return

    if (!name.trim() || !startDate || !dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const start = new Date(startDate)
    const due = new Date(dueDate)

    if (due <= start) {
      toast({
        title: "Error",
        description: "Due date must be after start date",
        variant: "destructive",
      })
      return
    }

    // Make sure current user is always in the team
    const teamWithCurrentUser = selectedTeam.includes(user.id) ? selectedTeam : [...selectedTeam, user.id]

    addProject({
      name,
      description,
      progress: 0,
      status,
      priority,
      startDate: start.toISOString(),
      dueDate: due.toISOString(),
      team: teamWithCurrentUser,
      color,
    })

    toast({
      title: "Project created",
      description: "Your project has been created successfully",
    })

    // Reset form and close dialog
    setName("")
    setDescription("")
    setStartDate("")
    setDueDate("")
    setStatus("Planning")
    setPriority("Medium")
    setSelectedTeam([user.id])
    setColor("#3b82f6")
    onOpenChange(false)
  }

  const toggleTeamMember = (userId: string) => {
    setSelectedTeam((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Project Name*</label>
            <Input placeholder="Enter project name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Enter project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Start Date*</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Due Date*</label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Status</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
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
            <label className="text-sm font-medium">Project Color</label>
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

          <div className="grid gap-2">
            <label className="text-sm font-medium">Team Members</label>
            <div className="max-h-[150px] overflow-y-auto border rounded-md p-2">
              {users.map((member) => (
                <div key={member.id} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    id={`team-${member.id}`}
                    checked={selectedTeam.includes(member.id)}
                    onCheckedChange={() => toggleTeamMember(member.id)}
                    disabled={member.id === user.id} // Can't remove yourself
                  />
                  <label
                    htmlFor={`team-${member.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {member.name} {member.id === user.id ? "(You)" : ""}
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
          <Button onClick={handleSubmit}>Create Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
