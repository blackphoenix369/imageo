import React from "react";
import { connectToDB } from "@/utils/db";
import Video from "@/models/Video";
import { notFound } from "next/navigation";
import { Video as ImageKitPlayer } from "@imagekit/next";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Next.js Server Component for the Video Detail/Watch Page
export default async function VideoDetailPage({ params }: PageProps) {
  // 1. Resolve dynamic routing parameters safely
  const resolvedParams = await params;
  const videoId = resolvedParams.id;

  let videoData = null;

  try {
    // 2. Connect to Database directly on the server layer
    await connectToDB();
    
    // 3. Look up the specific video document by its unique ID
    videoData = await Video.findById(videoId).lean();
  } catch (error) {
    console.error("Error fetching video detail:", error);
  }

  // 4. If video is not found or ID is malformed, display Next.js standard 404
  if (!videoData) {
    notFound();
  }

  // Fallback safely just in case types clash
  const serializedVideo = JSON.parse(JSON.stringify(videoData));
  
  // Guard clause validation string to catch broken or unpopulated data streams
  const hasValidUrl = typeof serializedVideo.videoUrl === "string" && serializedVideo.videoUrl.trim().length > 0;

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 text-white">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        
        {/* Left Side: Video Player & Description Context */}
        <div className="space-y-6">
          {/* Back button to video feed */}
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-cyan-400 transition"
          >
            ← Back to Feed
          </Link>

          {/* Cinematic aspect ratio wrapper matching YouTube's player layout */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-2xl flex items-center justify-center">
            {hasValidUrl ? (
              // Provide urlEndpoint explicitly in case ImageKitProvider isn't available on the client
              (() => {
                const raw = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";
                const urlEndpoint = raw.startsWith("http") ? raw : `https://ik.imagekit.io/${raw}`;
                return (
                  <ImageKitPlayer
                    src={serializedVideo.videoUrl.trim()}
                    urlEndpoint={urlEndpoint}
                    controls={serializedVideo.controls ?? true}
                    className="w-full h-full object-contain"
                    transformation={[
                      {
                        height: "1080",
                        width: "1920",
                      },
                    ]}
                  />
                );
              })()
            ) : (
              <div className="text-center p-6 space-y-2">
                <div className="text-4xl">⚠️</div>
                <h3 className="text-sm font-semibold text-slate-300">Video Asset Corrupted</h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  This video entry does not contain a valid file path configuration. Please upload a fresh file.
                </p>
              </div>
            )}
          </div>

          {/* Title and Metadata block */}
          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
              {serializedVideo.title}
            </h1>
            
            {/* Tag Badges */}
            {serializedVideo.tags && serializedVideo.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {serializedVideo.tags.map((tag: string, index: number) => (
                  <span 
                    key={index} 
                    className="rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-xs text-cyan-400 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description Container Box */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</p>
            <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
              {serializedVideo.description}
            </p>
          </div>
        </div>

        {/* Right Side: YouTube style Sidebar Placeholder for Suggested Items */}
        <div className="hidden lg:block space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Up Next</h3>
          <div className="rounded-xl border border-dashed border-slate-800 p-4 text-center text-xs text-slate-500">
            More videos from your collection will appear here.
          </div>
        </div>

      </div>
    </div>
  );
}