import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/utils/auth";
import VideoUploadForm from "../components/VideoUploadForm";

export default async function VideoUploadPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 rounded-[32px] border border-slate-800/90 bg-slate-900/95 p-8 shadow-[0_32px_80px_-48px_rgba(15,23,42,0.95)] backdrop-blur-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Upload studio</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">Publish your next video reel</h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            Add a title, description, and preview before sharing your clip to the feed.
          </p>
        </div>

        <VideoUploadForm />
      </div>
    </div>
  );
}
