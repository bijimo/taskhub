"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { useApp } from "@/context/app-context"
import { ScheduleMeetingDialog } from "@/components/dialogs/schedule-meeting-dialog"

export default function CalendarPage() {
  const { meetings, users, currentUser } = useApp()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)

  // Calendar navigation
  const goToPreviousMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() - 1)
      return newDate
    })
  }

  const goToNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() + 1)
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Calendar helpers
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: 0, isCurrentMonth: false })
    }

    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true })
    }

    return days
  }

  // Get meetings for a specific day
  const getMeetingsForDay = (day: number) => {
    if (day === 0) return []

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const date = new Date(year, month, day)
    const dateString = date.toISOString().split("T")[0]

    return meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.startTime).toISOString().split("T")[0]
      return (
        meetingDate === dateString &&
        (meeting.organizer === currentUser.id || meeting.attendees.includes(currentUser.id))
      )
    })
  }

  // Format meeting time
  const formatMeetingTime = (startTime: string) => {
    const date = new Date(startTime)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Get user name
  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    return user ? user.name : "Unknown User"
  }

  const calendarDays = generateCalendarDays()
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const monthName = currentDate.toLocaleString("default", { month: "long" })

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-4">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Calendar</h1>
              <p className="text-muted-foreground">Manage your schedule and meetings</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={goToToday}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button onClick={() => setIsScheduleDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Meeting
              </Button>
            </div>
          </div>

          <div className="mb-4 text-center">
            <h2 className="text-xl font-semibold">
              {monthName} {currentDate.getFullYear()}
            </h2>
          </div>

          <div className="rounded-lg border bg-card overflow-hidden">
            {/* Calendar header */}
            <div className="grid grid-cols-7 border-b">
              {weekdays.map((day) => (
                <div key={day} className="p-2 text-center font-medium">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 auto-rows-fr">
              {calendarDays.map((day, index) => {
                const meetings = getMeetingsForDay(day.day)
                const isToday =
                  day.isCurrentMonth &&
                  day.day === new Date().getDate() &&
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear()

                return (
                  <div
                    key={index}
                    className={`min-h-[100px] border-r border-b p-1 ${!day.isCurrentMonth ? "bg-muted/30" : ""}`}
                  >
                    <div className="flex justify-end">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-sm ${isToday ? "bg-primary text-primary-foreground" : ""}`}
                      >
                        {day.day > 0 ? day.day : ""}
                      </span>
                    </div>
                    <div className="mt-1 space-y-1">
                      {meetings.slice(0, 3).map((meeting) => (
                        <div
                          key={meeting.id}
                          className="rounded bg-primary/10 px-1 py-0.5 text-xs truncate"
                          title={meeting.title}
                        >
                          {formatMeetingTime(meeting.startTime)} {meeting.title}
                        </div>
                      ))}
                      {meetings.length > 3 && (
                        <div className="text-xs text-muted-foreground">+{meetings.length - 3} more</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>

      <ScheduleMeetingDialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen} />
    </div>
  )
}
