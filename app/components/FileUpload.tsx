"use client" 
import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState } from "react";

interface FileuploadProps {
    onSuccess: (res:any) => void
    onProgress?: (progress:number) => void
    fileType?: "image" | "video"
}

const FileUpload = ({
    onSuccess,
    onProgress,
    fileType
}: FileuploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] =useState<String | null>(null);
    
    const validFile = (file: File) => {
        let valid = true;

        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                setError("Please select a video file.");
                valid = false;
            }
        }

        if (fileType === "image") {
            if (!file.type.startsWith("image/")) {
                setError("Please select an image file.");
                valid = false;
            }
        }

        if (file.size > 100 * 1024 * 1024) {
            setError("File size should be less than 100MB.");
            valid = false;
        }

        return valid;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !validFile(file)) return;

        setUploading(true);
        setError(null);

        try {
            const authres = await fetch("/api/auth/imagekit-auth");
            if (!authres.ok) {
                const text = await authres.text();
                throw new Error(`Upload auth failed: ${text || authres.statusText}`);
            }

            const auth = await authres.json();
            const uploadAuth = auth.AuthenticationParameters ?? auth;
            const res = await upload({
                file,
                fileName: file.name,
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
                signature: uploadAuth.signature,
                expire: uploadAuth.expire,
                token: uploadAuth.token,
                onProgress: (event) => {
                    if (onProgress) {
                        const progress = Math.round((event.loaded / event.total) * 100);
                        onProgress(progress);
                    }
                },
            });

            onSuccess(res);
        } catch (err: any) {
            console.error("Upload failed:", err);
            setError(err?.message || "Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };


    return (
        <>
            <input 
            type="file"
            accept={fileType === "video" ? "video/*" : "image/*"}
            onChange={handleFileChange}  />
            {uploading && (
                <span>loading...</span>
            )}
        </>
    );
};

export default FileUpload;