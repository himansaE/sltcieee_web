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
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Services", href: "/services" },
  { name: "Blog", href: "/blog" },
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
        "sticky top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out",
        scrolled
          ? "bg-white/80 backdrop-blur-lg shadow-sm py-2 border-b border-gray-100"
          : "bg-white py-3"
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
                width={150}
                height={30}
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
                  "text-gray-600 px-3 py-2 text-sm font-medium transition-all duration-200 hover:text-gray-900",
                  activeLink === link.href
                    ? "text-gray-900 after:block after:h-0.5 after:bg-primary after:w-full after:scale-x-100 after:transition-transform after:duration-300"
                    : "after:block after:h-0.5 after:bg-primary after:w-full after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
                )}
              >
                {link.name}
              </Link>
            ))}

            <Button
              size="sm"
              variant="default"
              className="ml-4 bg-gradient-to-r from-primary to-primary/90 hover:opacity-90 rounded-full px-5 font-medium"
            >
              Subscribe
            </Button>
          </div>

          {/* Modern Mobile Navigation */}
          <div className="flex md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className={cn(
                    "relative flex items-center justify-center w-10 h-10 text-gray-700 transition-all focus:outline-none rounded-full",
                    mobileMenuOpen ? "bg-primary/10" : "hover:bg-gray-100"
                  )}
                  aria-label="Menu"
                >
                  <div className="flex flex-col justify-center items-center w-5 h-5 space-y-1.5 transform transition-all duration-300">
                    <span
                      className={cn(
                        "block h-0.5 w-5 bg-gray-600 transition-all duration-300 ease-out",
                        mobileMenuOpen && "rotate-45 translate-y-2 bg-primary"
                      )}
                    />
                    <span
                      className={cn(
                        "block h-0.5 w-5 bg-gray-600 transition-all duration-300 ease-out",
                        mobileMenuOpen && "opacity-0"
                      )}
                    />
                    <span
                      className={cn(
                        "block h-0.5 w-5 bg-gray-600 transition-all duration-300 ease-out",
                        mobileMenuOpen && "-rotate-45 -translate-y-2 bg-primary"
                      )}
                    />
                  </div>
                </button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[85%] max-w-md p-0 border-none bg-transparent"
                hideCloseButton
              >
                <div className="flex flex-col h-full bg-white/95 backdrop-blur-lg rounded-l-2xl shadow-2xl overflow-hidden">
                  {/* Header */}
                  <div className="p-5 flex items-center justify-between border-b border-gray-100">
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
                      className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                      aria-label="Close menu"
                    >
                      <X className="h-5 w-5 text-gray-500" />
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
                            "flex items-center justify-between px-4 py-3.5 text-base font-medium transition-all duration-200 rounded-xl group",
                            activeLink === link.href
                              ? "text-primary bg-primary/5 font-medium"
                              : "text-gray-700 hover:bg-gray-50/80 hover:text-gray-900"
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
                  <div className="mt-auto p-5 bg-gray-50/70">
                    <Button
                      className="w-full bg-gradient-to-r from-primary to-primary/90 hover:opacity-90 rounded-xl h-12 text-base"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Subscribe
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
