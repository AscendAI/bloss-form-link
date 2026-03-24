"use client";
import GetStartedFrom from "@/components/GetStartedFrom";
import { CldImage, CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

export default function Home() {
  const [videos, setVideos] = useState<any[]>([]);

  const [isClient, setIsClient] = useState(false);

  const [emblaRef] = useEmblaCarousel({ loop: true, dragFree: true }, [
    AutoScroll({ playOnInit: true, stopOnInteraction: false, speed: 0.5 })
  ]);

  useEffect(() => {
    setIsClient(true);
    async function fetchVideos() {
      try {
        const response = await fetch("/api/videos");
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error("Failed to load videos:", error);
      }
    }
    fetchVideos();
  }, []);

  return (
    <div className="flex flex-col items-center pt-18 pb-10 px-4 text-center relative overflow-hidden min-h-screen bg-black">
      {/* Circular Background Gradient */}
      <div className="absolute top-[5%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-200 text-[15.6px] font-medium mb-7 animate-slow-pulse z-10">
        <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
        Level Up Your Game
      </div>

      {/* Main Header */}
      <h1 className="text-[45px] md:text-[66px] font-bold max-w-5xl leading-none mb-4 text-white z-10 tracking-tight">
        Backed by <span className="text-[#B771FA]">200 million+</span> <br />
        <span className="bg-clip-text text-transparent bg-linear-to-r from-[#A352EF] to-[#EB4899]">organic views</span>, join the <br />
        community today
      </h1>

      {/* Subheader */}
      <p className="text-[#A0A0A0] text-lg md:text-[22px] font-medium max-w-3xl mb-12 z-10 leading-[1.3]">
        Hanna, Angela and Savera are three of the strongest UGC coaches in <br className="hidden md:block" />
        the industry. Fill out the form below to get started.
      </p>
      
      

      {/* Results Label */}
      <div className="flex flex-col items-center gap-8 w-full z-10">
        <p className="text-[15px] font-bold uppercase tracking-widest text-[#71717a]">
          CHECK OUT THE RESULTS
        </p>
        {/* Dynamic Video Gallery Section */}
      {isClient && videos.length > 0 ? (
        <div className="w-full max-w-6xl z-10 mb-16 px-4">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {videos.map((video: any) => (
                <div key={video.public_id} className="flex-[0_0_220px] w-[220px] h-[390px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900 mr-4 md:mr-6 relative">
                  <video
                    src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/q_auto,f_auto/${video.public_id}.mp4`}
                    className="w-full h-full object-cover pointer-events-none"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : isClient ? (
        /* Loading Skeletons if no videos found or while loading */
        <div className="w-full max-w-6xl z-10 mb-16 px-4">
          <div className="overflow-hidden">
            <div className="flex justify-center">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-[0_0_220px] w-[220px] h-[390px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900 animate-pulse relative mr-4 md:mr-6">
                  <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/20 to-zinc-950/50"></div>
                  <div className="absolute flex flex-col items-center justify-center w-full h-full text-zinc-700">
                    <svg className="w-12 h-12 mb-4 animate-pulse opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-8 text-[13px] text-zinc-500 italic text-center">Add CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to .env.local to see your own videos.</p>
        </div>
      ) : null}
      </div>

      {/* Form Section */}
      <div className="w-full z-10">
        <GetStartedFrom />
      </div>
    </div>
  );
}
