"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/protected-route";
import Navbar from "@/components/navbar";
import FileUpload from "@/components/file-upload";
import FirebaseService, { type BookData } from "@/services/firebase-service";

interface PageParams {
  id: string;
}

interface EditBookPageProps {
  params: Promise<PageParams>;
}

export default function EditBookPage({
  params: paramsPromise,
}: EditBookPageProps) {
  const params = use(paramsPromise);
  const [book, setBook] = useState<BookData | null>(null);
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const router = useRouter();
  const firebaseService = FirebaseService.getInstance();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookData = await firebaseService.getBook(params.id);
        if (!bookData) {
          setError("Book not found");
          return;
        }

        if (bookData.userId !== user?.uid) {
          setError("You don't have permission to edit this book");
          return;
        }

        setBook(bookData);
        setName(bookData.name);
        setAuthor(bookData.author);
        setImageUrl(bookData.imageUrl || "");
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : "Failed to sign in");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBook();
    }
  }, [params.id, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !author.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    if (!book) return;

    setSaving(true);
    setError("");

    try {
      const updates = {
        name: name.trim(),
        author: author.trim(),
        imageUrl,
        updatedAt: new Date(),
      };

      await firebaseService.updateBook(book.id!, updates);
      router.push(`/books/${book.id}`);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to sign in");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireDegree>
        <div className="min-h-screen bg-white">
          <Navbar />
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading book...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !book) {
    return (
      <ProtectedRoute requireDegree>
        <div className="min-h-screen bg-white">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="border border-red-200 rounded-lg">
              <div className="text-center py-12 px-6">
                <h3 className="text-xl font-semibold text-red-600 mb-2">
                  Error
                </h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <Link href="/books">
                  <button className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
                    Back to Books
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireDegree>
      <div className="min-h-screen bg-white">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link
              href={`/books/${book.id}`}
              className="text-gray-600 hover:text-black mb-4 inline-block"
            >
              ← Back to Book Details
            </Link>
            <h1 className="text-3xl font-bold text-black mb-2">Edit Book</h1>
            <p className="text-gray-600">Update your book information</p>
          </div>

          <div className="border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-black">
                Book Information
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <div className="flex flex-col-reverse w-full items-center justify-between lg:flex-row-reverse gap-8">
                  <div className="w-full flex flex-col gap-5">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-black"
                      >
                        Book Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-indigo-700"
                        placeholder="Enter the book title"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="author"
                        className="block text-sm font-medium text-black"
                      >
                        Author *
                      </label>
                      <input
                        id="author"
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-indigo-700"
                        placeholder="Enter the author's name"
                      />
                    </div>

                    <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 pt-4">
                      <Link href={`/books/${book.id}`} className="flex-1">
                        <button
                          type="button"
                          className="w-full cursor-pointer px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </Link>
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 cursor-pointer px-4 py-2 bg-indigo-700 text-white rounded hover:bg-indigo-800 disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>

                  <FileUpload
                    label="Book Cover Image (Optional)"
                    currentImageUrl={imageUrl}
                    onUploadComplete={setImageUrl}
                    onUploadError={setError}
                    maxSize={5}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
