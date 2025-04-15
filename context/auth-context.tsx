"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import type { User } from "@/lib/types"
import { initialUsers } from "@/lib/initial-data"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string, remember: boolean) => Promise<boolean>
  logout: () => void
  register: (name: string, email: string, password: string, role: string) => Promise<boolean>
  updateProfile: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Public routes that don't require authentication
const publicRoutes = ["/login", "/register"]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("taskHub_user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("taskHub_user")
      }
    }
    setIsLoading(false)
  }, [])

  // Handle routing based on auth state
  useEffect(() => {
    if (!isLoading) {
      // Only redirect to login if user is null and we're not on a public route
      // and not navigating to internal Next.js routes or API routes
      if (!user && !publicRoutes.includes(pathname) && !pathname.startsWith("/_next") && !pathname.startsWith("/api")) {
        // Store the current path to redirect back after login
        sessionStorage.setItem("redirectAfterLogin", pathname)
        router.push("/login")
      }
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string, remember: boolean) => {
    // Special case for demo credentials
    if (email.toLowerCase() === "demo@icmw.de" && password === "icmw2018") {
      const demoUser = initialUsers.find((u) => u.email.toLowerCase() === "demo@icmw.de")
      if (demoUser) {
        setUser(demoUser)
        // Always store user in localStorage to prevent session loss
        localStorage.setItem("taskHub_user", JSON.stringify(demoUser))

        // Redirect to the stored path if available
        const redirectPath = sessionStorage.getItem("redirectAfterLogin")
        if (redirectPath) {
          sessionStorage.removeItem("redirectAfterLogin")
          router.push(redirectPath)
        } else {
          router.push("/dashboard")
        }

        return true
      }
    }

    // For other users (in a real app, this would be an API call)
    const foundUser = initialUsers.find((u) => u.email.toLowerCase() === email.toLowerCase() && password === "icmw2018")

    if (foundUser) {
      setUser(foundUser)
      // Always store user in localStorage to prevent session loss
      localStorage.setItem("taskHub_user", JSON.stringify(foundUser))
      return true
    }

    toast({
      title: "Login failed",
      description: "Invalid email or password",
      variant: "destructive",
    })
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("taskHub_user")
    router.push("/login")
  }

  const register = async (name: string, email: string, password: string, role: string) => {
    // In a real app, this would send the registration to an API
    // For demo, we'll just show a success message
    toast({
      title: "Registration submitted",
      description: "Your account is pending admin approval. You'll receive an email when approved.",
    })

    // Simulate sending an email to admin
    console.log(`Registration request sent to admin (aw@icmw.de):
      Name: ${name}
      Email: ${email}
      Role: ${role}
    `)

    return true
  }

  const updateProfile = (userData: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    localStorage.setItem("taskHub_user", JSON.stringify(updatedUser))

    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    })
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
