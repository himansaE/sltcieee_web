"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CurvedLoopSection from "./marqueeText";

interface ProjectCard {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  category: string;
  stats: {
    participants: number;
    rating: number;
    duration: string;
  };
}

const projectCards: ProjectCard[] = [
  {
    id: 1,
    title: "Codemania v4",
    description:
      "A 12-hour-long algorithmic coding hackathon organized by the IEEE Computer Society Student Branch Chapter of SLTC for showcasing your coding excellence.",
    image: "https://picsum.photos/1920/1080?random=1",
    link: "/projects/1",
    category: "Newsletter Platform",
    stats: { participants: 1200, rating: 4.8, duration: "6 months" },
  },
  {
    id: 2,
    title: "Event Management",
    description:
      "Comprehensive event planning and management system with real-time collaboration",
    image: "https://picsum.photos/1920/1080?random=2",
    link: "/projects/2",
    category: "Management System",
    stats: { participants: 850, rating: 4.9, duration: "3 months" },
  },
  {
    id: 3,
    title: "Community Hub",
    description:
      "Connect with fellow professionals, share knowledge, and build lasting networks",
    image: "https://picsum.photos/1920/1080?random=3",
    link: "/projects/3",
    category: "Social Platform",
    stats: { participants: 2100, rating: 4.7, duration: "Ongoing" },
  },
  {
    id: 4,
    title: "Resource Center",
    description:
      "Access cutting-edge technical resources, tutorials, and learning materials",
    image: "https://picsum.photos/1920/1080?random=4",
    link: "/projects/4",
    category: "Education Hub",
    stats: { participants: 3500, rating: 4.9, duration: "Always Updated" },
  },
];

