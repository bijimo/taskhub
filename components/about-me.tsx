"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { Mail, Calendar, Building, MapPin, Phone } from "lucide-react"
import { useRouter } from "next/navigation"

export function AboutMe() {
  const { user } = useAuth()
  const router = useRouter()

  if (!user) return null

  const handleEditProfile = () => {
    router.push("/settings")
  }

  return (
    <Card className="border bg-card">
      <CardHeader>
        <CardTitle>About Me</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20">
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

          <div className="mt-6 w-full space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user.email}</span>
            </div>

            {user.department && (
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.department}</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Berlin, Germany</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">+49 123 456 7890</span>
            </div>

            {user.joinDate && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Joined {new Date(user.joinDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          <Button variant="outline" className="mt-6 w-full" onClick={handleEditProfile}>
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
