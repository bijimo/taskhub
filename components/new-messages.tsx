"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useApp } from "@/context/app-context"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

export function NewMessages() {
  const { messages, users } = useApp()
  const { user } = useAuth()
  const router = useRouter()

  if (!user) return null

  // Get recent messages (last 24 hours)
  const oneDayAgo = new Date()
  oneDayAgo.setDate(oneDayAgo.getDate() - 1)

  const recentMessages = messages
    .filter((msg) => {
      const msgDate = new Date(msg.timestamp)
      return msgDate > oneDayAgo && (msg.recipientId === user.id || (msg.channelId && !msg.recipientId))
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 3)

  const getSender = (senderId: string) => {
    return users.find((u) => u.id === senderId)
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleViewMessages = () => {
    router.push("/messages")
  }

  return (
    <Card className="border bg-card">
      <CardHeader>
        <CardTitle>New Messages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentMessages.length > 0 ? (
          <>
            {recentMessages.map((message) => {
              const sender = getSender(message.senderId)
              return (
                <div key={message.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={sender?.avatar || "/placeholder.svg"} alt={sender?.name || "User"} />
                    <AvatarFallback>
                      {sender?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{sender?.name}</p>
                      <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{message.content}</p>
                  </div>
                </div>
              )
            })}
            <Button variant="outline" className="w-full" onClick={handleViewMessages}>
              View All Messages
            </Button>
          </>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <p>No new messages</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
