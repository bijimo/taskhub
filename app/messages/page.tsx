"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useApp } from "@/context/app-context"
import { useAuth } from "@/context/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from "lucide-react"

export default function MessagesPage() {
  const { users, messages, addMessage } = useApp()
  const { user } = useAuth()
  const [newMessage, setNewMessage] = useState("")
  const [activeChannel, setActiveChannel] = useState("general")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isUserValid, setIsUserValid] = useState(false)

  useEffect(() => {
    setIsUserValid(!!user)
  }, [user])

  // Filter messages for the current channel
  const channelMessages = messages.filter((msg) => msg.channelId === activeChannel && !msg.recipientId)

  // Get direct message conversations
  const directMessageUsers = users.filter((u) => u.id !== user.id)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    addMessage({
      senderId: user.id,
      content: newMessage,
      channelId: activeChannel,
    })

    setNewMessage("")
  }

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  const getSenderName = (senderId: string) => {
    const sender = users.find((user) => user.id === senderId)
    return sender ? sender.name : "Unknown User"
  }

  const getSenderAvatar = (senderId: string) => {
    const sender = users.find((user) => user.id === senderId)
    return sender ? sender.avatar : "/placeholder.svg"
  }

  if (!isUserValid) return null

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 overflow-hidden">
        {/* Channels and DMs sidebar */}
        <div className="w-64 border-r bg-card overflow-y-auto">
          <div className="p-4">
            <h2 className="font-semibold mb-2">Channels</h2>
            <div className="space-y-1">
              <button
                className={`w-full text-left px-3 py-2 rounded-md ${activeChannel === "general" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                onClick={() => setActiveChannel("general")}
              >
                # General
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-md ${activeChannel === "random" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                onClick={() => setActiveChannel("random")}
              >
                # Random
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-md ${activeChannel === "announcements" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                onClick={() => setActiveChannel("announcements")}
              >
                # Announcements
              </button>
            </div>

            <h2 className="font-semibold mt-6 mb-2">Direct Messages</h2>
            <div className="space-y-1">
              {directMessageUsers.map((dmUser) => (
                <button
                  key={dmUser.id}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2 ${activeChannel === `dm-${dmUser.id}` ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                  onClick={() => setActiveChannel(`dm-${dmUser.id}`)}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={dmUser.avatar || "/placeholder.svg"} alt={dmUser.name} />
                    <AvatarFallback>
                      {dmUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{dmUser.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          <div className="border-b p-4">
            <h1 className="text-xl font-bold">
              {activeChannel.startsWith("dm-")
                ? `${getSenderName(activeChannel.replace("dm-", ""))}`
                : `#${activeChannel}`}
            </h1>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {channelMessages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No messages yet. Start the conversation!
              </div>
            ) : (
              <div className="space-y-4">
                {channelMessages.map((message, index) => {
                  // Check if we need to show a date separator
                  const showDateSeparator =
                    index === 0 ||
                    formatMessageDate(message.timestamp) !== formatMessageDate(channelMessages[index - 1].timestamp)

                  return (
                    <div key={message.id}>
                      {showDateSeparator && (
                        <div className="flex items-center my-4">
                          <div className="flex-grow border-t border-border"></div>
                          <div className="mx-4 text-xs text-muted-foreground">
                            {formatMessageDate(message.timestamp)}
                          </div>
                          <div className="flex-grow border-t border-border"></div>
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={getSenderAvatar(message.senderId) || "/placeholder.svg"}
                            alt={getSenderName(message.senderId)}
                          />
                          <AvatarFallback>
                            {getSenderName(message.senderId)
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{getSenderName(message.senderId)}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatMessageTime(message.timestamp)}
                            </span>
                          </div>
                          <p className="mt-1">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder={`Message ${activeChannel.startsWith("dm-") ? getSenderName(activeChannel.replace("dm-", "")) : "#" + activeChannel}`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
