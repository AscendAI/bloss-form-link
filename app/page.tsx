"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { motion } from "framer-motion";
import {
  Eye,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { useCallback } from "react";

const DISCORD_LINK = "https://discord.gg/blossugc";

export default function Home() {
  const [videos, setVideos] = useState<any[]>([]);

  const [isClient, setIsClient] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: true },
    [AutoScroll({ playOnInit: true, stopOnInteraction: false, speed: 0.5 })],
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      const autoScroll = emblaApi.plugins().autoScroll;
      if (autoScroll) autoScroll.stop();
      emblaApi.scrollPrev();
      setTimeout(() => {
        if (autoScroll) autoScroll.play();
      }, 5000);
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      const autoScroll = emblaApi.plugins().autoScroll;
      if (autoScroll) autoScroll.stop();
      emblaApi.scrollNext();
      setTimeout(() => {
        if (autoScroll) autoScroll.play();
      }, 5000);
    }
  }, [emblaApi]);

  useEffect(() => {
    setIsClient(true);
    async function fetchVideos() {
      try {
        const response = await fetch("/api/videos?folder=coach-bloss/videos");
        const data = await response.json();

        const VIEWS_MAP: Record<string, string> = {
          reel4: "20.9M",
          reel11: "16.1M",
          reel10: "15M",
          reel9: "8M",
          reel1: "7.1M",
          reel12: "5.6M",
          reel7: "4.3M",
          reel13: "3.4M",
          reel8: "2.6M",
          reel2: "2.3M",
          reel6: "1.3M",
          reel5: "1.2M",
          reel3: "379K",
        };
        const ORDER = [
          "reel4",
          "reel11",
          "reel10",
          "reel9",
          "reel1",
          "reel12",
          "reel7",
          "reel13",
          "reel8",
          "reel2",
          "reel6",
          "reel5",
          "reel3",
        ];

        if (data && data.length > 0) {
          let formattedVideos = data.map((vid: any) => {
            const rawName = vid.name || "";
            const filename = rawName.split(".")[0];
            return {
              ...vid,
              filename,
              views: VIEWS_MAP[filename] || "15M",
            };
          });

          // Sort exactly like the original home.tsx array
          formattedVideos.sort((a: any, b: any) => {
            const idxA = ORDER.indexOf(a.filename);
            const idxB = ORDER.indexOf(b.filename);
            if (idxA === -1 && idxB === -1) return 0;
            if (idxA === -1) return 1;
            if (idxB === -1) return -1;
            return idxA - idxB;
          });

          setVideos(formattedVideos);
        } else {
          setVideos([]);
        }
      } catch (error) {
        console.error("Failed to load videos:", error);
      }
    }
    fetchVideos();
  }, []);

  return (
    <div className="flex flex-col items-center pt-18 pb-10 md:px-4 text-center relative overflow-hidden min-h-screen bg-black">
      {/* Circular Background Gradient */}
      <div className="absolute top-[5%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Main Header Group */}
      <motion.section
        className="flex flex-col items-center z-10 w-full mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-200 text-[15.6px] font-medium mb-7 animate-slow-pulse"
        >
          <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
          Level Up Your Game
        </motion.div>

        {/* Main Header */}
        <h1 className="text-[45px] md:text-[66px] font-bold max-w-4xl leading-none mb-4 text-white tracking-tight">
          Backed by{" "}
          <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            200 million+ organic views
          </span>
          , join the community today
        </h1>

        {/* Subheader */}
        <p className="text-zinc-400 text-lg md:text-[22px] font-medium max-w-[720px] leading-[1.3]">
          Hanna, Angela and Savera are three of the strongest UGC coaches in the
          industry. Join the Discord community below to get started.
        </p>
      </motion.section>

      {/* Results Label */}
      <motion.section
        className="flex flex-col items-center gap-8 w-full z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        

        <p className="text-[15px] font-semibold uppercase tracking-widest text-zinc-500 text-center mb-6">
          CHECK OUT THE RESULTS
        </p>
        {/* Dynamic Video Gallery Section */}
        {isClient && videos.length > 0 ? (
          <div className="w-full max-w-6xl z-10 mb-16 px-4 relative group">
            <button
              onClick={scrollPrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-black/60 text-white rounded-full p-2 backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-black/60 text-white rounded-full p-2 backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex md:-ml-4">
                {videos.map((video: any, index: number) => (
                  <div
                    key={`${video.name}-${index}`}
                    className="flex-[0_0_auto] pl-4"
                  >
                    <div className="w-[240px] h-[420px] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 relative snap-center">
                      <video
                        src={video.src}
                        className="w-full h-full object-cover pointer-events-none"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />

                      {/* Badge */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 border-none shadow-none z-10">
                        <Eye className="w-3.5 h-3.5 text-white/90" />
                        <span className="text-white/90 text-xs font-semibold">
                          {video.views}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : isClient ? (
          /* Loading Skeletons if no videos found or while loading */
          <div className="w-full max-w-6xl z-10 mb-16 px-4">
            <div className="overflow-hidden">
              <div className="flex justify-center -ml-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex-[0_0_auto] pl-4">
                    <div className="w-[240px] h-[420px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900 animate-pulse relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/20 to-zinc-950/50"></div>
                      <div className="absolute flex flex-col items-center justify-center w-full h-full text-zinc-700">
                        <svg
                          className="w-12 h-12 mb-4 animate-pulse opacity-50"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-8 text-[13px] text-zinc-500 italic text-center">
              Add FIREBASE_API_KEY and FIREBASE_API_SECRET to .env to see your
              own videos.
            </p>
          </div>
        ) : null}
      </motion.section>

      {/* Join Discord Section */}
      <motion.section
        className="w-full z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <motion.a
          href={DISCORD_LINK}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="group relative inline-flex items-center justify-center rounded-full p-[1px]"
        >
          <span className="absolute -inset-2 rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-400 opacity-40 blur-xl transition-all duration-500 group-hover:opacity-80" />
          <span className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-9 py-4 text-[15px] font-semibold text-white shado[...]
            <Sparkles className="h-4 w-4" />
            Join Discord
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </motion.a>
      </motion.section>
    </div>
  );
}
