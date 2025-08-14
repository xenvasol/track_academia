"use client";

import type React from "react";
import { useState, useRef } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";

interface FileUploadProps {
  label: string;
  accept?: string;
  maxSize?: number; // in MB
  currentImageUrl?: string;
  onUploadComplete: (url: string) => void;
  onUploadError: (error: string) => void;
  className?: string;
}

export default function FileUpload({
  label,
  accept = "image/*",
  maxSize = 5,
  currentImageUrl,
  onUploadComplete,
  onUploadError,
  className = "",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(currentImageUrl || "");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return "Please select an image file";
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      return `File size must be less than ${maxSize}MB`;
    }

    return null;
  };

  const handleFileSelect = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      onUploadError(validationError);
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const downloadUrl = await uploadToCloudinary(file);
      onUploadComplete(downloadUrl);
    } catch (error: any) {
      onUploadError(error.message || "Failed to upload file");
      setPreview(currentImageUrl || "");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-black">{label}</label>

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? "border-black bg-gray-50"
            : uploading
            ? "border-gray-300 bg-gray-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {preview ? (
          <div className="space-y-4">
            <div className="w-32 h-40 mx-auto border border-gray-200 rounded overflow-hidden">
              <img
                src={preview || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={openFileDialog}
                disabled={uploading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Change Image"}
              </button>
              {uploading && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-black h-2 rounded-full animate-pulse"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-gray-400">
              <div className="text-4xl mb-2">📁</div>
              <p className="text-sm">
                {uploading
                  ? "Uploading..."
                  : "Drag and drop an image here, or click to select"}
              </p>
            </div>
            <button
              type="button"
              onClick={openFileDialog}
              disabled={uploading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Select Image"}
            </button>
            {uploading && (
              <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
                <div
                  className="bg-black h-2 rounded-full animate-pulse"
                  style={{ width: "60%" }}
                ></div>
              </div>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      <p className="text-xs text-gray-500">
        Supported formats: JPG, PNG, GIF. Max size: {maxSize}MB
      </p>
    </div>
  );
}
