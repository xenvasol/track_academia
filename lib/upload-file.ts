import { firebaseStorage } from "@/services";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

/**
 * Utility to generate a 6-character random alphanumeric string.
 */
const generateRandomString = (): string => {
  return Math.random().toString(36).substring(2, 8);
};

/**
 * Uploads a file to a specific folder in Firebase Storage and returns the download URL.
 *
 * @param file - The file to upload
 * @param folder - The folder path inside Firebase Storage (e.g., "plan-images", "user-uploads/videos")
 * @returns A Promise that resolves to the public download URL of the uploaded file
 */
export const uploadFileAndGetDownloadLink = async (
  file: File,
  folder: string
): Promise<string> => {
  try {
    const randomString = generateRandomString();
    const filePath = `${folder}/${Date.now()}_${randomString}_${file.name}`;
    const fileRef = ref(firebaseStorage, filePath);

    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);

    return downloadURL;
  } catch (error) {
    console.error("Failed to upload file:", error);
    throw error;
  }
};
