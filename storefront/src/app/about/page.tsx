"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Rocket, Globe, Heart, Award } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: d } }),
};

const values = [
  { icon: Rocket, title: "Relentless Innovation", desc: "Every month we experiment with flavors from around the world, launching only the ones that clear Galactic Council approval." },
  { icon: Globe, title: "Sustainably Sourced", desc: "All ingredients are ethically sourced from certified suppliers — no dark energy practices allowed." },
  { icon: Heart, title: "Made with Love", desc: "Every churro is hand-rolled by our crew of 40+ trained pastry astronauts working in real-time shifts." },
  { icon: Award, title: "Award-Winning Quality", desc: "Voted #1 Artisanal Churro Brand in 2024 by the Galactic Culinary Institute." },
];

const team = [
  { name: "Capt. Ava Solis", role: "Chief Flavor Architect", emoji: "👩‍🚀" },
  { name: "Dr. Ryo Tanaka", role: "Lead Dough Scientist", emoji: "🧑‍🔬" },
  { name: "Chef Amara Osei", role: "Head Pastry Commander", emoji: "👨‍🍳" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <section className="relative py-32 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[350px] rounded-full bg-orange-900/20 blur-[120px]" />
        </div>
        <motion.p custom={0} variants={fadeUp} initial="hidden" animate="visible" className="text-orange-400 font-mono text-sm uppercase tracking-widest mb-4">
          — Our Origin Story —
        </motion.p>
        <motion.h1 custom={0.1} variants={fadeUp} initial="hidden" animate="visible" className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-500 to-red-500 mb-6">
          We Are Churroverse
        </motion.h1>
        <motion.p custom={0.2} variants={fadeUp} initial="hidden" animate="visible" className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed px-4">
          Born in a tiny Madrid kitchen in 2019, Churroverse was ignited by a simple question: "What if a churro could taste like the entire galaxy?" Three years, 400 test batches, and one Big Bang later — here we are.
        </motion.p>
      </section>

      {/* Values */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-center text-white mb-16"
          >
            Our Galaxy Values
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-5 p-8 border border-white/10 rounded-3xl bg-white/5 hover:border-orange-500/30 transition-colors"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center">
                  <v.icon className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black text-center text-white mb-16"
          >
            The Galactic Crew
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -6 }}
                className="text-center p-8 border border-white/10 rounded-3xl bg-white/5 hover:border-orange-500/30 transition-all"
              >
                <div className="text-6xl mb-4">{member.emoji}</div>
                <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                <p className="text-orange-400 font-mono text-xs uppercase tracking-widest">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-black text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-4"
        >
          <h2 className="text-4xl font-black text-white mb-4">Ready to Join the Mission?</h2>
          <p className="text-gray-400 mb-8">Explore the fleet and pick your first capsule.</p>
          <Link href="/products" className="inline-block bg-orange-600 hover:bg-orange-500 text-white font-bold px-10 py-4 rounded-full shadow-[0_0_25px_rgba(234,88,12,0.5)] hover:shadow-[0_0_40px_rgba(234,88,12,0.7)] transition-all">
            Explore the Fleet →
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
