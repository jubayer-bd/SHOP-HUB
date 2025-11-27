"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// 10 Data Items
const slides = [
  {
    id: 1,
    title: "Noise Cancelling Headphones",
    subtitle:
      "Premium wireless over-ear noise cancelling headphones with 30-hour battery life.",
    buttonText: "Shop Audio",
    link: "/product/headphones",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Pro Wireless Earbuds",
    subtitle:
      "Experience crystal clear sound with our newest compact IPX7 waterproof earbuds.",
    buttonText: "See Earbuds",
    link: "/product/earbuds",
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Ultra Smart Watch",
    subtitle:
      "Track your health, sleep, and fitness with the all-new titanium smart watch.",
    buttonText: "View Watch",
    link: "/product/smartwatch",
    image:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "VR Headset Pro",
    subtitle:
      "Immerse yourself in new worlds with 8K resolution and 120Hz refresh rate.",
    buttonText: "Explore VR",
    link: "/product/vr",
    image:
      "https://www.cnet.com/a/img/resize/c4af1c3cd1fba7bf066f5b37f8325505a97f65f7/hub/2022/10/10/437e93c0-962a-4a6e-8ea0-7bffa411a67b/meta-quest-2-vr-virtual-reality-7426.jpg?auto=webp&width=1200",
  },
  {
    id: 5,
    title: "Mechanical Keyboard",
    subtitle:
      "Tactile switches and RGB backlighting for the ultimate typing experience.",
    buttonText: "Type Better",
    link: "/product/keyboard",
    image:
      "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Gaming Mouse",
    subtitle:
      "Ultra-lightweight design with 25K DPI sensor for precision gaming.",
    buttonText: "Shop Gaming",
    link: "/product/mouse",
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 7,
    title: "4K OLED Monitor",
    subtitle: "True blacks and vibrant colors for creators and gamers alike.",
    buttonText: "See Monitors",
    link: "/product/monitor",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 8,
    title: "Professional Drone",
    subtitle:
      "Capture cinematic aerial footage with a 1-inch sensor and 4K video.",
    buttonText: "Fly High",
    link: "/product/drone",
    image:
      "https://m.media-amazon.com/images/I/6164qMcQaaL._AC_UF894,1000_QL80_.jpg",
  },
  {
    id: 9,
    title: "Smart Home Speaker",
    subtitle:
      "Fill your room with rich sound and control your home with voice commands.",
    buttonText: "Listen Now",
    link: "/product/speaker",
    image:
      "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 10,
    title: "Tablet Pro 12.9",
    subtitle:
      "Your next computer is not a computer. It's a magical piece of glass.",
    buttonText: "View Tablet",
    link: "/product/tablet",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1000&auto=format&fit=crop",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto slide logic - pauses when user hovers
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div
      className="w-full bg-white py-16 px-6 md:px-10 lg:px-20 relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center min-h-[450px]">
        {/* TEXT AREA */}
        <div className="order-2 lg:order-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={slides[current].id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">
                Featured Product
              </span>

              <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                {slides[current].title}
              </h1>

              <p className="text-gray-500 text-lg lg:text-xl max-w-md leading-relaxed">
                {slides[current].subtitle}
              </p>

              {/* <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href={slides[current].link}
                  className="inline-block px-8 py-4 bg-blue-600 text-white font-medium rounded-xl shadow-lg hover:bg-blue-700 hover:scale-105 transform transition-all duration-200"
                >
                  {slides[current].buttonText}
                </Link>
              </div> */}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div className="flex gap-4 pt-10">
            <button
              onClick={prevSlide}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-black transition"
              aria-label="Previous Slide"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-black transition"
              aria-label="Next Slide"
            >
              →
            </button>
          </div>
        </div>

        {/* IMAGE AREA */}
        <div className="order-1 lg:order-2 relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={slides[current].id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={slides[current].image}
                alt={slides[current].title}
                fill
                className="object-contain lg:object-cover rounded-3xl shadow-2xl"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* DOTS PAGINATION */}
      <div className="flex justify-center gap-2 mt-8 absolute bottom-5 left-0 right-0">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              current === index
                ? "w-8 bg-blue-600"
                : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
