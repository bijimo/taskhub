"use client"

import { FolderKanban, ClipboardList, MessageSquare, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useApp } from "@/context/app-context"
import { useAuth } from "@/context/auth-context"

export function DashboardStats() {
  const { projects, tasks, messages, users } = useApp()
  const { user } = useAuth()

  if (!user) return null

  const activeProjects = projects.filter((p) => p.status !== "Completed").length
  const pendingTasks = tasks.filter((t) => t.status !== "Completed").length
  const highPriorityTasks = tasks.filter((t) => t.priority === "High" && t.status !== "Completed").length
  const completedTasks = tasks.filter((t) => t.status === "Completed").length

  // Get recent messages (last 24 hours)
  const oneDayAgo = new Date()
  oneDayAgo.setDate(oneDayAgo.getDate() - 1)

  const newMessages = messages.filter((msg) => {
    const msgDate = new Date(msg.timestamp)
    return msgDate > oneDayAgo && (msg.recipientId === user.id || (msg.channelId && !msg.recipientId))
  }).length

  const stats = [
    {
      title: "Active Projects",
      value: activeProjects,
      icon: <FolderKanban className="h-5 w-5" />,
      change: `+3 this month`,
      color: "bg-blue-500/20",
      iconColor: "text-blue-500",
    },
    {
      title: "Pending Tasks",
      value: pendingTasks,
      icon: <ClipboardList className="h-5 w-5" />,
      change: `${highPriorityTasks} high priority`,
      color: "bg-amber-500/20",
      iconColor: "text-amber-500",
    },
    {
      title: "New Messages",
      value: newMessages,
      icon: <MessageSquare className="h-5 w-5" />,
      change: `last 24 hours`,
      color: "bg-green-500/20",
      iconColor: "text-green-500",
    },
    {
      title: "Completed Tasks",
      value: completedTasks,
      icon: <CheckCircle className="h-5 w-5" />,
      change: "+12 this week",
      color: "bg-purple-500/20",
      iconColor: "text-purple-500",
    },
  ]

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border bg-card">
          <CardContent className="flex items-center p-4 sm:p-6">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
            </div>
            <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full ${stat.color}`}>
              <div className={stat.iconColor}>{stat.icon}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
