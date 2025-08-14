"use client";

import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/protected-route";
import Navbar from "@/components/navbar";
import Breadcrumbs from "@/components/breadcrumbs";
import LoadingSpinner from "@/components/loading-spinner";
import EmptyState from "@/components/empty-state";
import FirebaseService, { type BookData } from "@/services/firebase-service";
import Image from "next/image";

export default function DashboardPage() {
  const { user, userData } = useAuth();
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

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#5044e5] mb-2">
              Welcome back!
            </h1>
            <p className="text-gray-600">
              Degree:{" "}
              <span className="font-medium text-black">{userData?.degree}</span>
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-indigo-800 text-lg font-semibold mb-2">
                Total Books
              </h3>
              <p className="text-3xl font-bold text-black">{books.length}</p>
              <p className="text-sm text-gray-600 mt-1">Registered courses</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-indigo-800 text-lg font-semibold mb-2">
                This Week
              </h3>
              <p className="text-3xl font-bold text-black">0</p>
              <p className="text-sm text-gray-600 mt-1">Lectures recorded</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-indigo-800 text-lg font-semibold mb-2">
                Progress
              </h3>
              <p className="text-3xl font-bold text-black">
                {books.length > 0 ? "Active" : "Getting Started"}
              </p>
              <p className="text-sm text-gray-600 mt-1">Learning status</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link href="/books/add">
              <button className="bg-indigo-700 text-white h-12 px-6 rounded-md font-medium transition-colors">
                Add New Book
              </button>
            </Link>

            {books.length > 0 && (
              <Link href="/books">
                <button className="border border-gray-700 text-gray-700 hover:bg-gray-50 bg-white h-12 px-6 rounded-md font-medium transition-colors">
                  View All Books
                </button>
              </Link>
            )}
          </div>

          {loading ? (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="text-center py-12">
                <LoadingSpinner size="lg" className="mx-auto mb-4" />
                <p className="text-gray-600">Loading your books...</p>
              </div>
            </div>
          ) : books.length === 0 ? (
            <EmptyState
              title="No Books Yet"
              description="Start by adding your first book or course to begin tracking your academic progress and daily lectures."
              actionLabel="Add Your First Book"
              onAction={() => (window.location.href = "/books/add")}
              icon={<div className="text-6xl">📚</div>}
            />
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-black mb-6">
                Recent Books
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {books.slice(0, 6).map((book) => (
                  <div
                    key={book.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition-all duration-150 group w-48 h-64 flex flex-col" // Fixed height + flex column
                  >
                    <Link
                      href={`/books/${book.id}/lectures`}
                      className="block flex-grow"
                    >
                      <div className="h-32 w-full bg-gray-50 rounded-t-lg overflow-hidden relative">
                        {" "}
                        {/* Fixed image height */}
                        {book.imageUrl ? (
                          <Image
                            src={book.imageUrl}
                            alt={book.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100">
                            <div className="text-center">
                              <div className="text-2xl">📖</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-2 flex flex-col flex-grow">
                      {" "}
                      {/* Compact padding */}
                      <div className="mb-1 flex-grow">
                        {" "}
                        {/* Content grows to fill space */}
                        <h3 className="font-medium text-black text-xs line-clamp-2 leading-tight">
                          {book.name}
                        </h3>
                        <p className="text-gray-500 text-2xs mt-0.5">
                          by {book.author}
                        </p>{" "}
                        {/* Ultra small text */}
                      </div>
                      <div className="flex gap-1.5 mt-auto">
                        {" "}
                        {/* Buttons at bottom */}
                        <Link
                          href={`/books/${book.id}/edit`}
                          className="flex-1"
                        >
                          <button className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs py-1 px-1.5 rounded cursor-pointer">
                            Edit
                          </button>
                        </Link>
                        <Link href={`/books/${book.id}`} className="flex-1">
                          <button className="w-full bg-indigo-600 text-white hover:bg-indigo-700 text-xs py-1 px-1.5 rounded cursor-pointer">
                            View
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
