"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const linkItems = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "#about" },
  { name: "Events", href: "#events" },
  { name: "Organization Units", href: "#organization-units" },
  { name: "Join Us", href: "#join" },
  { name: "Contact", href: "#contact" },
];

export const TopNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect for the navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Set active link based on current path
    if (typeof window !== "undefined") {
      setActiveLink(window.location.pathname);
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out bg-slate-950/80 py-2 backdrop-blur-3xl",
        scrolled ? "backdrop-blur-lg shadow-sm py-2" : ""
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" aria-label="Home page" className="block">
              <Image
                src={"/sb-logo-color.webp"}
                alt="IEEE SLTC Logo"
                width={186}
                height={36}
                className="transition-all duration-300 hover:opacity-90"
                unoptimized
              />
            </Link>
          </div>

          {/* Desktop Navigation - Simplified */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {linkItems.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  // Updated text color for dark bg
                  "text-gray-200 px-3 py-2 text-sm font-medium transition-all duration-200 hover:text-white",
                  activeLink === link.href
                    ? "text-white after:block after:h-0.5 after:bg-primary after:w-full after:scale-x-100 after:transition-transform after:duration-300"
                    : "after:block after:h-0.5 after:bg-primary after:w-full after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
                )}
              >
                {link.name}
              </Link>
            ))}

            {/* <Button
              size="sm"
              variant="default"
              className="ml-4 group relative bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-full px-5 py-2 text-xs transition-all duration-300 shadow-md shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/50 border border-cyan-400/20 hover:border-cyan-300/30 focus:outline-none"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                Subscribe
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
              <div className="absolute inset-0 rounded-full bg-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
            </Button> */}
          </div>

          {/* Modern Mobile Navigation */}
          <div className="flex md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className={cn(
                    "relative flex items-center justify-center w-10 h-10 text-gray-200 transition-all focus:outline-none rounded-full",
                    mobileMenuOpen ? "bg-primary/10" : "hover:bg-slate-800/60"
                  )}
                  aria-label="Menu"
                >
                  <div className="flex flex-col justify-center items-center w-5 h-5 space-y-1.5 transform transition-all duration-300">
                    <span
                      className={cn(
                        "block h-0.5 w-5 bg-gray-300 transition-all duration-300 ease-out",
                        mobileMenuOpen && "rotate-45 translate-y-2 bg-primary"
                      )}
                    />
                    <span
                      className={cn(
                        "block h-0.5 w-5 bg-gray-300 transition-all duration-300 ease-out",
                        mobileMenuOpen && "opacity-0"
                      )}
                    />
                    <span
                      className={cn(
                        "block h-0.5 w-5 bg-gray-300 transition-all duration-300 ease-out",
                        mobileMenuOpen && "-rotate-45 -translate-y-2 bg-primary"
                      )}
                    />
                  </div>
                </button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[85%] max-w-md p-0 border-none bg-slate-950/95"
                hideCloseButton
              >
                <div className="flex flex-col h-full bg-slate-950/95 backdrop-blur-lg rounded-l-2xl shadow-2xl overflow-hidden">
                  {/* Header */}
                  <div className="p-5 flex items-center justify-between border-b border-slate-800">
                    <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                      <Image
                        src={"/sb-logo-color.webp"}
                        alt="IEEE SLTC Logo"
                        width={130}
                        height={26}
                        className="transition-transform duration-300 hover:scale-105"
                        unoptimized
                      />
                    </Link>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-full p-2 hover:bg-slate-800 transition-colors"
                      aria-label="Close menu"
                    >
                      <X className="h-5 w-5 text-gray-300" />
                    </button>
                  </div>

                  {/* Navigation items */}
                  <div className="overflow-y-auto flex-1 py-6">
                    <div className="space-y-1 px-3">
                      {/* Show all items in mobile menu with modern styling */}
                      {linkItems.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center justify-between px-4 py-3.5 text-base font-medium transition-all duration-200 rounded-xl group text-gray-200",
                            activeLink === link.href
                              ? "bg-primary/10 font-medium"
                              : " hover:bg-slate-800/60 hover:text-white"
                          )}
                        >
                          <span>{link.name}</span>
                          <ChevronRight
                            className={cn(
                              "h-4 w-4 opacity-0 -translate-x-2 transition-all duration-200",
                              activeLink === link.href
                                ? "text-primary opacity-100 translate-x-0"
                                : "group-hover:opacity-70 group-hover:translate-x-0"
                            )}
                          />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto p-5 bg-slate-900/80">
                    <Button
                      className="w-full group relative bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-full h-12 text-base transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/50 border border-cyan-400/20 hover:border-cyan-300/30 focus:outline-none"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="relative z-10 flex items-center gap-1.5">
                        Subscribe
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
                      <div className="absolute inset-0 rounded-full bg-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
