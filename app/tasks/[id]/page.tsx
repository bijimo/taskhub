"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { useApp } from "@/context/app-context"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, CheckCircle, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Task } from "@/types"

export default function TaskDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { tasks, projects, users, updateTask } = useApp()
  const { user } = useAuth()
  const { toast } = useToast()
  const [comment, setComment] = useState("")

  if (!user) return null

  const taskId = params.id as string
  const task = tasks.find((t) => t.id === taskId)

  if (!task) {
    return (
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4">
            <div className="flex h-[80vh] items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold">Task not found</h1>
                <p className="text-muted-foreground">The task you're looking for doesn't exist</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push("/tasks")}>
                  Back to Tasks
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const project = projects.find((p) => p.id === task.projectId)
  const assignees = users.filter((u) => task.assignees.includes(u.id))
  const creator = users.find((u) => u.id === task.createdBy)

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "bg-gray-500/10 text-gray-500"
      case "In Progress":
        return "bg-blue-500/10 text-blue-500"
      case "Review":
        return "bg-amber-500/10 text-amber-500"
      case "Completed":
        return "bg-green-500/10 text-green-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Low":
        return "bg-green-500/10 text-green-500"
      case "Medium":
        return "bg-amber-500/10 text-amber-500"
      case "High":
        return "bg-red-500/10 text-red-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  const handleStatusChange = (newStatus: "To Do" | "In Progress" | "Review" | "Completed") => {
    const updates: Partial<Task> = { status: newStatus }

    if (newStatus === "Completed") {
      updates.completedAt = new Date().toISOString()
    }

    updateTask(taskId, updates)

    toast({
      title: "Task updated",
      description: `Task status changed to ${newStatus}`,
    })
  }

  const handleSubmitComment = () => {
    if (!comment.trim()) return

    toast({
      title: "Comment added",
      description: "Your comment has been added to the task",
    })

    setComment("")
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-4">
          <div className="mb-6">
            <Button variant="outline" className="mb-4" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{task.title}</h1>
                  <Badge variant="outline" className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                  <Badge variant="outline" className={getPriorityColor(task.priority)}>
                    {task.priority} Priority
                  </Badge>
                </div>
                {project && (
                  <p className="text-muted-foreground">
                    Project:{" "}
                    <span
                      className="cursor-pointer hover:underline"
                      onClick={() => router.push(`/projects/${project.id}`)}
                    >
                      {project.name}
                    </span>
                  </p>
                )}
              </div>

              {task.status !== "Completed" && (
                <Button
                  onClick={() => handleStatusChange("Completed")}
                  variant="outline"
                  className="bg-green-500/10 text-green-500 hover:bg-green-500/20"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Completed
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Task Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{task.description}</p>
                </CardContent>
              </Card>

              {/* Comments */}
              <Card>
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Textarea
                      placeholder="Add a comment..."
                      className="mb-2"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Button onClick={handleSubmitComment} disabled={!comment.trim()}>
                      Add Comment
                    </Button>
                  </div>

                  <div className="py-8 text-center text-muted-foreground">
                    <p>No comments yet</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Task Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="outline" className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Priority</span>
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Due Date</span>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {task.completedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Completed</span>
                      <div className="flex items-center">
                        <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                        <span>{new Date(task.completedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Assignees */}
              <Card>
                <CardHeader>
                  <CardTitle>Assignees</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assignees.map((assignee) => (
                      <div
                        key={assignee.id}
                        className="flex items-center gap-3 rounded-md p-2 hover:bg-muted/50 cursor-pointer"
                        onClick={() => router.push(`/profile/${assignee.id}`)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={assignee.avatar || "/placeholder.svg"} alt={assignee.name} />
                          <AvatarFallback>
                            {assignee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{assignee.name}</p>
                          <p className="text-xs text-muted-foreground">{assignee.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Created By */}
              {creator && (
                <Card>
                  <CardHeader>
                    <CardTitle>Created By</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="flex items-center gap-3 rounded-md p-2 hover:bg-muted/50 cursor-pointer"
                      onClick={() => router.push(`/profile/${creator.id}`)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={creator.avatar || "/placeholder.svg"} alt={creator.name} />
                        <AvatarFallback>
                          {creator.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{creator.name}</p>
                        <p className="text-xs text-muted-foreground">{creator.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
