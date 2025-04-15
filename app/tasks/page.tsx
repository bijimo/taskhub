"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useApp } from "@/context/app-context"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { NewTaskDialog } from "@/components/dialogs/new-task-dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function TasksPage() {
  const { tasks, projects, users } = useApp()
  const { user } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [projectFilter, setProjectFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false)
  const [showOnlyMyTasks, setShowOnlyMyTasks] = useState(true)

  if (!user) return null

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesProject = projectFilter === "all" || task.projectId === projectFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
    const matchesAssignee = showOnlyMyTasks ? task.assignees.includes(user.id) : true

    return matchesSearch && matchesStatus && matchesProject && matchesPriority && matchesAssignee
  })

  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    return project ? project.name : "Unknown Project"
  }

  const getAssignees = (assigneeIds: string[]) => {
    return users.filter((user) => assigneeIds.includes(user.id))
  }

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

  const handleTaskClick = (taskId: string) => {
    router.push(`/tasks/${taskId}`)
  }

  // Update the layout to be more responsive
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground md:flex-row">
      <Sidebar />
      <main className="flex-1 overflow-auto pb-16 pt-16 md:pt-0">
        <div className="container mx-auto p-4">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Tasks</h1>
              <p className="text-muted-foreground">Manage and track all your tasks</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={() => setIsNewTaskOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="my-tasks"
                checked={showOnlyMyTasks}
                onCheckedChange={setShowOnlyMyTasks}
                className="data-[state=checked]:bg-primary"
              />
              <Label htmlFor="my-tasks" className="font-medium">
                My Tasks
              </Label>
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>

              <select
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
              >
                <option value="all">All Projects</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

              <select
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <Card
                key={task.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleTaskClick(task.id)}
              >
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center justify-between flex-wrap gap-2">
                    <Badge variant="outline" className="bg-muted/50">
                      {getProjectName(task.projectId)}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                  </div>

                  <h3 className="mb-1 text-lg font-medium">{task.title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{task.description}</p>

                  <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {task.priority} Priority
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      {getAssignees(task.assignees)
                        .slice(0, 3)
                        .map((assignee) => (
                          <Avatar key={assignee.id} className="h-6 w-6 border-2 border-background">
                            <AvatarImage src={assignee.avatar || "/placeholder.svg"} alt={assignee.name} />
                            <AvatarFallback>
                              {assignee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      {task.assignees.length > 3 && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                          +{task.assignees.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="mt-10 text-center">
              <p className="text-muted-foreground">No tasks found</p>
              <Button variant="outline" className="mt-2" onClick={() => setIsNewTaskOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create a new task
              </Button>
            </div>
          )}
        </div>
      </main>

      <NewTaskDialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen} />
    </div>
  )
}
