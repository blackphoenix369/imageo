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
    
    const validFile = (file:File) => {
        if(fileType === "video"){
            if(!file.type.startsWith("video/")){
                setError("Please select a video file");

            }
        }
        if(fileType === "image"){
            if(!file.type.startsWith("image/")){
                setError("Please select a image file");
                
            }
        }
        if(file.size > 100 * 1024 * 1024){
            setError("File size should be less than 100MB");
        }
        return true;
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(!file || !validFile(file))
            return;
        setUploading(true);
        setError(null);

        try{
            const authres = await fetch("/api/auth/imagekit-auth")
            const auth = await authres.json()
            const res = await upload({
                file,
                fileName: file.name, 
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
                signature: auth.signature,
                expire: auth.expire,
                token: auth.token,
                
                
                onProgress: (event) => {
                    if(onProgress){
                        const progress = Math.round((event.loaded / event.total) * 100);
                        onProgress(Math.round(progress));
                    }
                },
                
            })
            onSuccess(res);
        } catch (err) {
            console.error("Upload failed:",err);
        } finally {
            setUploading(false);
        }
    }


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