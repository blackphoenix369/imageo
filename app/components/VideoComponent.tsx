"use client";

import { Video } from "@imagekit/next";
import Link from "next/link";
import { IVideo } from "@/models/Video";

export default function VideoComponent({ video }: { video: IVideo }) {
  // 1. Strict verification guard clause
  if (!video || !video.videoUrl || !video.videoUrl.trim()) {
    return null;
  }

  const videoPath = video.videoUrl.trim();
  
  // 2. Safely parse and sanitize the ImageKit base URL
  const rawEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";
  const cleanEndpoint = rawEndpoint
    .replace(/^https?:\/\//, "") // Strip out "http://" or "https://" if it exists
    .replace(/\/$/, "");         // Strip out any trailing slashes

  const baseUrl = `https://${cleanEndpoint}`;
  
  // 3. Ensure path formatting is safe (avoids accidental double-slashes or missing slashes)
  const cleanPath = videoPath.startsWith("/") ? videoPath : `/${videoPath}`;
  
  // Manually construct a bulletproof absolute URL for the native video elements
  const absoluteVideoUrl = `${baseUrl}${cleanPath}`;

  // 4. Extract MongoDB unique identifier cleanly to satisfy TypeScript
  const videoId = video._id ? video._id.toString() : "";

  if (!videoId || !absoluteVideoUrl) {
    return null;
  }

  return (
    <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300">
      <figure className="relative px-4 pt-4">
        <Link href={`/videos/${videoId}`} className="relative group w-full">
          <div
            className="rounded-xl overflow-hidden relative w-full"
            style={{ aspectRatio: "9/16" }}
          >
            <Video
              src={absoluteVideoUrl} // FIXED: Explicitly passing a verified full URL string
              transformation={[
                {
                  height: "1920",
                  width: "1080",
                },
              ]}
              controls={video.controls ?? true}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      </figure>

      <div className="card-body p-4">
        <Link
          href={`/videos/${videoId}`}
          className="hover:opacity-80 transition-opacity"
        >
          <h2 className="card-title text-lg font-bold line-clamp-1">{video.title}</h2>
        </Link>

        <p className="text-sm text-base-content/70 line-clamp-2">
          {video.description}
        </p>
      </div>
    </div>
  );
}