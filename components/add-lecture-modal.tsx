"use client";

import type React from "react";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FirebaseService, {
  type LectureData,
  type TopicData,
} from "@/services/firebase-service";

interface AddLectureModalProps {
  bookId: string;
  onClose: () => void;
  onLectureAdded: (lecture: LectureData) => void;
}

export default function AddLectureModal({
  bookId,
  onClose,
  onLectureAdded,
}: AddLectureModalProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [topics, setTopics] = useState<TopicData[]>([
    { topic: "", definition: "", level: "easy" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const firebaseService = FirebaseService.getInstance();

  const addTopic = () => {
    setTopics([...topics, { topic: "", definition: "", level: "easy" }]);
  };

  const removeTopic = (index: number) => {
    if (topics.length > 1) {
      setTopics(topics.filter((_, i) => i !== index));
    }
  };

  const updateTopic = (
    index: number,
    field: keyof TopicData,
    value: string
  ) => {
    const updatedTopics = [...topics];
    updatedTopics[index] = { ...updatedTopics[index], [field]: value };
    setTopics(updatedTopics);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate topics
    const validTopics = topics.filter(
      (topic) => topic.topic.trim() && topic.definition.trim()
    );
    if (validTopics.length === 0) {
      setError("Please add at least one topic with both name and definition");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const lectureData: LectureData = {
        userId: user.uid,
        bookId,
        date: new Date(date),
        topics: validTopics,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const lectureId = await firebaseService.createLecture(lectureData);
      const createdLecture = { ...lectureData, id: lectureId };
      onLectureAdded(createdLecture);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Failed to add lecture"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-gray-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-[#5044e5]">Add New Lecture</CardTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-gray-500 hover:text-black"
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="date" className="text-black">
                Lecture Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="border-gray-300 focus:border-black focus:ring-black"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-black text-lg">Topics Covered</Label>
                <Button
                  type="button"
                  onClick={addTopic}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  Add Topic
                </Button>
              </div>

              {topics.map((topic, index) => (
                <Card key={index} className="border-gray-200">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-black">
                        Topic {index + 1}
                      </h4>
                      {topics.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeTopic(index)}
                          variant="ghost"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-black">Topic Name</Label>
                      <Input
                        value={topic.topic}
                        onChange={(e) =>
                          updateTopic(index, "topic", e.target.value)
                        }
                        placeholder="Enter topic name"
                        className="border-gray-300 focus:border-black focus:ring-black"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-black">Definition/Notes</Label>
                      <Textarea
                        value={topic.definition}
                        onChange={(e) =>
                          updateTopic(index, "definition", e.target.value)
                        }
                        placeholder="Enter definition or notes about this topic"
                        rows={3}
                        className="border-gray-300 focus:border-black focus:ring-black"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-black">Difficulty Level</Label>
                      <Select
                        value={topic.level}
                        onValueChange={(value) =>
                          updateTopic(
                            index,
                            "level",
                            value as "easy" | "moderate" | "difficult"
                          )
                        }
                      >
                        <SelectTrigger className="border-gray-300 focus:border-black focus:ring-black">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="difficult">Difficult</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-black text-white hover:bg-gray-800"
              >
                {loading ? "Adding Lecture..." : "Add Lecture"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
