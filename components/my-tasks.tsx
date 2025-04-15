"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/context/app-context"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

export function MyTasks() {
  const { tasks, projects, users } = useApp()
  const { user } = useAuth()
  const router = useRouter()

  if (!user) return null

  // Filter tasks assigned to the current user and sort by due date
  const myTasks = tasks
    .filter((task) => task.assignees.includes(user.id))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4)

  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    return project ? project.name : "Unknown Project"
  }

  const getAssignee = (userId: string) => {
    return users.find((user) => user.id === userId)
  }

  const getCategoryColor = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    if (!project) return "bg-gray-500/10 text-gray-500"

    switch (project.name.split(" ")[0].toLowerCase()) {
      case "eluxpro":
        return "bg-blue-500/10 text-blue-500"
      case "yuzz":
        return "bg-amber-500/10 text-amber-500"
      case "prendi":
        return "bg-purple-500/10 text-purple-500"
      default:
        return "bg-green-500/10 text-green-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "bg-gray-500"
      case "In Progress":
        return "bg-blue-500"
      case "Review":
        return "bg-amber-500"
      case "Completed":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleTaskClick = (taskId: string) => {
    router.push(`/tasks/${taskId}`)
  }

  return (
    <Card className="border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>My Tasks</CardTitle>
        <Link href="/tasks" className="text-sm text-blue-500 hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent>
        {myTasks.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {myTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col rounded-lg border p-4 hover:bg-muted/50 cursor-pointer"
                onClick={() => handleTaskClick(task.id)}
              >
                <div className="mb-2 flex items-center justify-between flex-wrap gap-2">
                  <Badge variant="outline" className={getCategoryColor(task.projectId)}>
                    {getProjectName(task.projectId)}
                  </Badge>
                  <Badge variant="outline" className="bg-muted">
                    <span className={`h-2 w-2 rounded-full ${getStatusColor(task.status)}`}></span>
                  </Badge>
                </div>
                <h3 className="mb-2 font-medium line-clamp-1">{task.title}</h3>
                <div className="mt-auto flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    {task.assignees.length > 1 && (
                      <>
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={getAssignee(task.assignees[0])?.avatar || "/placeholder.svg"}
                            alt={getAssignee(task.assignees[0])?.name || "User"}
                          />
                          <AvatarFallback>
                            {getAssignee(task.assignees[0])
                              ?.name.split(" ")
                              .map((n) => n[0])
                              .join("") || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">+{task.assignees.length - 1}</span>
                      </>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <p>You don't have any assigned tasks</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
