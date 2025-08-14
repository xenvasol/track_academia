interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  error?: {
    message: string;
  };
}

interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  uploadPreset: string;
  assetFolder: string;
}

// Configuration (consider moving to environment variables)
const CLOUDINARY_CONFIG: CloudinaryConfig = {
  cloudName: "tenantify",
  apiKey: "912722335877979",
  apiSecret: "RrdFKdW7pbRuXXI8jRgEHzrEx1M",
  uploadPreset: "rentalify",
  assetFolder: "trackacademia_books",
};

// Supported image MIME types
const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;

// Maximum file size (10MB)
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * Validates the file before upload
 * @throws {Error} If file is invalid
 */
function validateFile(file: File): void {
  if (!file || !(file instanceof File)) {
    throw new Error("Invalid file provided for upload");
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("File size exceeds 10MB limit");
  }

  if (!SUPPORTED_IMAGE_TYPES.includes(file.type as any)) {
    throw new Error("Only JPEG, PNG, GIF, or WebP images are allowed");
  }
}

/**
 * Uploads a file to Cloudinary
 * @param file - The file to upload
 * @returns Promise resolving to the secure URL of the uploaded image
 * @throws {Error} If upload fails
 */
export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    // Validate input file
    validateFile(file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
    formData.append("folder", CLOUDINARY_CONFIG.assetFolder);

    console.log("Starting Cloudinary upload for file:", file.name);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data: CloudinaryUploadResponse = await response.json();

    if (!response.ok || data.error) {
      const errorMessage = data.error?.message || "Unknown Cloudinary error";
      throw new Error(errorMessage);
    }

    console.log("Successfully uploaded to Cloudinary:", data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", {
      error,
      fileInfo: {
        name: file?.name,
        size: file?.size,
        type: file?.type,
      },
    });

    throw new Error(
      error instanceof Error
        ? `Failed to upload image to Cloudinary: ${error.message}`
        : "Failed to upload image to Cloudinary"
    );
  }
};
