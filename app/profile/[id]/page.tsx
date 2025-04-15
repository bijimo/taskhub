"use client"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useApp } from "@/context/app-context"
import { useParams, useRouter } from "next/navigation"
import { Mail, Calendar, Building } from "lucide-react"

export default function ProfilePage() {
  const { users, projects, tasks } = useApp()
  const params = useParams()
  const router = useRouter()

  const userId = params.id as string
  const user = users.find((u) => u.id === userId)

  if (!user) {
    return (
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4">
            <div className="flex h-[80vh] items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold">User not found</h1>
                <p className="text-muted-foreground">The user you're looking for doesn't exist</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push("/team")}>
                  Back to Team
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Get user's projects
  const userProjects = projects.filter((project) => project.team.includes(userId))

  // Get user's tasks
  const userTasks = tasks.filter((task) => task.assignees.includes(userId))
  const completedTasks = userTasks.filter((task) => task.status === "Completed").length
  const taskCompletionRate = userTasks.length > 0 ? Math.round((completedTasks / userTasks.length) * 100) : 0

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-4">
          <div className="mb-6">
            <Button variant="outline" className="mb-4" onClick={() => router.back()}>
              Back
            </Button>
            <h1 className="text-2xl font-bold">User Profile</h1>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* User Info Card */}
            <Card className="lg:col-span-1">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="mt-4 text-xl font-bold">{user.name}</h2>
                  <p className="text-muted-foreground">{user.role}</p>

                  <div className="mt-6 w-full space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>

                    {user.department && (
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-muted-foreground" />
                        <span>{user.department}</span>
                      </div>
                    )}

                    {user.joinDate && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <Button className="mt-6 w-full" onClick={() => router.push(`/messages?dm=${userId}`)}>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats and Projects */}
            <div className="space-y-6 lg:col-span-2">
              {/* Stats */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold">{userProjects.length}</p>
                      <p className="text-sm text-muted-foreground">Projects</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold">{userTasks.length}</p>
                      <p className="text-sm text-muted-foreground">Tasks</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold">{taskCompletionRate}%</p>
                      <p className="text-sm text-muted-foreground">Completion Rate</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Projects */}
              <Card>
                <CardHeader>
                  <CardTitle>Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  {userProjects.length > 0 ? (
                    <div className="space-y-4">
                      {userProjects.map((project) => (
                        <div
                          key={project.id}
                          className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50 cursor-pointer"
                          onClick={() => router.push(`/projects/${project.id}`)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: project.color }}></div>
                            <div>
                              <p className="font-medium">{project.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Due: {new Date(project.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-sm">{project.status}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-4 text-center text-muted-foreground">No projects assigned</div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  {userTasks.length > 0 ? (
                    <div className="space-y-4">
                      {userTasks.slice(0, 5).map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50 cursor-pointer"
                          onClick={() => router.push(`/tasks/${task.id}`)}
                        >
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-xs text-muted-foreground">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div
                            className={`rounded-full px-2 py-1 text-xs ${
                              task.status === "Completed"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-blue-500/10 text-blue-500"
                            }`}
                          >
                            {task.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-4 text-center text-muted-foreground">No tasks assigned</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
