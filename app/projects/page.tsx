"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useApp } from "@/context/app-context"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { NewProjectDialog } from "@/components/dialogs/new-project-dialog"

export default function ProjectsPage() {
  const { projects, users } = useApp()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false)

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter

    return matchesSearch && matchesStatus
  })

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

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-green-500"
    if (progress > 50) return "bg-blue-500"
    return "bg-amber-500"
  }

  const getTeamMembers = (teamIds: string[]) => {
    return users.filter((user) => teamIds.includes(user.id))
  }

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground md:flex-row">
      <Sidebar />
      <main className="flex-1 overflow-auto pb-16 pt-16 md:pt-0">
        <div className="container mx-auto p-4">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Projects</h1>
              <p className="text-muted-foreground">Manage and track all your projects</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
              <Button onClick={() => setIsNewProjectOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleProjectClick(project.id)}
              >
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center justify-between flex-wrap gap-2">
                    <Badge variant="outline" className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                    <Badge variant="outline" className="bg-muted/50">
                      {project.priority}
                    </Badge>
                  </div>

                  <h3 className="mb-1 text-lg font-medium">{project.name}</h3>
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{project.description}</p>

                  <div className="mb-4">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress
                      value={project.progress}
                      className="h-2"
                      indicatorClassName={getProgressColor(project.progress)}
                    />
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex -space-x-2">
                      {getTeamMembers(project.team)
                        .slice(0, 3)
                        .map((member) => (
                          <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      {project.team.length > 3 && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                          +{project.team.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Due: {new Date(project.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="mt-10 text-center">
              <p className="text-muted-foreground">No projects found</p>
              <Button variant="outline" className="mt-2" onClick={() => setIsNewProjectOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create a new project
              </Button>
            </div>
          )}
        </div>
      </main>

      <NewProjectDialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen} />
    </div>
  )
}
