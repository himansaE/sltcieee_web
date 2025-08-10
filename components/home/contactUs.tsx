"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const ContactUs = () => {
  // Placeholder team member images - replace with actual team photos
  const teamMembers = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      alt: "Team Member 1",
      name: "John Doe",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      alt: "Team Member 2",
      name: "Jane Smith",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      alt: "Team Member 3",
      name: "Mike Johnson",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      alt: "Team Member 4",
      name: "Sarah Wilson",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      alt: "Team Member 5",
      name: "Alex Brown",
    },
  ];
  return (
    <section
      id="contact"
      className="relative min-h-screen bg-[#111] text-white overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-0 top-0 transform -translate-x-1/3 opacity-100 size-full inset-0">
          <Image
            src="/sb-icon-black.png"
            alt="IEEE SLTC Background"
            width={400}
            height={400}
            className="w-full h-full object-cover md:object-contain"
            unoptimized
          />
        </div>
      </div>
      {/* Main Content */}
      <div className="relative z-10 px-8 md:px-16 lg:px-24 xl:px-44  mx-auto py-16 md:py-24">
        <div className="grid text-center md:text-left md:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[70vh]">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Let&apos;s create <span className="block">something</span>
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  extraordinary
                </span>
                <span className="block">together.</span>
              </h1>

              <p className="text-[#434343] text-lg md:text-xl font-medium">
                make an impact
              </p>
            </div>
          </div>{" "}
          {/* Right Content */}
          <div className="space-y-10">
            {" "}
            {/* Team Members Row Layout - Matching Screenshot */}
            <div className="flex justify-center lg:justify-end mb-4">
              <div className="relative flex items-center">
                {teamMembers.map((member, index) => (
                  <div
                    key={member.id}
                    className="relative transition-all duration-300 hover:scale-110 hover:z-10"
                    style={{
                      marginLeft: index > 0 ? "-16px" : "0", // More overlapping like screenshot
                      zIndex:
                        teamMembers.length -
                        Math.abs(index - Math.floor(teamMembers.length / 2)),
                    }}
                  >
                    <div className="relative">
                      <div className="w-16 h-16 md:w-18 md:h-18 rounded-full overflow-hidden border-3 border-white/40 hover:border-green-400 transition-all duration-300 shadow-lg hover:shadow-green-500/30">
                        <Image
                          src={member.src}
                          alt={member.alt}
                          width={72}
                          height={72}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>{" "}
            {/* Contact Information */}
            <div className="text-center lg:text-right space-y-6">
              <div className="space-y-1">
                <p className="text-gray-400 text-xs uppercase tracking-wide">
                  Contact Us
                </p>
                <Link
                  href="mailto:ieeestudentbranch@sltc.ac.lk"
                  className="text-xl md:text-2xl lg:text-3xl font-semibold font-primary text-white"
                >
                  ieeestudentbranch<span className="text-blue-400">@</span>
                  sltc.ac.lk
                </Link>
              </div>

              <div className="space-y-4">
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed max-w-xs mx-auto lg:mx-0 lg:ml-auto">
                  Get in touch with us to{" "}
                  <span className="text-cyan-400 font-semibold">
                    learn more{" "}
                  </span>{" "}
                  about our activities, events, and how you can get{" "}
                  <span className="text-cyan-400 font-semibold">involved </span>{" "}
                  with us.
                </p>{" "}
                {/* Contact Button & Social Media */}
                <div className="flex flex-col lg:items-end items-center gap-6 pt-2">
                  {/* Contact Button */}
                  <Button
                    className={cn(
                      "group relative bg-[#0166aa] hover:bg-[#015a93]",
                      "text-white font-semibold py-2 px-5 rounded-full text-xs",
                      "transition-all duration-300 shadow-lg shadow-[#0166aa]/30",
                      "hover:shadow-xl hover:shadow-[#0166aa]/50 transform hover:scale-105",
                      "border border-[#0166aa]/20 hover:border-[#0166aa]/30"
                    )}
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      Contact Us
                      <svg
                        className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>

                    {/* Button glow effect */}
                    <div className="absolute inset-0 rounded-full bg-[#0166aa] opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
                  </Button>

                  {/* Social Media Links */}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs mr-1">
                      Follow us:
                    </span>

                    {/* Facebook */}
                    <Link
                      href="https://www.facebook.com/sltcieee/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative p-2 rounded-full bg-white/5 hover:bg-[#0166aa]/20 border border-white/10 hover:border-[#0166aa]/30 transition-all duration-300 hover:scale-110"
                      aria-label="Follow us on Facebook"
                    >
                      <svg
                        className="w-3 h-3 text-gray-400 group-hover:text-[#0166aa] transition-colors duration-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <div className="absolute inset-0 rounded-full bg-[#0166aa]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
                    </Link>

                    {/* LinkedIn */}
                    <Link
                      href="https://www.linkedin.com/company/ieee-student-branch-of-sltc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative p-2 rounded-full bg-white/5 hover:bg-[#0166aa]/20 border border-white/10 hover:border-[#0166aa]/30 transition-all duration-300 hover:scale-110"
                      aria-label="Follow us on LinkedIn"
                    >
                      <svg
                        className="w-3 h-3 text-gray-400 group-hover:text-[#0166aa] transition-colors duration-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      <div className="absolute inset-0 rounded-full bg-[#0166aa]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
                    </Link>

                    {/* Instagram */}
                    <Link
                      href="https://www.instagram.com/sltcieee/?hl=en"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative p-2 rounded-full bg-white/5 hover:bg-pink-600/20 border border-white/10 hover:border-pink-400/30 transition-all duration-300 hover:scale-110"
                      aria-label="Follow us on Instagram"
                    >
                      <svg
                        className="w-3 h-3 text-gray-400 group-hover:text-pink-400 transition-colors duration-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      <div className="absolute inset-0 rounded-full bg-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
                    </Link>

                    {/* TikTok */}
                    <Link
                      href="https://www.tiktok.com/@sltcieee"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative p-2 rounded-full bg-white/5 hover:bg-[#0166aa]/20 border border-white/10 hover:border-[#0166aa]/30 transition-all duration-300 hover:scale-110"
                      aria-label="Follow us on TikTok"
                    >
                      <svg
                        className="w-3 h-3 text-gray-400 group-hover:text-[#0166aa] transition-colors duration-300"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02c.08 1.53.63 3.09 1.75 4.17c1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97c-.57-.26-1.1-.59-1.62-.93c-.01 2.92.01 5.84-.02 8.75c-.08 1.4-.54 2.79-1.35 3.94c-1.31 1.92-3.58 3.17-5.91 3.21c-1.43.08-2.86-.31-4.08-1.03c-2.02-1.19-3.44-3.37-3.65-5.71c-.02-.5-.03-1-.01-1.49c.18-1.9 1.12-3.72 2.58-4.96c1.66-1.44 3.98-2.13 6.15-1.72c.02 1.48-.04 2.96-.04 4.44c-.99-.32-2.15-.23-3.02.37c-.63.41-1.11 1.04-1.36 1.75c-.21.51-.15 1.07-.14 1.61c.24 1.64 1.82 3.02 3.5 2.87c1.12-.01 2.19-.66 2.77-1.61c.19-.33.4-.67.41-1.06c.1-1.79.06-3.57.07-5.36c.01-4.03-.01-8.05 0-12.07" />
                      </svg>
                      <div className="absolute inset-0 rounded-full bg-[#0166aa]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
                    </Link>

                    {/* YouTube */}
                    <Link
                      href="https://www.youtube.com/@sltcieee"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative p-2 rounded-full bg-white/5 hover:bg-red-600/20 border border-white/10 hover:border-red-400/30 transition-all duration-300 hover:scale-110"
                      aria-label="Subscribe to our YouTube channel"
                    >
                      <svg
                        className="w-3 h-3 text-gray-400 group-hover:text-red-400 transition-colors duration-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                      <div className="absolute inset-0 rounded-full bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div> */}
    </section>
  );
};

export default ContactUs;
