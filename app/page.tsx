import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { connectToDB } from "@/utils/db";
import Video from "@/models/Video";
import VideoFeed from "@/app/components/VideoFeed";
import LogoutButton from "@/app/components/LogoutButton";
import type { IVideo } from "@/models/Video";

export default async function Home() {
  const session = await getServerSession(authOptions);
  await connectToDB();
  const rawVideos = await Video.find({}).sort({ createdAt: -1 }).lean();
  const videos = JSON.parse(JSON.stringify(rawVideos)) as IVideo[];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-16 sm:px-10 lg:px-20">
      <header className="max-w-5xl mx-auto text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Imageo</p>
        <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight">
          Discover the latest uploaded reels.
        </h1>
        <p className="mt-5 mx-auto max-w-2xl text-base sm:text-lg text-slate-300">
          Explore videos from creators and sign in to upload your own. The upload button appears only after login or registration.
        </p>
      </header>

      <section className="mt-14 grid gap-8 lg:grid-cols-[1.4fr_0.9fr] xl:gap-10">
        <div className="space-y-8 rounded-3xl border border-slate-800/90 bg-slate-900/80 p-8 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.9)]">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Trending videos</h2>
            <p className="text-slate-400">
              {session
                ? "Thanks for logging in — your upload option is ready when you are."
                : "Sign in or register to upload your own video reels."}
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {session ? (
              <>
                <Link
                  href="/upload"
                  className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Upload a video
                </Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-3 text-sm text-slate-100 transition hover:bg-slate-800"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-3xl border border-slate-800/80 bg-slate-950/90 p-5">
              <h3 className="font-semibold">Protected uploads</h3>
              <p className="mt-2 text-sm text-slate-400">Video uploads are only available after login or registration.</p>
            </article>
            <article className="rounded-3xl border border-slate-800/80 bg-slate-950/90 p-5">
              <h3 className="font-semibold">Always fresh</h3>
              <p className="mt-2 text-sm text-slate-400">Newest videos are shown first, just like a video feed.</p>
            </article>
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-8 text-slate-300">
          <h3 className="text-xl font-semibold">Quick actions</h3>
          <div className="mt-6 space-y-3">
            <Link
              href={session ? "/upload" : "/login"}
              className="block rounded-2xl bg-slate-800 px-5 py-4 text-sm font-medium transition hover:bg-slate-700"
            >
              {session ? "Upload a video" : "Login to upload"}
            </Link>
            <Link
              href={session ? "/" : "/register"}
              className="block rounded-2xl bg-slate-800 px-5 py-4 text-sm font-medium transition hover:bg-slate-700"
            >
              {session ? "Explore more" : "Create account"}
            </Link>
          </div>
        </aside>
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between gap-4 pb-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Latest uploads</h2>
            <p className="text-slate-400">Browse the newest videos from creators on Imageo.</p>
          </div>
        </div>

        <VideoFeed videos={videos} />
      </section>
    </div>
  );
}
