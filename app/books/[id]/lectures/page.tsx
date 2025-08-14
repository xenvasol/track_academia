"use client";

import { useState, useEffect, use } from "react";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import ProtectedRoute from "@/components/protected-route";
import Navbar from "@/components/navbar";
import FirebaseService, {
  type BookData,
  type LectureData,
} from "@/services/firebase-service";
import AddLectureModal from "@/components/add-lecture-modal";
import EditLectureModal from "@/components/edit-lecture-modal";

interface LecturesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function LecturesPage({ params }: LecturesPageProps) {
  const resolvedParams = use(params);
  const [book, setBook] = useState<BookData | null>(null);
  const [lectures, setLectures] = useState<LectureData[]>([]);
  const [selectedLecture, setSelectedLecture] = useState<LectureData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const { user } = useAuth();
  const firebaseService = FirebaseService.getInstance();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const bookData = await firebaseService.getBook(resolvedParams.id);
        if (!bookData) {
          setError("Book not found");
          return;
        }

        if (bookData.userId !== user.uid) {
          setError("You don't have permission to view this book");
          return;
        }

        setBook(bookData);

        const lecturesData = await firebaseService.getLectures(
          user.uid,
          resolvedParams.id
        );
        setLectures(lecturesData);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayLecture = lecturesData.find((lecture) => {
          const lectureDate = new Date(lecture.date);
          lectureDate.setHours(0, 0, 0, 0);
          return lectureDate.getTime() === today.getTime();
        });

        setSelectedLecture(todayLecture || lecturesData[0] || null);
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : "Failed to sign in");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id, user]);

  const handleLectureAdded = (newLecture: LectureData) => {
    setLectures((prev) => [newLecture, ...prev]);
    setSelectedLecture(newLecture);
    setShowAddModal(false);
  };

  const handleLectureUpdated = (updatedLecture: LectureData) => {
    setLectures((prev) =>
      prev.map((lecture) =>
        lecture.id === updatedLecture.id ? updatedLecture : lecture
      )
    );
    setSelectedLecture(updatedLecture);
    setShowEditModal(false);
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "difficult":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    const lectureDate = new Date(date);
    lectureDate.setHours(0, 0, 0, 0);

    if (lectureDate.getTime() === today.getTime()) {
      return "Today";
    } else if (lectureDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireDegree>
        <div className="min-h-screen bg-white">
          <Navbar />
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading lectures...</p>
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
          <div className="max-w-2xl mx-auto px-4 py-8">
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
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-black mb-2">Lectures</h1>
                <p className="text-gray-600">
                  {book.name} by {book.author}
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-indigo-700 text-white duration-150 transition-colors rounded hover:bg-indigo-800 cursor-pointer"
              >
                Add Today&apos;s Lecture
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="border border-gray-200 rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-black">
                    Lecture History
                  </h2>
                </div>
                <div className="p-0">
                  {lectures.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No lectures recorded yet
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {lectures.map((lecture) => (
                        <button
                          key={lecture.id}
                          onClick={() => setSelectedLecture(lecture)}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-l-4 ${
                            selectedLecture?.id === lecture.id
                              ? "border-black bg-gray-50"
                              : "border-transparent"
                          }`}
                        >
                          <div className="font-medium text-black">
                            {formatDate(lecture.date)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {lecture.topics.length} topic
                            {lecture.topics.length !== 1 ? "s" : ""}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              {selectedLecture ? (
                <div className="border border-gray-200 rounded-lg">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-black">
                          {formatDate(selectedLecture.date)}
                        </h2>
                        <p className="text-gray-600 mt-1">
                          {selectedLecture.topics.length} topic
                          {selectedLecture.topics.length !== 1 ? "s" : ""}{" "}
                          covered
                        </p>
                      </div>
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                      >
                        Edit Lecture
                      </button>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    {selectedLecture.topics.map((topic, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold text-black">
                            {topic.topic}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded border ${getDifficultyColor(
                              topic.level
                            )}`}
                          >
                            {topic.level}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {topic.definition}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg">
                  <div className="text-center py-12 px-6">
                    <h3 className="text-xl font-semibold text-black mb-2">
                      No Lectures Yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Start recording your daily lectures to track your learning
                      progress.
                    </p>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                    >
                      Add Your First Lecture
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {showAddModal && (
          <AddLectureModal
            bookId={resolvedParams.id}
            onClose={() => setShowAddModal(false)}
            onLectureAdded={handleLectureAdded}
          />
        )}

        {showEditModal && selectedLecture && (
          <EditLectureModal
            lecture={selectedLecture}
            onClose={() => setShowEditModal(false)}
            onLectureUpdated={handleLectureUpdated}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
