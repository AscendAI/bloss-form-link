"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  ChevronLeft,
  ChevronRight,
  Search,
  Eye,
} from "lucide-react";
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

const DISCORD_LINK = "https://discord.gg/N84qBe357y";

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

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    updateScrollButtons();
    return () => el.removeEventListener("scroll", updateScrollButtons);
  }, [updateScrollButtons]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let animationId: number;
    let scrollPos = 0;
    const speed = 0.5;

    const autoScroll = () => {
      const totalWidth = el.scrollWidth - el.clientWidth;
      if (totalWidth <= 0) {
        animationId = requestAnimationFrame(autoScroll);
        return;
      }
      scrollPos += speed;
      if (scrollPos >= totalWidth) {
        scrollPos = 0;
      }
      el.scrollLeft = scrollPos;
      animationId = requestAnimationFrame(autoScroll);
    };

    const startDelay = setTimeout(() => {
      animationId = requestAnimationFrame(autoScroll);
    }, 2000);

    const handleInteraction = () => {
      cancelAnimationFrame(animationId);
      scrollPos = el.scrollLeft;
      clearTimeout(restartTimeout);
      restartTimeout = setTimeout(() => {
        animationId = requestAnimationFrame(autoScroll);
      }, 5000);
    };

    let restartTimeout: ReturnType<typeof setTimeout>;
    el.addEventListener("pointerdown", handleInteraction);
    el.addEventListener("wheel", handleInteraction, { passive: true });

    return () => {
      clearTimeout(startDelay);
      clearTimeout(restartTimeout);
      cancelAnimationFrame(animationId);
      el.removeEventListener("pointerdown", handleInteraction);
      el.removeEventListener("wheel", handleInteraction);
    };
  }, []);

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
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white rounded-full p-2 backdrop-blur-sm transition-opacity"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll reels right"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white rounded-full p-2 backdrop-blur-sm transition-opacity"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 px-4 hide-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {videos.map((video, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 snap-center rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800"
            style={{ width: "220px", height: "390px" }}
          >
            <video
              src={video.src}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
            <div
              className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1"
            >
              <Eye className="w-3.5 h-3.5 text-white/90" />
              <span className="text-white/90 text-xs font-semibold">
                {video.views}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CreatorVision() {
  const [submitted, setSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [isVideosLoading, setIsVideosLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch("/api/videos?folder=coach.bloss.app/creatorvision");
        const data = await response.json();
        const viewsList = ["123K", "214K", "859.1K", "397K", "111K", "2.8M", "1.1M", "3.6M", "1.9M", "3.3M"];
        if (data && data.length > 0) {
          const formattedVideos = data.map((vid: any, idx: number) => ({
            src: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/q_auto,f_auto/${vid.public_id}.mp4`,
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
        body: JSON.stringify({ ...data, source: "creatorvision" }),
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] rounded-full bg-blue-500/5 blur-[100px]" />
      </div>

      <div className="relative z-10">
        <motion.section
          className="pt-16 pb-10 px-4 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <img
              src="/creatorvision/logo.jpg"
              alt="Creator Vision"
              className="w-36 h-36 mx-auto rounded-2xl object-cover"
            />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-4">
            Join CreatorVision to start making{" "}
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 bg-clip-text text-transparent">
              $5K–$10k a month
            </span>{" "}
            doing UGC
          </h1>

          <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Adriel, an ex-Cluely coach turned UGC expert, has generated 700M+
            organic views and has helped creators make $5K-$10k a month
            consistently is now taking on a select group of creators. Fill out
            the form below to apply.
          </p>
        </motion.section>

        <motion.section
          className="pb-12 max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 text-center mb-6">
            Check Out the Results
          </h2>
          <ReelCarousel videos={videos} isLoading={isVideosLoading} />
        </motion.section>

        <motion.section
          id="lead-form"
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
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-6 sm:p-8">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-1">
                      Get Started Today
                    </h2>
                    <p className="text-zinc-400 text-sm">
                      Fill in your details and unlock access to our exclusive
                      community.
                    </p>
                  </div>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-zinc-300">
                              Full Name
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <Input
                                  placeholder="John Doe"
                                  className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500/20"
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
                            <FormLabel className="text-zinc-300">
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <Input
                                  placeholder="+1 (555) 123-4567"
                                  className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500/20"
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
                            <FormLabel className="text-zinc-300">
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <Input
                                  placeholder="john@example.com"
                                  type="email"
                                  className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500/20"
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
                            <FormLabel className="text-zinc-300">
                              Instagram Profile
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <SiInstagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <Input
                                  placeholder="https://instagram.com/yourprofile"
                                  className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500/20"
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
                            <FormLabel className="text-zinc-300">
                              Your Goals
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Target className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                                <Textarea
                                  placeholder="Tell us about your goals and what you hope to achieve..."
                                  className="pl-10 min-h-[100px] resize-none bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500/20"
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
                            <FormLabel className="text-zinc-300">
                              How Did You Find Us?
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <Input
                                  placeholder="e.g. Instagram, TikTok, a friend, Google..."
                                  className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500/20"
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
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold p-10 md:text-base text-sm rounded-xl"
                        size="lg"
                        disabled={isPending}
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
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 12,
                      delay: 0.2,
                    }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2 className="text-2xl font-bold mb-2">
                      You're In!
                    </h2>
                    <p className="text-zinc-400 mb-8 max-w-sm mx-auto">
                      Your information has been submitted successfully. Click
                      below to join our exclusive Discord community.
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

        {/* Testimonials */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-4xl mx-auto px-4 pb-20"
          data-testid="section-testimonials"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-2" data-testid="text-testimonials-header">
            Real results from our community
          </h2>
          <p className="text-center text-zinc-400 text-sm mb-8">Wins shared directly in our Discord</p>
          <div className="columns-2 sm:columns-3 gap-3 space-y-3">
            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22].map((n) => (
              <div key={n} className="break-inside-avoid" data-testid={`img-testimonial-${n}`}>
                <img
                  src={`/creatorvision/testimonials/image${n}.jpg`}
                  alt={`Community win ${n}`}
                  className="w-full rounded-lg"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </motion.section>

        {/* Bottom CTA */}
        <div className="w-full px-4 pb-16 flex justify-center">
          <button
            onClick={() => document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" })}
            className="w-full max-w-sm py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white text-xl font-bold tracking-wide shadow-lg shadow-blue-900/40"
          >
            Start Earning Today
          </button>
        </div>
      </div>
    </div>
  );
}
