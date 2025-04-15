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

interface ScheduleMeetingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ScheduleMeetingDialog({ open, onOpenChange }: ScheduleMeetingDialogProps) {
  const { users, addMeeting } = useApp()
  const { user } = useAuth()
  const { toast } = useToast()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [location, setLocation] = useState("Zoom Meeting")
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([])

  const locations = ["Zoom Meeting", "Conference Room", "Office", "Phone", "Microsoft Teams", "Google Meet"]

  const handleSubmit = () => {
    if (!user) return

    if (!title.trim() || !date || !startTime || !endTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const startDateTime = new Date(`${date}T${startTime}:00`)
    const endDateTime = new Date(`${date}T${endTime}:00`)

    if (endDateTime <= startDateTime) {
      toast({
        title: "Error",
        description: "End time must be after start time",
        variant: "destructive",
      })
      return
    }

    // Make sure current user is always in the attendees
    const attendeesWithCurrentUser = selectedAttendees.includes(user.id)
      ? selectedAttendees
      : [...selectedAttendees, user.id]

    addMeeting({
      title,
      description,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      location,
      organizer: user.id,
      attendees: attendeesWithCurrentUser,
    })

    toast({
      title: "Meeting scheduled",
      description: "Your meeting has been scheduled successfully",
    })

    // Reset form and close dialog
    setTitle("")
    setDescription("")
    setDate("")
    setStartTime("")
    setEndTime("")
    setLocation("Zoom Meeting")
    setSelectedAttendees([])
    onOpenChange(false)
  }

  const toggleAttendee = (userId: string) => {
    setSelectedAttendees((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule a Meeting</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Meeting Title*</label>
            <Input placeholder="Enter meeting title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Enter meeting description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Date*</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Start Time*</label>
              <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">End Time*</label>
              <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Location</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Attendees</label>
            <div className="max-h-[150px] overflow-y-auto border rounded-md p-2">
              {users
                .filter((u) => u.id !== user.id)
                .map((attendee) => (
                  <div key={attendee.id} className="flex items-center space-x-2 py-1">
                    <Checkbox
                      id={`user-${attendee.id}`}
                      checked={selectedAttendees.includes(attendee.id)}
                      onCheckedChange={() => toggleAttendee(attendee.id)}
                    />
                    <label
                      htmlFor={`user-${attendee.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {attendee.name}
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
          <Button onClick={handleSubmit}>Schedule Meeting</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
