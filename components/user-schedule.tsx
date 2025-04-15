"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApp } from "@/context/app-context"
import { useAuth } from "@/context/auth-context"

export function UserSchedule() {
  const { meetings } = useApp()
  const { user } = useAuth()
  const router = useRouter()

  if (!user) return null

  // Get today's meetings for the current user
  const today = new Date().toISOString().split("T")[0]
  const todayMeetings = meetings
    .filter(
      (meeting) =>
        meeting.startTime.includes(today) && (meeting.organizer === user.id || meeting.attendees.includes(user.id)),
    )
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    let hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"
    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? "0" + minutes : minutes
    return {
      time: `${hours}:${minutesStr}`,
      period: ampm,
    }
  }

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const durationMs = end.getTime() - start.getTime()
    const minutes = Math.floor(durationMs / 60000)

    if (minutes < 60) {
      return `${minutes} min`
    } else {
      const hours = Math.floor(minutes / 60)
      return hours === 1 ? `1 hour` : `${hours} hours`
    }
  }

  const handleViewCalendar = () => {
    router.push("/calendar")
  }

  return (
    <Card className="border bg-card">
      <CardHeader>
        <CardTitle>Your Schedule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {todayMeetings.map((meeting) => {
          const { time, period } = formatTime(meeting.startTime)
          const duration = calculateDuration(meeting.startTime, meeting.endTime)

          return (
            <div key={meeting.id} className="flex gap-4">
              <div className="flex w-16 flex-col items-center text-center">
                <span className="text-lg font-bold">{time}</span>
                <span className="text-xs text-muted-foreground">{period}</span>
              </div>
              <div className="flex-1 rounded-md border border-muted bg-muted/30 p-3">
                <h4 className="font-medium">{meeting.title}</h4>
                <p className="text-xs text-muted-foreground">
                  {duration} · {meeting.location}
                </p>
              </div>
            </div>
          )
        })}

        {todayMeetings.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">No meetings scheduled for today</div>
        )}

        <Button className="mt-4 w-full" variant="outline" onClick={handleViewCalendar}>
          View Full Calendar
        </Button>
      </CardContent>
    </Card>
  )
}
