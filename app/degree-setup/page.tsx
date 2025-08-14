"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ProtectedRoute from "@/components/protected-route"

export default function DegreeSetupPage() {
  const [degree, setDegree] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { updateUserData, userData } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!degree.trim()) {
      setError("Please enter your degree")
      return
    }

    setLoading(true)
    setError("")

    try {
      await updateUserData({ degree: degree.trim() })
      router.push("/dashboard")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to update degree")
    } finally {
      setLoading(false)
    }
  }

  // If user already has degree, redirect to dashboard
  if (userData?.degree) {
    router.push("/dashboard")
    return null
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black">Setup Your Degree</h1>
            <p className="text-gray-600 mt-2">Tell us about your academic program to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

            <div className="space-y-2">
              <Label htmlFor="degree" className="text-black">
                Degree Program
              </Label>
              <Input
                id="degree"
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                required
                className="border-gray-300 focus:border-black focus:ring-black"
                placeholder="e.g., Bachelor of Computer Science, Master of Business Administration"
              />
              <p className="text-sm text-gray-500">Enter your full degree name and specialization if any</p>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-black text-white hover:bg-gray-800 h-12">
              {loading ? "Saving..." : "Continue to Dashboard"}
            </Button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}
