"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Plus, Search, Mail, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useApp } from "@/context/app-context"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function TeamPage() {
  const { users, addUser, removeUser } = useApp()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState("")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
  })

  if (!user) return null

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddUser = () => {
    if (!newUserData.name || !newUserData.email || !newUserData.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    addUser({
      name: newUserData.name,
      email: newUserData.email,
      role: newUserData.role,
      department: newUserData.department,
      avatar: "/placeholder.svg",
      joinDate: new Date().toISOString(),
    })

    toast({
      title: "User added",
      description: `${newUserData.name} has been added to the team`,
    })

    // Reset form and close dialog
    setNewUserData({
      name: "",
      email: "",
      role: "",
      department: "",
    })
    setIsAddUserOpen(false)
  }

  const handleDeleteUser = (userId: string) => {
    if (userId === user.id) {
      toast({
        title: "Error",
        description: "You cannot delete your own account",
        variant: "destructive",
      })
      return
    }

    removeUser(userId)
    toast({
      title: "User removed",
      description: "The user has been removed from the team",
    })
  }

  const handleMessageUser = (userId: string) => {
    router.push(`/messages?dm=${userId}`)
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-4">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Team</h1>
              <p className="text-muted-foreground">Manage your team members</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search team members..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {user.isAdmin && (
                <Button onClick={() => setIsAddUserOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Team Member
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((teamUser) => (
              <Card key={teamUser.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={teamUser.avatar || "/placeholder.svg"} alt={teamUser.name} />
                      <AvatarFallback>
                        {teamUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="mt-4 text-lg font-medium">{teamUser.name}</h3>
                    <p className="text-sm text-muted-foreground">{teamUser.role}</p>

                    {teamUser.department && <p className="mt-1 text-xs text-muted-foreground">{teamUser.department}</p>}

                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleMessageUser(teamUser.id)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Message
                      </Button>

                      {user.isAdmin && teamUser.id !== user.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteUser(teamUser.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="mt-10 text-center">
              <p className="text-muted-foreground">No team members found</p>
              {user.isAdmin && (
                <Button variant="outline" className="mt-2" onClick={() => setIsAddUserOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add a team member
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Name*</label>
              <Input
                placeholder="Enter name"
                value={newUserData.name}
                onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Email*</label>
              <Input
                type="email"
                placeholder="Enter email"
                value={newUserData.email}
                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Role*</label>
              <Input
                placeholder="Enter role (e.g. Developer, Designer)"
                value={newUserData.role}
                onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Department</label>
              <Input
                placeholder="Enter department (optional)"
                value={newUserData.department}
                onChange={(e) => setNewUserData({ ...newUserData, department: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Add Team Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
