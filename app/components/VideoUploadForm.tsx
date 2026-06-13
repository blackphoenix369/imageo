"use client";

import React, { useMemo, useState } from "react";
import FileUpload from "./FileUpload";

function VideoUploadForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [videoPath, setVideoPath] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const fileDetails = useMemo(() => {
    if (!videoPath) return null;
    return `Uploaded video asset ready to publish.`;
  }, [videoPath]);

  const handleUploadSuccess = (uploadResult: any) => {
    console.debug("ImageKit upload result:", uploadResult);

    // CRITICAL FIX: ImageKit requires the relative filePath (e.g., "/folder/video.mp4")
    // for its Next.js components and automated transformations to work.
    const filePath = uploadResult?.filePath || null;

    // Retrieve ImageKit's automatically generated snapshot thumbnail URL
    const thumb = 
      uploadResult?.thumbnailUrl || 
      uploadResult?.thumbnail_url || 
      uploadResult?.response?.thumbnailUrl ||
      null;

    if (!filePath) {
      setError("Video upload succeeded but did not return a valid ImageKit file path.");
      return;
    }

    setVideoPath(filePath);
    setThumbnailUrl(thumb); 
    setMessage("Video asset registered successfully! Adjust details and publish.");
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!title?.trim() || !description?.trim()) {
      setError("Please complete the title and description.");
      return;
    }

    if (!videoPath?.trim()) {
      setError("Please upload a video file before publishing.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        videoUrl: videoPath.trim(), // Storing raw ImageKit path
        thumbnailUrl: thumbnailUrl?.trim() || "", // Storing dynamic thumbnail
      };

      const response = await fetch("/api/Video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to publish video.");
      }

      // Reset form states on success
      setTitle("");
      setDescription("");
      setTags("");
      setVideoPath(null);
      setThumbnailUrl(null);
      setUploadProgress(0);
      
      const createdId = result?._id || result?.id || null;
      setMessage(`Your video is live! ${createdId ? `ID: ${createdId}` : ""}`);
    } catch (uploadError: any) {
      setError(uploadError?.message || "Could not publish video.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Convert a relative path into a viewable URL only for local HTML5 form previews
  const previewVideoUrl = useMemo(() => {
    if (!videoPath) return null;
    if (videoPath.startsWith("http")) return videoPath;
    return `https://ik.imagekit.io/${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""}${videoPath}`;
  }, [videoPath]);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-[32px] border border-slate-800/90 bg-slate-900/95 p-8 shadow-[0_32px_80px_-48px_rgba(15,23,42,0.95)]"
    >
      {/* YouTube Split View Setup */}
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        
        {/* Left Side: Metadata and Inputs */}
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <label className="block text-sm font-medium text-slate-300">Title</label>
              <input
                className="mt-3 w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter a compelling title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Tags</label>
              <input
                className="mt-3 w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                type="text"
                value={tags}
                onChange={(event) => setTags(event.target.value)}
                placeholder="e.g. AI, reels, tutorial"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">Description</label>
            <textarea
              className="min-h-[140px] w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-4 py-4 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Write a short summary of your video..."
              required
            />
          </div>

          <div className="space-y-6 rounded-3xl border border-dashed border-slate-700/80 bg-slate-950/80 p-6">
            <div className="flex flex-col gap-4 rounded-3xl bg-slate-900/80 p-5">
              <div>
                <p className="text-sm font-medium text-slate-200">Video file</p>
                <p className="mt-1 text-sm text-slate-400">MP4 / MOV accepted. Direct upload to ImageKit before publishing.</p>
              </div>
              <FileUpload
                fileType="video"
                onSuccess={handleUploadSuccess}
                onProgress={(progress) => {
                  setUploadProgress(progress);
                  setMessage(`Uploading video asset: ${progress}%`);
                  setError(null);
                }}
              />
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full space-y-2 mt-2">
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-cyan-400 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {fileDetails && (
              <div className="rounded-3xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm text-slate-300">
                {fileDetails}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: YouTube Style Live Media Preview Monitors */}
        <div className="space-y-6 lg:border-l lg:border-slate-800 lg:pl-6">
          <h3 className="text-sm font-medium text-slate-300 tracking-wide uppercase">Live Dashboard Monitors</h3>
          
          <div className="space-y-6">
            {/* Player Preview */}
            <div className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 flex items-center justify-center shadow-inner">
              {previewVideoUrl ? (
                <video
                  src={previewVideoUrl}
                  controls
                  className="h-full w-full object-contain"
                  poster={thumbnailUrl || undefined}
                />
              ) : (
                <div className="text-center p-4">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-500">
                    🎥
                  </div>
                  <p className="text-xs text-slate-500">Video feed unassigned</p>
                </div>
              )}
            </div>

            {/* Thumbnail Image Monitor */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Autogenerated Poster Frame</label>
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 flex items-center justify-center">
                {thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbnailUrl}
                    alt="ImageKit auto thumbnail generation snapshot"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <p className="text-xs text-slate-600">Waiting for valid file path stream...</p>
                )}
              </div>
            </div>

            {/* Context Feed Card Info */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 space-y-2">
               <h4 className="text-sm font-semibold text-slate-200 line-clamp-1">
                 {title.trim() || "Untitled Content"}
               </h4>
               <p className="text-xs text-slate-400 line-clamp-2 whitespace-pre-wrap">
                 {description.trim() || "No metadata description entered yet."}
               </p>
            </div>
          </div>
        </div>

      </div>

      {/* Form Messaging & Submission Actions */}
      {(message || error) && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            error ? "border-rose-500 bg-rose-950/70 text-rose-300" : "border-cyan-400 bg-cyan-950/70 text-cyan-100"
          }`}
        >
          {error || message}
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-slate-800/60">
        <div>
          <p className="text-sm text-slate-500">Assets are parsed directly via ImageKit media servers.</p>
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !videoPath}
          className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
        >
          {isSubmitting ? "Publishing stream..." : "Publish video"}
        </button>
      </div>
    </form>
  );
}

export default VideoUploadForm;