"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  User,
  Phone,
  Mail,
  Target,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCallback } from "react";
import { SiDiscord, SiInstagram } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";

const insertSubmissionSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  instagram: z.string().min(1, "Instagram is required"),
  goals: z.string().min(1, "Goals are required"),
  referrer: z.string().min(1, "Referrer is required"),
});
type InsertSubmission = z.infer<typeof insertSubmissionSchema>;

const DISCORD_LINK = "https://discord.gg/HKUWMzQePy";


function ReelCarousel({ videos = [], isLoading = true }: { videos?: any[], isLoading?: boolean }) {
  if (isLoading || videos.length === 0) {
    return (
      <div className="relative group flex justify-center">
        <div className="flex gap-4 overflow-x-hidden pb-4 px-4 w-full justify-center">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="relative flex-shrink-0 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 animate-pulse"
              style={{ width: "220px", height: "390px" }}
            >
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
    );
  }

  const INFINITE_VIDEOS = videos.length > 0 ? [...videos, ...videos] : [];

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPos = useRef(0);
  const animationId = useRef<number | undefined>(undefined);
  const isUserScrolling = useRef(false);
  const restartTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  const getHalfWidth = () => {
    const el = scrollRef.current;
    if (!el) return 0;
    return el.scrollWidth / 2;
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const speed = 0.6;

    const autoScroll = () => {
      if (isUserScrolling.current) {
        animationId.current = requestAnimationFrame(autoScroll);
        return;
      }
      scrollPos.current += speed;
      const half = getHalfWidth();
      if (half > 0 && scrollPos.current >= half) {
        scrollPos.current -= half;
      }
      el.scrollLeft = scrollPos.current;
      animationId.current = requestAnimationFrame(autoScroll);
    };

    // Handle manual scroll: keep in sync and loop seamlessly
    const onScroll = () => {
      if (!isUserScrolling.current) return;
      const half = getHalfWidth();
      if (half <= 0) return;
      if (el.scrollLeft >= half) {
        el.scrollLeft -= half;
        scrollPos.current = el.scrollLeft;
      } else if (el.scrollLeft <= 0) {
        el.scrollLeft += half;
        scrollPos.current = el.scrollLeft;
      } else {
        scrollPos.current = el.scrollLeft;
      }
    };

    const onInteractionStart = () => {
      isUserScrolling.current = true;
      clearTimeout(restartTimeout.current);
      restartTimeout.current = setTimeout(() => {
        isUserScrolling.current = false;
        scrollPos.current = el.scrollLeft;
      }, 5000);
    };

    const startDelay = setTimeout(() => {
      animationId.current = requestAnimationFrame(autoScroll);
    }, 2000);

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("pointerdown", onInteractionStart);
    el.addEventListener("wheel", onInteractionStart, { passive: true });
    el.addEventListener("touchstart", onInteractionStart, { passive: true });
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    updateScrollButtons();

    return () => {
      clearTimeout(startDelay);
      clearTimeout(restartTimeout.current);
      if (animationId.current) cancelAnimationFrame(animationId.current);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("pointerdown", onInteractionStart);
      el.removeEventListener("wheel", onInteractionStart);
      el.removeEventListener("touchstart", onInteractionStart);
      el.removeEventListener("scroll", updateScrollButtons);
    };
  }, [updateScrollButtons]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.dispatchEvent(new Event("pointerdown"));
    const amount = 300;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group">
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll reels left"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white rounded-full p-2 backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll reels right"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white rounded-full p-2 backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 px-4 hide-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {INFINITE_VIDEOS.map((video, index) => (
          <div
            key={`${video.src}-${index}`}
            className="relative flex-shrink-0 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800"
            style={{ width: "220px", height: "390px" }}
            data-testid={`reel-card-${index}`}
          >
            <video
              src={video.src}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              data-testid={`video-reel-${index}`}
            />
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1" data-testid={`views-badge-${index}`}>
              <Eye className="w-3.5 h-3.5 text-white/90" />
              <span className="text-white/90 text-xs font-semibold">{video.views}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BambooCreator() {
  const [submitted, setSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [isVideosLoading, setIsVideosLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch("/api/videos?folder=coach-bloss/bamboocreator");
        const data = await response.json();
        const viewsList = ["53.3M", "2.9M", "294.5K", "787K", "297K", "927.6K", "1.7M"];
        if (data && data.length > 0) {
          const formattedVideos = data.map((vid: any, idx: number) => ({
            src: vid.src,
            views: viewsList[idx % viewsList.length]
          }));
          setVideos(formattedVideos);
        }
      } catch (error) {
        console.error("Failed to load videos:", error);
      } finally {
        setIsVideosLoading(false);
      }
    }
    fetchVideos();
  }, []);

  const form = useForm<InsertSubmission>({
    resolver: zodResolver(insertSubmissionSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      instagram: "",
      goals: "",
      referrer: "",
    },
  });

  const onSubmit = async (data: InsertSubmission) => {
    setIsPending(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "bamboocreator" }),
      });
      if (!res.ok) {
        throw new Error("Failed to submit form");
      }
      setSubmitted(true);
    } catch (error: any) {
      toast.error("Something went wrong", {
        description: error.message || "Please try again.",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Bamboo stalks — left */}
        <svg className="absolute left-0 top-0 h-full w-32 opacity-15" viewBox="0 0 120 900" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          {[0,120,240,360,480,600,720].map((y,i) => (
            <g key={i}>
              <rect x="18" y={y} width="14" height="118" rx="7" fill="#4ade80" />
              <rect x="16" y={y+116} width="18" height="6" rx="3" fill="#86efac" />
              {i%2===0 && <path d={`M32 ${y+40} Q65 ${y+20} 80 ${y+10}`} stroke="#4ade80" strokeWidth="3" fill="none" strokeLinecap="round"/>}
            </g>
          ))}
          {[60,180,300,420,540,660].map((y,i) => (
            <g key={`b${i}`}>
              <rect x="70" y={y} width="12" height="118" rx="6" fill="#22c55e" />
              <rect x="68" y={y+116} width="16" height="5" rx="2.5" fill="#4ade80" />
              {i%2===1 && <path d={`M70 ${y+50} Q40 ${y+30} 20 ${y+20}`} stroke="#22c55e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>}
            </g>
          ))}
        </svg>
        {/* Bamboo stalks — right */}
        <svg className="absolute right-0 top-0 h-full w-32 opacity-15" viewBox="0 0 120 900" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          {[0,130,260,390,520,650,780].map((y,i) => (
            <g key={i}>
              <rect x="88" y={y} width="14" height="128" rx="7" fill="#4ade80" />
              <rect x="86" y={y+126} width="18" height="6" rx="3" fill="#86efac" />
              {i%2===0 && <path d={`M88 ${y+50} Q55 ${y+30} 35 ${y+15}`} stroke="#4ade80" strokeWidth="3" fill="none" strokeLinecap="round"/>}
            </g>
          ))}
          {[65,195,325,455,585,715].map((y,i) => (
            <g key={`b${i}`}>
              <rect x="40" y={y} width="12" height="118" rx="6" fill="#22c55e" />
              <rect x="38" y={y+116} width="16" height="5" rx="2.5" fill="#4ade80" />
            </g>
          ))}
        </svg>
      </div>

      <div className="relative z-10">
        {/* Brand header */}
        <div className="flex flex-col items-center justify-center gap-2 pt-8 pb-2">
          <img
            src="/bamboocreator/logo.png"
            alt="Bamboo Creator Group logo"
            className="w-16 h-16 object-contain"
            data-testid="img-brand-logo"
          />
          <span
            className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent"
            data-testid="text-brand-name"
          >
            Bamboo Creator Group
          </span>
        </div>

        <motion.section
          className="pt-8 pb-10 px-4 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium mb-6"
            data-testid="badge-tagline"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Now Accepting Applications
          </motion.div> */}

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-4"
            data-testid="text-page-title"
          >
            The Only UGC Coach With{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400 bg-clip-text text-transparent">
              Deals Already Waiting For You
            </span>
          </h1>

          <p
            className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
            data-testid="text-subtitle"
          >
            Jay isn't just teaching UGC, he's actively in the trenches working with brands, and his students get access to opportunities most creators never even see:
          </p>

          <div className="mt-5 flex flex-col items-center gap-2">
            {[
              { icon: "🎯", text: "100M+ views/week @ Kalshi" },
              { icon: "💰", text: "Helped a student earn $50K from a single video" },
              { icon: "📰", text: "Featured in the Wall Street Journal" },
              { icon: "🤝", text: "Currently managing 5+ UGC programs" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-full px-5 py-2 text-sm sm:text-base text-zinc-200">
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="pb-12 max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2
            className="text-sm font-semibold uppercase tracking-widest text-zinc-500 text-center mb-6"
            data-testid="text-carousel-label"
          >
            Check Out the Results
          </h2>
          <ReelCarousel videos={videos} isLoading={isVideosLoading} />
        </motion.section>

        <motion.section
          className="pb-20 px-4 max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="rounded-2xl border border-emerald-500/20 bg-white/5 backdrop-blur-xl shadow-2xl shadow-emerald-900/30 p-6 sm:p-8" style={{background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(16,185,129,0.05) 100%)"}}>
                  <div className="text-center mb-6">
                    <h2
                      className="text-2xl font-bold mb-1"
                      data-testid="text-form-title"
                    >
                      Get Started Today
                    </h2>
                    <p className="text-zinc-400 text-sm">
                      Fill in your details and unlock access to our exclusive community.
                    </p>
                  </div>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-emerald-200/80">Full Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600/70" />
                                <Input
                                  placeholder="John Doe"
                                  className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:ring-emerald-500/20"
                                  data-testid="input-fullname"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-emerald-200/80">Phone Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600/70" />
                                <Input
                                  placeholder="+1 (555) 123-4567"
                                  className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:ring-emerald-500/20"
                                  data-testid="input-phone"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-emerald-200/80">Email Address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600/70" />
                                <Input
                                  placeholder="john@example.com"
                                  type="email"
                                  className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:ring-emerald-500/20"
                                  data-testid="input-email"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="instagram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-emerald-200/80">Instagram Profile</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <SiInstagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600/70" />
                                <Input
                                  placeholder="https://instagram.com/yourprofile"
                                  className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:ring-emerald-500/20"
                                  data-testid="input-instagram"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="goals"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-emerald-200/80">Your Goals</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Target className="absolute left-3 top-3 w-4 h-4 text-emerald-600/70" />
                                <Textarea
                                  placeholder="Tell us about your goals and what you hope to achieve..."
                                  className="pl-10 min-h-[100px] resize-none bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:ring-emerald-500/20"
                                  data-testid="input-goals"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="referrer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-emerald-200/80">How Did You Find Us?</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600/70" />
                                <Input
                                  placeholder="e.g. Instagram, TikTok, a friend, Google..."
                                  className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:ring-emerald-500/20"
                                  data-testid="input-referrer"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-emerald-600 to-green-500 text-white font-semibold p-10 md:text-base text-sm rounded-xl"
                        size="lg"
                        disabled={isPending}
                        data-testid="button-submit"
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit & Unlock Discord
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <div className="rounded-2xl border border-emerald-500/20 bg-white/5 backdrop-blur-xl shadow-2xl shadow-emerald-900/30 p-8 text-center" style={{background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(16,185,129,0.05) 100%)"}}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2 className="text-2xl font-bold mb-2" data-testid="text-success-title">
                      You're In!
                    </h2>
                    <p className="text-zinc-400 mb-8 max-w-sm mx-auto">
                      Your information has been submitted successfully. Click below to join our exclusive Discord community.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <a
                      href={DISCORD_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="link-discord"
                    >
                      <Button
                        size="lg"
                        className="gap-2 text-base px-8 bg-[#5865F2] text-white rounded-xl py-6 font-semibold"
                      >
                        <SiDiscord className="w-5 h-5" />
                        Join Discord Server
                      </Button>
                    </a>

                    <p className="text-xs text-zinc-500 mt-4">
                      Link not working?{" "}
                      <a
                        href={DISCORD_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 text-zinc-400 hover:text-white"
                        data-testid="link-discord-fallback"
                      >
                        Click here
                      </a>
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </div>
    </div>
  );
}
