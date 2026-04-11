"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function BackgroundParallax() {
  const { scrollY } = useScroll();

  // Parallax effect: moves opposite to scroll direction at different speeds
  const y1 = useTransform(scrollY, [0, 1000], [0, 150]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const y3 = useTransform(scrollY, [0, 1000], [0, 50]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-900">
      <motion.div
        style={{ y: y1 }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500 opacity-20 blur-[120px] mix-blend-screen"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500 opacity-10 blur-[150px] mix-blend-screen"
      />
      <motion.div
        style={{ y: y3 }}
        className="absolute bottom-[-20%] left-[20%] w-[700px] h-[700px] rounded-full bg-indigo-500 opacity-15 blur-[120px] mix-blend-screen"
      />
    </div>
  );
}
