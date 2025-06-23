"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  Star,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/utils";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { OrganizationUnitWithEvents } from "@/lib/api/organizationUnitFn";
import { TopNav } from "@/components/home/topNav";

interface OrganizationUnitPageProps {
  unit: OrganizationUnitWithEvents;
}

export function OrganizationUnitPage({ unit }: OrganizationUnitPageProps) {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nonDraftEvents = unit.events.filter((e) => e.status !== "draft");

  const upcomingEventsList = nonDraftEvents.filter(
    (e) => new Date(e.date) > new Date()
  );

  // Auto-advance events carousel
  useEffect(() => {
    if (!isAutoPlaying || upcomingEventsList.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % upcomingEventsList.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, upcomingEventsList.length]);

  const nextEvent = () => {
    setCurrentEventIndex((prev) => (prev + 1) % upcomingEventsList.length);
  };

  const prevEvent = () => {
    setCurrentEventIndex(
      (prev) =>
        (prev - 1 + upcomingEventsList.length) % upcomingEventsList.length
    );
  };

  // Calculate stats from database data
  const activeEvents = nonDraftEvents.filter(
    (e) => e.status === "ongoing" || e.status === "registrationOpen"
  ).length;
  const completedEvents = nonDraftEvents.filter(
    (e) => e.status === "completed"
  ).length;
  const totalEvents = nonDraftEvents.length;
  const upcomingEvents = upcomingEventsList.length;

  const stats = [
    { label: "Active Events", value: activeEvents, icon: Calendar },
    { label: "Total Events", value: totalEvents, icon: Trophy },
    { label: "Completed", value: completedEvents, icon: Star },
    { label: "Upcoming", value: upcomingEvents, icon: Users },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <TopNav />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-blue-900/20" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="relative w-40 h-40 mx-auto mb-8 group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-xl opacity-50" />
              <div className="relative w-full h-full bg-white rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                <Image
                  src={getImageUrl(unit.image)}
                  alt={unit.title}
                  fill
                  className="object-contain rounded-full"
                  unoptimized
                />
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">
                {unit.title}
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              {unit.description}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-cyan-400 bg-cyan-400 text-black font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
            >
              <Link href="#upcoming-events">
                View Events
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 relative bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-black" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={cn("grid md:grid-cols-5 gap-16 items-center", {
              "md:grid-cols-1": totalEvents === 0,
            })}
          >
            <div
              className={cn("md:col-span-3", {
                "md:col-span-5 text-center": totalEvents === 0,
              })}
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
                About {unit.title}
              </h2>
              <div
                className={cn(
                  "w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mb-8",
                  { "mx-auto": totalEvents === 0 }
                )}
              />
              <p className="text-xl text-gray-300 leading-relaxed">
                {unit.description}
              </p>
            </div>
            {totalEvents > 0 && (
              <div className="md:col-span-2 grid grid-cols-2 gap-6">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="group bg-gray-900/50 p-6 rounded-xl border border-gray-700 hover:border-cyan-500/50 hover:-translate-y-1 transition-all duration-300 text-center"
                  >
                    <div className="flex justify-center mb-4">
                      <stat.icon className="h-10 w-10 text-cyan-400" />
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {upcomingEventsList.length > 0 && (
            <div className="mb-24">
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
                  Upcoming Events
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-8" />
              </div>

              {/* Event Carousel */}
              <div className="relative">
                <div
                  key={currentEventIndex}
                  className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-700 backdrop-blur-sm overflow-hidden transition-all duration-700 ease-in-out hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-[1.02]"
                >
                  <div className="md:flex relative">
                    {/* Animated gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="md:w-1/2 p-8 lg:p-12 relative z-10">
                      <div className="flex items-center mb-4">
                        <Badge
                          variant="secondary"
                          className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 mr-3 hover:bg-cyan-500/30 transition-all duration-300"
                        >
                          {upcomingEventsList[currentEventIndex].status

                            .replace(/([A-Z])/g, " $1")
                            .trim()
                            .toUpperCase()}
                        </Badge>
                        <span className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                          {format(
                            new Date(
                              upcomingEventsList[currentEventIndex].date
                            ),
                            "MMM dd, yyyy"
                          )}
                        </span>
                      </div>
                      <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6 group-hover:text-cyan-100 transition-colors duration-300">
                        {upcomingEventsList[currentEventIndex].title}
                      </h3>
                      <p className="text-gray-300 text-lg mb-8 leading-relaxed group-hover:text-gray-200 transition-colors duration-300 line-clamp-3 min-h-[88px]">
                        {upcomingEventsList[currentEventIndex]
                          .simpleDescription ||
                          upcomingEventsList[currentEventIndex].description}
                      </p>
                      <div className="flex items-center text-gray-400 mb-8 space-x-6">
                        <div className="flex items-center group-hover:text-gray-300 transition-colors duration-300">
                          <MapPin className="h-5 w-5 mr-2 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
                          <span>
                            {upcomingEventsList[currentEventIndex].location}
                          </span>
                        </div>
                        <div className="flex items-center group-hover:text-gray-300 transition-colors duration-300">
                          <Clock className="h-5 w-5 mr-2 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
                          <span>
                            {format(
                              new Date(
                                upcomingEventsList[currentEventIndex].date
                              ),
                              "h:mm a"
                            )}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/events/${upcomingEventsList[currentEventIndex].id}`}
                        passHref
                      >
                        <Button className="group/btn bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40">
                          Learn More
                          <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </Link>
                    </div>
                    <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden">
                      <Image
                        src={getImageUrl(
                          upcomingEventsList[currentEventIndex].coverImage
                        )}
                        alt={upcomingEventsList[currentEventIndex].title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-l from-transparent to-gray-900/20 group-hover:to-gray-900/10 transition-all duration-500" />

                      {/* Shimmer effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-in-out" />
                    </div>
                  </div>
                </div>

                {/* Carousel Controls */}
                {upcomingEventsList.length > 1 && (
                  <div className="flex items-center justify-center mt-8 space-x-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={prevEvent}
                      className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black rounded-full"
                      aria-label="Previous event"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                      className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black rounded-full"
                      aria-label={
                        isAutoPlaying ? "Pause autoplay" : "Start autoplay"
                      }
                    >
                      {isAutoPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={nextEvent}
                      className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black rounded-full"
                      aria-label="Next event"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                )}

                {/* Event indicators */}
                {upcomingEventsList.length > 1 && (
                  <div className="flex justify-center mt-6 space-x-2">
                    {upcomingEventsList.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentEventIndex(index)}
                        className={cn(
                          "w-3 h-3 rounded-full transition-all duration-300",
                          index === currentEventIndex
                            ? "bg-cyan-400 scale-125"
                            : "bg-gray-600 hover:bg-gray-500"
                        )}
                        aria-label={`Go to event ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* All Events Grid */}
          {nonDraftEvents.length > 0 ? (
            <div>
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
                  {upcomingEventsList.length > 0 ? "All Events" : "Our Events"}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-8" />
                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  {upcomingEventsList.length > 0
                    ? `Explore our rich history of events.`
                    : `We currently have no upcoming events, but you can check out our past events.`}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {nonDraftEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="group bg-gray-800/50 rounded-2xl border border-gray-700 backdrop-blur-sm overflow-hidden hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={getImageUrl(event.coverImage)}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <Badge className="absolute top-4 left-4 bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                        {event.status
                          .replace(/([A-Z])/g, " $1")
                          .trim()
                          .toUpperCase()}
                      </Badge>
                      {new Date(event.date) > new Date() && (
                        <Badge className="absolute top-4 right-4 bg-green-500/20 text-green-300 border-green-500/30">
                          UPCOMING
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-6 flex flex-col h-full">
                      <h4 className="text-lg font-semibold text-white mb-3 group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {event.title}
                      </h4>
                      <div className="flex items-center text-gray-400 text-sm mb-2">
                        <Calendar className="h-4 w-4 mr-2 text-cyan-400" />
                        <span>
                          {format(new Date(event.date), "MMM dd, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-400 text-sm mb-4">
                        <Clock className="h-4 w-4 mr-2 text-cyan-400" />
                        <span>{format(new Date(event.date), "h:mm a")}</span>
                        {event.location && (
                          <>
                            <MapPin className="h-4 w-4 mr-2 ml-4 text-cyan-400" />
                            <span className="truncate">{event.location}</span>
                          </>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm line-clamp-3 mb-4 flex-grow min-h-[60px]">
                        {event.simpleDescription || event.description}
                      </p>
                      <Link href={`/events/${event.id}`} passHref>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-cyan-400/50 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300"
                        >
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <Calendar className="mx-auto h-20 w-20 text-gray-600" />
              <h3 className="mt-6 text-2xl font-bold text-white">
                No Events Scheduled
              </h3>
              <p className="mt-2 text-lg text-gray-400">
                Please check back later for upcoming events from {unit.title}.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
