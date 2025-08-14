"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProtectedRoute from "@/components/protected-route"
import Navbar from "@/components/navbar"
import FileUpload from "@/components/file-upload"
import FirebaseService from "@/services/firebase-service"

export default function AddBookPage() {
  const [name, setName] = useState("")
  const [author, setAuthor] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { user } = useAuth()
  const router = useRouter()
  const firebaseService = FirebaseService.getInstance()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !author.trim()) {
      setError("Please fill in all required fields")
      return
    }

    if (!user) return

    setLoading(true)
    setError("")

    try {
      const bookData = {
        userId: user.uid,
        name: name.trim(),
        author: author.trim(),
        imageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await firebaseService.createBook(bookData)
      router.push("/books")
    } catch (error: any) {
      setError(error.message || "Failed to add book")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute requireDegree>
      <div className="min-h-screen bg-white">
        <Navbar />

        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Add New Book</h1>
            <p className="text-gray-600">Register a new course book or study material</p>
          </div>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">Book Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-black">
                    Book Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border-gray-300 focus:border-black focus:ring-black"
                    placeholder="Enter the book title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author" className="text-black">
                    Author *
                  </Label>
                  <Input
                    id="author"
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    className="border-gray-300 focus:border-black focus:ring-black"
                    placeholder="Enter the author's name"
                  />
                </div>

                <FileUpload
                  label="Book Cover Image (Optional)"
                  onUploadComplete={setImageUrl}
                  onUploadError={setError}
                  maxSize={5}
                />

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1 bg-black text-white hover:bg-gray-800">
                    {loading ? "Adding Book..." : "Add Book"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