// Removed marqueeTexts; replaced by CurvedLoopSection with fixed text

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const contentRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState<number | "auto">("auto");

  // Animate card height when content changes
  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setCardHeight(height);
    }
  }, [currentSlide]);

  // Loading animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  // Auto-play functionality with same transition
  useEffect(() => {
    if (!isAutoPlaying || isLoading) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % projectCards.length);
        setIsTransitioning(false);
      }, 600);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isLoading]);
  // Optimized Mouse movement tracking with throttling for better performance
  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      // Use requestAnimationFrame to throttle mouse updates
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(() => {
        setMousePosition({
          x: e.clientX,
          y: e.clientY,
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []); // Subtle mouse cursor glow effect
  const cursorGlow = useMemo(
    () => ({
      transform: `translate(${mousePosition.x - 50}px, ${mousePosition.y - 50}px)`,
      background: `radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)`,
      pointerEvents: "none" as const,
    }),
    [mousePosition.x, mousePosition.y]
  );
  // Optimized navigation functions
  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % projectCards.length);
      setIsTransitioning(false);
    }, 600);
  }, []);

  const prevSlide = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(
        (prev) => (prev - 1 + projectCards.length) % projectCards.length
      );
      setIsTransitioning(false);
    }, 600);
  }, []);

  const handleSlideClick = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const currentProject = useMemo(
    () => projectCards[currentSlide],
    [currentSlide]
  );
  return (
    <>
      <div
        id="events"
        className="relative h-screen w-full overflow-hidden bg-black"
      >
        {" "}
        {/* Enhanced Animated Background with Beautiful Carousel Effects */}
      <div className="absolute inset-0 z-0">
        {/* Main Background Image Layer with 3D perspective */}
        <div
          className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
            isTransitioning
              ? "translate-x-full opacity-0 scale-110 rotate-y-12"
              : "translate-x-0 opacity-100 scale-100 rotate-y-0"
          }`}
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px",
            filter: isTransitioning ? "blur(5px)" : "blur(0px)",
          }}
          key={`background-${currentSlide}`}
        >
          <Image
            src={currentProject.image}
            alt="Background"
            fill
            className="object-cover transition-transform duration-1000"
            priority
            unoptimized
          />
          {/* Dynamic color overlay based on slide */}
          <div
            className="absolute inset-0 transition-colors duration-1000"
            style={{
              background: `linear-gradient(45deg, 
                rgba(${currentSlide % 2 === 0 ? "59, 130, 246" : "168, 85, 247"}, 0.2) 0%, 
                rgba(${currentSlide % 2 === 0 ? "147, 51, 234" : "59, 130, 246"}, 0.1) 100%)`,
            }}
          />
        </div>
        {/* Next slide preview with parallax effect */}
        <div
          className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
            isTransitioning
              ? "translate-x-0 opacity-100 scale-100 rotate-y-0"
              : "translate-x-full opacity-0 scale-110 rotate-y-12"
          }`}
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px",
            filter: isTransitioning ? "blur(0px)" : "blur(5px)",
          }}
          key={`next-background-${currentSlide}`}
        >
          <Image
            src={projectCards[(currentSlide + 1) % projectCards.length].image}
            alt="Next Background"
            fill
            className="object-cover transition-transform duration-1000"
            unoptimized
          />
          {/* Dynamic color overlay for next slide */}
          <div
            className="absolute inset-0 transition-colors duration-1000"
            style={{
              background: `linear-gradient(45deg, 
                rgba(${(currentSlide + 1) % 2 === 0 ? "59, 130, 246" : "168, 85, 247"}, 0.2) 0%, 
                rgba(${(currentSlide + 1) % 2 === 0 ? "147, 51, 234" : "59, 130, 246"}, 0.1) 100%)`,
            }}
          />
        </div>
        {/* Enhanced layered overlays */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />{" "}
        {/* Subtle Mouse Cursor Glow */}
        <div
          className="absolute pointer-events-none z-10 w-24 h-24 rounded-full opacity-30 blur-xl transition-all duration-300 ease-out will-change-transform"
          style={cursorGlow}
        />
        {/* Floating Particles System - Better Alternative */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
          {/* Large floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#0166aa]/20 rounded-full blur-2xl animate-float-slow"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-purple-400/20 rounded-full blur-2xl animate-float-reverse"></div>
          <div className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-pink-400/20 rounded-full blur-xl animate-float"></div>

          {/* Small sparkles */}
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/60 rounded-full animate-twinkle"></div>
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-[#0166aa]/80 rounded-full animate-twinkle-delay"></div>
          <div className="absolute bottom-1/4 right-1/2 w-1 h-1 bg-purple-300/80 rounded-full animate-twinkle-slow"></div>
          <div className="absolute top-2/3 left-3/4 w-1.5 h-1.5 bg-pink-300/80 rounded-full animate-twinkle"></div>

          {/* Geometric shapes */}
          <div className="absolute top-1/5 right-1/5 w-8 h-8 border border-white/20 rotate-45 animate-spin-slow-reverse"></div>
          <div className="absolute bottom-1/5 left-1/5 w-6 h-6 border border-[#0166aa]/30 animate-pulse-slow"></div>
        </div>
      </div>
      {/* Animated Top Logo */}
      <div className="relative z-10 pt-8 text-center">
        <div className="text-gray-300 text-sm font-light tracking-[0.3em] animate-fade-in-down h-6"></div>
        <div className="mt-2 w-16 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto animate-expand"></div>
      </div>
      {/* Main Content with Advanced Animations */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        {/* Left Arrow with Hover Effect */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-8 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-white/5 backdrop-blur-xl hover:bg-white/20 text-white border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-110 group"
          onClick={prevSlide}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <ChevronLeft className="h-6 w-6 transition-transform group-hover:-translate-x-1" />{" "}
        </Button>{" "}
        {/* Enhanced Project Card with Glass Morphism */}{" "}
        <Card
          className="bg-white/10 backdrop-blur-3xl border border-white/20 p-12 max-w-2xl mx-auto text-center transform transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-[#0166aa]/20 group animate-slide-up shadow-2xl shadow-black/50 hover:border-[#0166aa]/30"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(255, 255, 255, 0.1) 0%, 
                rgba(255, 255, 255, 0.05) 100%
              )
            `,
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            height: cardHeight,
            transition:
              "height 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s ease",
          }}
        >
          <div key={currentSlide} className="space-y-10 animate-fade-in">
            {/* Enhanced Title with 3D Effect */}
            <div className="relative">
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-cyan-100 to-purple-100 bg-clip-text text-transparent tracking-wide leading-tight animate-text-shimmer drop-shadow-2xl">
                {currentProject.title}
              </h1>
              {/* Subtle 3D text shadow effect */}
              <h1 className="absolute top-0.5 left-0.5 text-4xl md:text-5xl font-black text-black/10 tracking-wide leading-tight -z-10">
                {currentProject.title}
              </h1>
            </div>
            {/* Enhanced Description with Typewriter Effect */}
            <div className="relative overflow-hidden">
              <p className="text-gray-100 text-lg leading-relaxed animate-fade-in-up delay-300 max-w-2xl mx-auto font-light">
                {currentProject.description}
              </p>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            </div>{" "}
            <div className="flex justify-center">
              <div className="w-min flex items-center space-x-2 z-10 bg-black/20 backdrop-blur-xl rounded-full px-4 py-2 border border-white/10">
    {projectCards.map((_, index) => (
                  <button
                    key={index}
                    className={`relative transition-all duration-500 transform focus:outline-none ${
                      index === currentSlide
      ? "w-3 h-3 bg-[#0166aa] rounded-full scale-110 shadow-md border-2 border-[#0166aa]"
      : "w-2.5 h-2.5 bg-white/40 hover:bg-[#0166aa]/40 rounded-full border border-white/20"
                    }`}
                    onClick={() => handleSlideClick(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    {index === currentSlide && (
                      <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-pulse pointer-events-none"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            {/* Enhanced CTA Buttons with Advanced Effects */}
            <div className="flex gap-4 flex-col md:flex-row items-center justify-center gap-y-3">
              {" "}
              <Button
                className="bg-gradient-to-r from-[#0166aa] via-[#0181d6] to-[#015a93] hover:from-[#015a93] hover:via-[#0166aa] hover:to-[#014e7e] text-white rounded-full px-10 py-4 text-lg font-bold group transition-all duration-300 hover:shadow-lg hover:shadow-[#0166aa]/30 border border-[#0166aa]/40 focus:outline-none relative overflow-hidden"
                onClick={() => window.open(currentProject.link, "_blank")}
              >
                <span className="relative z-10 flex items-center">
                  Explore Universe
                  <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2 group-hover:scale-110" />
                </span>
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </Button>
              <Button
                variant="ghost"
                className="text-white/80 hover:text-white rounded-full px-6 py-3 text-base border-2 border-white/30 hover:border-white/60 transition-all duration-300 group backdrop-blur-xl bg-white/5 hover:bg-white/10"
              >
                <Play className="mr-2 h-4 w-4 transition-transform group-hover:scale-125" />
                Watch Magic
              </Button>{" "}
            </div>
          </div>{" "}
          {/* Enhanced Card Glow Effects */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#0166aa]/10 via-[#0181d6]/10 to-[#014e7e]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-[#0166aa] via-[#0181d6] to-[#014e7e] rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-xl pointer-events-none"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-[#0166aa] via-[#0181d6] to-[#014e7e] rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-1000 blur-2xl pointer-events-none"></div>
        </Card>
        {/* Right Arrow with Hover Effect */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-8 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-white/5 backdrop-blur-xl hover:bg-white/20 text-white border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-110 group"
          onClick={nextSlide}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>{" "}
      {/* Curved Loop Banner */}
    </div>
      <div className="bg-black text-white z-10 pt-16">
        <CurvedLoopSection />
      </div>
    </>
  );
}
