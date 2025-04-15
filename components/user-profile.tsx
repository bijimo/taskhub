"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useApp } from "@/context/app-context"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

export function UserProfile() {
  const { projects, tasks } = useApp()
  const { user } = useAuth()
  const router = useRouter()

  if (!user) return null

  const userProjects = projects.filter((p) => p.team.includes(user.id)).length
  const userTasks = tasks.filter((t) => t.assignees.includes(user.id)).length

  const handleViewProfile = () => {
    router.push(`/profile/${user.id}`)
  }

  return (
    <Card className="border bg-card">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <h3 className="mt-4 text-lg font-medium">{user.name}</h3>
          <p className="text-sm text-muted-foreground">{user.role}</p>

          <div className="mt-6 grid w-full grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{userProjects}</p>
              <p className="text-xs text-muted-foreground">Projects</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{userTasks}</p>
              <p className="text-xs text-muted-foreground">Tasks</p>
            </div>
          </div>

          <Button className="mt-6 w-full" variant="outline" onClick={handleViewProfile}>
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
