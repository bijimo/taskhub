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
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NewTaskDialog } from "@/components/dialogs/new-task-dialog"
import { ArrowLeft, Calendar, Clock, Plus, Users } from "lucide-react"

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { projects, tasks, users } = useApp()
  const { user } = useAuth()
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false)
  const [taskFilter, setTaskFilter] = useState<"all" | "me">("all")

  if (!user) return null

  const projectId = params.id as string
  const project = projects.find((p) => p.id === projectId)

  if (!project) {
    return (
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4">
            <div className="flex h-[80vh] items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold">Project not found</h1>
                <p className="text-muted-foreground">The project you're looking for doesn't exist</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push("/projects")}>
                  Back to Projects
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Get project tasks
  const projectTasks = tasks.filter((task) => task.projectId === projectId)

  // Filter tasks based on the selected filter
  const filteredTasks =
    taskFilter === "me" ? projectTasks.filter((task) => task.assignees.includes(user.id)) : projectTasks

  // Get team members
  const teamMembers = users.filter((u) => project.team.includes(u.id))

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-500/10 text-blue-500"
      case "Planning":
        return "bg-amber-500/10 text-amber-500"
      case "On Hold":
        return "bg-orange-500/10 text-orange-500"
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

  // Get progress color
  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-green-500"
    if (progress > 50) return "bg-blue-500"
    return "bg-amber-500"
  }

  // Get task status color
  const getTaskStatusColor = (status: string) => {
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

  const handleTaskClick = (taskId: string) => {
    router.push(`/tasks/${taskId}`)
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
                  <h1 className="text-2xl font-bold">{project.name}</h1>
                  <Badge variant="outline" className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                  <Badge variant="outline" className={getPriorityColor(project.priority)}>
                    {project.priority} Priority
                  </Badge>
                </div>
                <p className="text-muted-foreground">{project.description}</p>
              </div>
              <Button onClick={() => setIsNewTaskOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Project Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{project.progress}% Complete</span>
                      <span className="text-sm text-muted-foreground">
                        Due: {new Date(project.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <Progress
                      value={project.progress}
                      className="h-2"
                      indicatorClassName={getProgressColor(project.progress)}
                    />
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-lg border p-3">
                      <div className="text-xs text-muted-foreground">Start Date</div>
                      <div className="mt-1 flex items-center">
                        <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{new Date(project.startDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-xs text-muted-foreground">Due Date</div>
                      <div className="mt-1 flex items-center">
                        <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{new Date(project.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-xs text-muted-foreground">Team Size</div>
                      <div className="mt-1 flex items-center">
                        <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{project.team.length} members</span>
                      </div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-xs text-muted-foreground">Tasks</div>
                      <div className="mt-1 flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{projectTasks.length} total</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tasks */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Tasks</CardTitle>
                  <Tabs
                    defaultValue="all"
                    className="w-[200px]"
                    onValueChange={(value) => setTaskFilter(value as "all" | "me")}
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="me">Assigned to Me</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent>
                  {filteredTasks.length > 0 ? (
                    <div className="space-y-4">
                      {filteredTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex flex-col rounded-lg border p-4 hover:bg-muted/50 cursor-pointer"
                          onClick={() => handleTaskClick(task.id)}
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <Badge variant="outline" className={getTaskStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </div>
                          <h3 className="mb-2 font-medium">{task.title}</h3>
                          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex -space-x-2">
                              {task.assignees.slice(0, 3).map((assigneeId) => {
                                const assignee = users.find((u) => u.id === assigneeId)
                                return assignee ? (
                                  <Avatar key={assignee.id} className="h-6 w-6 border-2 border-background">
                                    <AvatarImage src={assignee.avatar || "/placeholder.svg"} alt={assignee.name} />
                                    <AvatarFallback>
                                      {assignee.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                ) : null
                              })}
                              {task.assignees.length > 3 && (
                                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                                  +{task.assignees.length - 3}
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-muted-foreground">No tasks found</p>
                      <Button variant="outline" className="mt-2" onClick={() => setIsNewTaskOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add a task
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Team Members */}
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 rounded-md p-2 hover:bg-muted/50 cursor-pointer"
                        onClick={() => router.push(`/profile/${member.id}`)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Task Status Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Task Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>To Do</span>
                      <span className="font-medium">{projectTasks.filter((t) => t.status === "To Do").length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>In Progress</span>
                      <span className="font-medium">
                        {projectTasks.filter((t) => t.status === "In Progress").length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Review</span>
                      <span className="font-medium">{projectTasks.filter((t) => t.status === "Review").length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Completed</span>
                      <span className="font-medium">{projectTasks.filter((t) => t.status === "Completed").length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <NewTaskDialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen} projectId={projectId} />
    </div>
  )
}
