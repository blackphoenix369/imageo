import { IVideo } from "@/models/Video";
import VideoComponent from "./VideoComponent";

interface VideoFeedProps {
  videos: IVideo[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  // 1. Strict Validation Filter: Ensure videos is an array and discard 
  // any objects with missing, null, or empty whitespace videoUrl records.
  const validVideos = Array.isArray(videos)
    ? videos.filter((video) => {
        return (
          video && 
          typeof video.videoUrl === "string" && 
          video.videoUrl.trim().length > 0
        );
      })
    : [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* 2. Map only over verified, valid video documents */}
      {validVideos.map((video) => {
        // Safe string conversion for the React iteration tracking key
        const videoKey = video._id ? video._id.toString() : Math.random().toString();

        return (
          <VideoComponent 
            key={videoKey} 
            video={video} 
          />
        );
      })}

      {/* 3. Empty State fallback handler */}
      {validVideos.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-base-content/70 font-medium">No videos found</p>
        </div>
      )}
    </div>
  );
}