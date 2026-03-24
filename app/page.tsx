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
    AutoScroll({ playOnInit: true, stopOnInteraction: false, speed: 1.5 })
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

      {/* Dynamic Video Gallery Section */}
      {isClient && videos.length > 0 ? (
        <div className="w-full max-w-6xl z-10 mb-16 px-4">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 md:gap-6">
              {videos.map((video: any) => (
                <div key={video.public_id} className="flex-[0_0_80%] sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-[9/16] bg-zinc-900">
                  <CldVideoPlayer
                    width="1080"
                    height="1920"
                    src={video.public_id}
                    colors={{
                      accent: "#A352EF",
                      base: "#000000",
                      text: "#FFFFFF",
                    }}
                    autoPlay="on-scroll"
                    muted={true}
                    loop={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : isClient ? (
        /* Fallback Sample Video if no videos found or keys not provided */
        <div className="w-full max-w-md z-10 mb-16 px-4">
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-[9/16] bg-zinc-900 mx-auto">
            <CldVideoPlayer
              width="1080"
              height="1920"
              src="/file.mp4"
              colors={{
                accent: "#A352EF",
                base: "#000000",
                text: "#FFFFFF",
              }}
              fontFace="Open Sans"
              autoPlay="on-scroll"
              muted={true}
              loop={true}
            />
          </div>
          <p className="mt-4 text-xs text-zinc-500 italic">Add CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to .env.local to see your own videos.</p>
        </div>
      ) : null}

      {/* Results Label */}
      <div className="flex flex-col items-center gap-8 w-full z-10">
        <p className="text-[15px] font-bold uppercase tracking-widest text-[#71717a]">
          CHECK OUT THE RESULTS
        </p>
        
        <div className="w-full max-w-2xl rounded-2xl overflow-hidden border border-white/5 shadow-2xl mb-16">
          <CldImage 
            src="results" 
            alt="UGC Results Analytics" 
            width={800} 
            height={400} 
            className="w-full h-auto"
            priority
          />
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full z-10">
        <GetStartedFrom />
      </div>
    </div>
  );
}
