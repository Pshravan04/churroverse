"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Clock, Send, MapPin, Phone } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: d } }),
};

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <section className="relative py-28 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[300px] rounded-full bg-blue-900/20 blur-[120px]" />
        </div>
        <motion.p custom={0} variants={fadeUp} initial="hidden" animate="visible" className="text-blue-400 font-mono text-sm uppercase tracking-widest mb-4">
          — Open Comm Channel —
        </motion.p>
        <motion.h1 custom={0.1} variants={fadeUp} initial="hidden" animate="visible" className="text-5xl md:text-7xl font-black text-white mb-4">
          Mission Control
        </motion.h1>
        <motion.p custom={0.2} variants={fadeUp} initial="hidden" animate="visible" className="text-gray-400 max-w-xl mx-auto text-lg px-4">
          Questions about your order? Need help with a mission? Open a comm channel — our crew responds within 24 Galactic Hours.
        </motion.p>
      </section>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              { icon: Mail, title: "Email Uplink", info: "crew@churroverse.space", sub: "Reply within 24 hours" },
              { icon: Phone, title: "Comm Channel", info: "+1 (888) CHURRO-V", sub: "Mon–Fri, 9am–6pm" },
              { icon: MapPin, title: "HQ Coordinates", info: "Madrid, Spain", sub: "Galaxy Sector 7-B" },
              { icon: Clock, title: "Response Time", info: "< 24 hours", sub: "Galactic Standard Time" },
            ].map(({ icon: Icon, title, info, sub }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-4 p-5 border border-white/10 rounded-2xl bg-white/5"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{title}</p>
                  <p className="text-white font-bold">{info}</p>
                  <p className="text-gray-500 text-xs">{sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-md p-8"
          >
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="text-6xl mb-6">🚀</div>
                <h2 className="text-3xl font-black text-white mb-3">Transmission Received!</h2>
                <p className="text-gray-400 mb-6">Our crew has received your message. Expect a response within 24 Galactic Hours.</p>
                <Button onClick={() => setSubmitted(false)} className="bg-orange-600 hover:bg-orange-500 rounded-full">
                  Send Another Transmission
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-black text-white mb-6">Open a Comm Channel</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Your Name</label>
                    <input
                      required
                      type="text"
                      placeholder="Commander..."
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Comm ID (Email)</label>
                    <input
                      required
                      type="email"
                      placeholder="you@galaxy.space"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Mission Subject</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
                  >
                    <option value="" className="bg-black">Select subject...</option>
                    <option value="order" className="bg-black">Order Tracking</option>
                    <option value="product" className="bg-black">Product Inquiry</option>
                    <option value="wholesale" className="bg-black">Wholesale Partnership</option>
                    <option value="other" className="bg-black">Other Transmission</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Transmission Content</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your mission objective..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white rounded-full py-4 font-bold text-lg shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:shadow-[0_0_35px_rgba(234,88,12,0.7)] transition-all group"
                >
                  <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Launch Transmission
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
