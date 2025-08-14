"use client";

import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import ProtectedRoute from "@/components/protected-route";
import Navbar from "@/components/navbar";
import Breadcrumbs from "@/components/breadcrumbs";
import LoadingSpinner from "@/components/loading-spinner";
import EmptyState from "@/components/empty-state";
import FirebaseService, { type BookData } from "@/services/firebase-service";

export default function BooksPage() {
  const { user } = useAuth();
  const [books, setBooks] = useState<BookData[]>([]);
  const [loading, setLoading] = useState(true);

  const firebaseService = FirebaseService.getInstance();

  useEffect(() => {
    const fetchBooks = async () => {
      if (user) {
        try {
          const userBooks = await firebaseService.getBooks(user.uid);
          setBooks(userBooks);
        } catch (error) {
          console.error("Error fetching books:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBooks();
  }, [user]);

  return (
    <ProtectedRoute requireDegree>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 py-8">
          <Breadcrumbs />

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">My Books</h1>
              <p className="text-gray-600">
                Manage all your course books and materials
              </p>
            </div>

            <Link href="/books/add">
              <Button className="bg-black text-white hover:bg-gray-800">
                Add New Book
              </Button>
            </Link>
          </div>

          {loading ? (
            <Card className="border-gray-200 bg-white">
              <CardContent className="text-center py-12">
                <LoadingSpinner size="lg" className="mx-auto mb-4" />
                <p className="text-gray-600">Loading your books...</p>
              </CardContent>
            </Card>
          ) : books.length === 0 ? (
            <EmptyState
              title="No Books Yet"
              description="Start by adding your first book or course to begin tracking your academic progress and daily lectures."
              actionLabel="Add Your First Book"
              onAction={() => (window.location.href = "/books/add")}
              icon={<div className="text-6xl">📚</div>}
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {books.map((book) => (
                <Card
                  key={book.id}
                  className="border-gray-200 bg-white hover:shadow-md transition-all duration-200 group w-48 h-64"
                >
                  <CardContent className="p-2 h-full flex flex-col">
                    <Link href={`/books/${book.id}/lectures`} className="block">
                      <div className="h-28 bg-gray-50 rounded mb-2 overflow-hidden relative">
                        {book.imageUrl ? (
                          <img
                            src={book.imageUrl}
                            alt={book.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <div className="text-center">
                              <div className="text-2xl">📖</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="flex-grow">
                      <h3 className="font-medium text-sm line-clamp-2 leading-tight text-black mb-1">
                        {book.name}
                      </h3>
                      <p className="text-gray-500 text-xs mb-2">
                        by {book.author}
                      </p>
                    </div>

                    <div className="flex gap-1.5 mt-auto">
                      <Link href={`/books/${book.id}/edit`} className="flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full h-8 text-xs px-2 border-gray-200 hover:bg-gray-50"
                        >
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/books/${book.id}`} className="flex-1">
                        <Button
                          size="sm"
                          className="w-full h-8 text-xs px-2 bg-black hover:bg-gray-800"
                        >
                          View
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
