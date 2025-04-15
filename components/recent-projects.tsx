"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useApp } from "@/context/app-context"
import { useRouter } from "next/navigation"

export function RecentProjects() {
  const { projects, users } = useApp()
  const router = useRouter()

  // Sort projects by due date (most recent first) and take the first 3
  const recentProjects = [...projects]
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3)

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
    <Card className="border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Projects</CardTitle>
        <Link href="/projects" className="text-sm text-blue-500 hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent className="space-y-6">
        {recentProjects.map((project) => (
          <div
            key={project.id}
            className="space-y-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
            onClick={() => handleProjectClick(project.id)}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-medium">{project.name}</h3>
              <Badge variant="outline" className={getStatusColor(project.status)}>
                {project.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Progress</p>
            <div className="flex items-center gap-2">
              <Progress
                value={project.progress}
                className="h-2"
                indicatorClassName={getProgressColor(project.progress)}
              />
              <span className="text-xs font-medium">{project.progress}%</span>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex -space-x-2">
                {getTeamMembers(project.team).map((member) => (
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
              </div>
              <span className="text-xs text-muted-foreground">
                Due: {new Date(project.dueDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
