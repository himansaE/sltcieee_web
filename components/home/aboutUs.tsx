"use client";

import React from "react";

const bentoItemsData = [
  {
    id: "about-us",
    title: "About Us",
    content:
      "The IEEE Student Branch of SLTC, established in 2018, provides a platform for students to explore new technology, develop essential skills, and connect with the global tech community. We organize a diverse range of workshops, competitions, and events to encourage innovation and support professional development. Aligned with IEEE's mission, we aim to recognize the powerful impact of technology on society and inspire the next generation of innovators to create positive change.",
    className: "md:col-span-2", // Spans full width in a 2-column grid
  },
  {
    id: "mission",
    title: "Our Mission",
    content:
      "We foster technological innovation and excellence for the benefit of humanity.",
    className: "", // Will take 1 column in a 2-column grid
  },
  {
    id: "vision",
    title: "Our Vision",
    content:
      "IEEE will be essential to the global technical community and to technical professionals everywhere, and be universally recognized for the contributions of technology and of technical professionals in improving global conditions.",
    className: "", // Will take 1 column in a 2-column grid
  },
  {
    id: "chapters",
    title: "Our Chapters and the Affinity Group",
    content:
      "Explore our chapters and the affinity group, including IES, WIE, CS, and IAS, each focusing on different areas of engineering and technology.",
    className: "", // Will take 1 column in a 2-column grid
  },
  {
    id: "get-involved",
    title: "Get Involved",
    content:
      "Step into the global IEEE community and bring your technical and leadership skills to life, while engaging with a network of innovators, collaborating on cutting-edge projects, and making a lasting impact.",
    className: "", // Will take 1 column in a 2-column grid
  },
];

interface BentoCardProps {
  title: string;
  content: string;
  className?: string;
}

const BentoCard: React.FC<BentoCardProps> = ({ title, content, className }) => {
  return (
    <div
      className={`bg-gradient-to-br from-zinc-900/70 to-zinc-950/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-zinc-700/80 shadow-2xl shadow-black/40 flex flex-col transition-all duration-300 ease-out hover:border-zinc-500/80 hover:shadow-cyan-500/20 hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.015] ${className || ""}`}
    >
      <h3 className="text-xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300 mb-3">
        {title}
      </h3>
      <p className="text-gray-400 text-sm sm:text-base leading-relaxed mt-auto">
        {content}
      </p>
    </div>
  );
};

export const AboutUsBento: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#0D0D0D]">
      {" "}
      {/* Increased padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-light text-gray-300 text-left mb-16 sm:mb-20">
          Welcome to <br />
          <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-[#1c80c3] leading-tight font-primary text-4xl sm:text-5xl">
            IEEE Student Branch of SLTC
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
          {" "}
          {/* Increased gap */}
          {bentoItemsData.map((item) => (
            <BentoCard
              key={item.id}
              title={item.title}
              content={item.content}
              className={item.className}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUsBento;
