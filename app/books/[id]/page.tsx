"use client"

import { useState, useEffect, use } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import ProtectedRoute from "@/components/protected-route"
import Navbar from "@/components/navbar"
import FirebaseService, { type BookData } from "@/services/firebase-service"
import Image from "next/image"

interface BookDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default function BookDetailsPage({ params }: BookDetailsPageProps) {
  const resolvedParams = use(params)
  const [book, setBook] = useState<BookData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const { user } = useAuth()
  const router = useRouter()
  const firebaseService = FirebaseService.getInstance()

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookData = await firebaseService.getBook(resolvedParams.id)
        if (!bookData) {
          setError("Book not found")
          return
        }

        if (bookData.userId !== user?.uid) {
          setError("You don't have permission to view this book")
          return
        }

        setBook(bookData)
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : "Failed to sign in")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchBook()
    }
  }, [resolvedParams.id, user])

  const handleDelete = async () => {
    if (!book || !confirm("Are you sure you want to delete this book? This action cannot be undone.")) {
      return
    }

    try {
      await firebaseService.deleteBook(book.id!)
      router.push("/books")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to delete book")
    }
  }

  if (loading) {
    return (
      <ProtectedRoute requireDegree>
        <div className="min-h-screen bg-white">
          <Navbar />
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading book details...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error || !book) {
    return (
      <ProtectedRoute requireDegree>
        <div className="min-h-screen bg-white">
          <Navbar />
          <div className="max-w-2xl mx-auto px-4 py-8">
            <Card className="border-red-200">
              <CardContent className="text-center py-12">
                <h3 className="text-xl font-semibold text-red-600 mb-2">Error</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <Link href="/books">
                  <Button className="bg-black text-white hover:bg-gray-800">Back to Books</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requireDegree>
      <div className="min-h-screen bg-white">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link href="/books" className="text-gray-600 hover:text-black mb-4 inline-block">
              ← Back to Books
            </Link>
            <h1 className="text-3xl font-bold text-black mb-2">Book Details</h1>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <div className="aspect-[3/4] bg-gray-100 rounded mb-4 overflow-hidden">
                    {book.imageUrl ? (
                      <Image
                        src={book.imageUrl || "/placeholder.svg"}
                        alt={book.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <div className="text-6xl mb-4">📚</div>
                          <p>No Image</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Link href={`/books/${book.id}/edit`} className="block">
                      <Button
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                      >
                        Edit Book
                      </Button>
                    </Link>

                    <Link href={`/books/${book.id}/lectures`} className="block">
                      <Button className="w-full bg-indigo-700 text-white hover:bg-indigo-800">View Lectures</Button>
                    </Link>

                    <Button
                      onClick={handleDelete}
                      variant="outline"
                      className="w-full border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                    >
                      Delete Book
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-black">Book Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-2">Title</h3>
                    <p className="text-gray-700">{book.name}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-black mb-2">Author</h3>
                    <p className="text-gray-700">{book.author}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-black mb-2">Added On</h3>
                    <p className="text-gray-700">{book.createdAt.toLocaleDateString()}</p>
                  </div>

                  {book.updatedAt.getTime() !== book.createdAt.getTime() && (
                    <div>
                      <h3 className="text-lg font-semibold text-black mb-2">Last Updated</h3>
                      <p className="text-gray-700">{book.updatedAt.toLocaleDateString()}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
