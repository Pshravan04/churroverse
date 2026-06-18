"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ShoppingBag, Zap, Loader2, Check, Shield, Truck, CreditCard, MapPin } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice, generateOrderNumber } from "@/lib/types";
import type { ShippingAddress, Order, Address } from "@/lib/types";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void; on: (event: string, handler: (response: Record<string, unknown>) => void) => void };
  }
}

type CheckoutStep = "review" | "shipping" | "payment" | "confirming" | "success";

export default function CheckoutPage() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const totalItems = useCartStore((s) => s.totalItems());

  const [step, setStep] = useState<CheckoutStep>("review");
  const [shipping, setShipping] = useState<ShippingAddress>({
    full_name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "", country: "India",
  });
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [error, setError] = useState("");

  const shippingCost = totalPrice >= 50000 ? 0 : 4900;
  const grandTotal = totalPrice + shippingCost;

  // Redirect to cart if empty
  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/login");
    }
  }, [isLoaded, userId, router]);

  useEffect(() => {
    if (items.length === 0 && step !== "success") {
      router.push("/cart");
    }
  }, [items.length, step, router]);

  if (!isLoaded || !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-orange-500/50 animate-pulse" />
      </div>
    );
  }

  async function handlePlaceOrder() {
    setError("");
    setStep("shipping");
  }

  async function handleShippingSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Validate
    if (!shipping.full_name || !shipping.phone || !shipping.line1 || !shipping.city || !shipping.state || !shipping.pincode) {
      setError("Please fill in all required fields.");
      return;
    }

    setStep("payment");

    try {
      // 1. Create Razorpay order
      const orderRes = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: grandTotal,
          receipt: `cv_${Date.now()}`,
        }),
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json();
        throw new Error(errData.error || "Failed to create payment order");
      }

      const { orderId: razorpayOrderId } = await orderRes.json();

      // 2. Create order in Supabase
      const orderData: Partial<Order> = {
        order_number: generateOrderNumber(),
        user_id: userId!,
        status: "pending",
        subtotal: totalPrice,
        shipping: shippingCost,
        total: grandTotal,
        shipping_address: shipping,
        razorpay_order_id: razorpayOrderId,
      };

      const createRes = await fetch("/api/checkout/create-supabase-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderData,
          cartItems: items,
        }),
      });

      if (!createRes.ok) {
        const errData = await createRes.json();
        throw new Error(errData.error || "Failed to create order");
      }

      const { order } = await createRes.json();
      setOrderId(order.id);
      setOrderNumber(order.order_number);

      // 3. Open Razorpay checkout
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (razorpayKey) {
        // Load Razorpay script if not loaded
        if (!document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
            document.head.appendChild(script);
          });
        }

        const options = {
          key: razorpayKey,
          amount: grandTotal,
          currency: "INR",
          name: "CHURROVERSE",
          description: `Order ${order.order_number}`,
          order_id: razorpayOrderId,
          prefill: {
            name: shipping.full_name,
            contact: shipping.phone,
          },
          theme: { color: "#ea580c" },
          handler: async function (response: Record<string, unknown>) {
            setStep("confirming");
            // Verify payment
            const verifyRes = await fetch("/api/checkout/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: razorpayOrderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                our_order_id: order.id,
              }),
            });

            if (verifyRes.ok) {
              await clearCart(userId);
              setStep("success");
            } else {
              setError("Payment verification failed. Please contact support.");
              setStep("review");
            }
          },
          modal: {
            ondismiss: () => {
              setStep("shipping");
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // No Razorpay key — simulate payment for development
        setStep("confirming");
        await new Promise((r) => setTimeout(r, 1500));

        const verifyRes = await fetch("/api/checkout/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: razorpayOrderId,
            razorpay_payment_id: "simulated_payment",
            razorpay_signature: "simulated",
            our_order_id: order.id,
          }),
        });

        if (verifyRes.ok) {
          await clearCart(userId);
          setStep("success");
        } else {
          setError("Payment processing failed.");
          setStep("review");
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      setStep("review");
    }
  }

  // ── Success screen ──────────────────────────────────────
  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-10 h-10 text-green-400" />
          </motion.div>
          <h1 className="text-4xl font-black text-white mb-3">Mission Launched!</h1>
          <p className="text-gray-400 mb-2">
            Your order <span className="text-orange-400 font-bold">{orderNumber}</span> has been confirmed.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Your churros are being prepared in our zero-gravity kitchen.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard">
              <Button className="bg-orange-600 hover:bg-orange-500 rounded-full px-8">
                Track Mission
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10">
                Continue Browsing
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Confirming screen ───────────────────────────────────
  if (step === "confirming") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin" />
            <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-orange-400 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Confirming Launch...</h2>
          <p className="text-gray-500">Please wait while we verify your payment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-12">
          <Link href="/cart" className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors group mb-4 w-fit">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Manifest
          </Link>
          <p className="text-orange-400 font-mono text-sm uppercase tracking-widest mb-2">— Launch Sequence —</p>
          <h1 className="text-4xl md:text-5xl font-black text-white">Checkout</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main form area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Review Order */}
            {step === "review" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-white/10 rounded-3xl bg-white/5 p-6"
              >
                <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-orange-400" />
                  Review Your Manifest
                </h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 border border-white/10 rounded-xl">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-2xl border border-white/10">
                        {item.product.emoji}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-white text-sm">{item.product.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-orange-400 font-bold text-sm">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handlePlaceOrder}
                    className="bg-orange-600 hover:bg-orange-500 rounded-full px-8 font-bold"
                  >
                    Proceed to Shipping
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Shipping Address */}
            {step === "shipping" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-white/10 rounded-3xl bg-white/5 p-6"
              >
                <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-orange-400" />
                  Galactic Coordinates
                </h2>

                <SavedAddresses userId={userId!} onSelect={(a) => setShipping({ full_name: a.full_name, phone: a.phone, line1: a.line1, line2: a.line2 ?? "", city: a.city, state: a.state, pincode: a.pincode, country: a.country })} />

                {error && (
                  <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleShippingSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Full Name *</label>
                      <input required type="text" value={shipping.full_name} onChange={(e) => setShipping({ ...shipping, full_name: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                        placeholder="Commander Reyes" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Phone *</label>
                      <input required type="tel" value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                        placeholder="+91 98765 43210" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Address Line 1 *</label>
                      <input required type="text" value={shipping.line1} onChange={(e) => setShipping({ ...shipping, line1: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                        placeholder="42 Nebula Street" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Address Line 2</label>
                      <input type="text" value={shipping.line2 ?? ""} onChange={(e) => setShipping({ ...shipping, line2: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                        placeholder="Apartment, suite, etc." />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">City *</label>
                      <input required type="text" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                        placeholder="Mumbai" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">State *</label>
                      <input required type="text" value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                        placeholder="Maharashtra" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Pincode *</label>
                      <input required type="text" pattern="[0-9]{6}" value={shipping.pincode} onChange={(e) => setShipping({ ...shipping, pincode: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                        placeholder="400001" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Country</label>
                      <input type="text" value={shipping.country} disabled
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed" />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setStep("review")}
                      className="rounded-full border-white/20 text-gray-400 hover:text-white">
                      Back
                    </Button>
                    <Button type="submit"
                      className="flex-1 bg-orange-600 hover:bg-orange-500 text-white rounded-full py-4 font-bold shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:shadow-[0_0_35px_rgba(234,88,12,0.7)] transition-all group">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Proceed to Payment
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 3: Payment (handled by Razorpay) */}
            {step === "payment" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-white/10 rounded-3xl bg-white/5 p-6 text-center"
              >
                <div className="py-12">
                  <Loader2 className="w-8 h-8 text-orange-400 animate-spin mx-auto mb-4" />
                  <p className="text-gray-400">Opening secure payment portal...</p>
                  <p className="text-gray-600 text-sm mt-2">Please complete the payment in the Razorpay window.</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border border-white/10 rounded-3xl bg-white/5 p-6 h-fit sticky top-24"
            >
              <h2 className="text-lg font-black text-white mb-6">Mission Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Galactic Shipping</span>
                  <span className={shippingCost === 0 ? "text-green-400" : ""}>
                    {shippingCost === 0 ? "Free 🎉" : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between text-white font-black text-lg">
                  <span>Total</span>
                  <span className="text-orange-400">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600 justify-center">
                <Shield className="w-3 h-3" />
                Secured by Razorpay
              </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
}

function SavedAddresses({ userId, onSelect }: { userId: string; onSelect: (a: Address) => void }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && userId) {
      fetch(`/api/addresses?userId=${userId}`)
        .then((r) => r.json())
        .then((d) => setAddresses(d.addresses ?? []));
    }
  }, [open, userId]);

  if (addresses.length === 0) return null;

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 transition-colors mb-3"
      >
        <MapPin className="w-4 h-4" /> {open ? "Hide" : "Use"} Saved Address
      </button>
      {open && (
        <div className="space-y-2">
          {addresses.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => { onSelect(a); setOpen(false); }}
              className="w-full text-left rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition-colors"
            >
              <p className="text-white text-sm font-medium">{a.full_name}</p>
              <p className="text-gray-400 text-xs">{a.line1}{a.line2 ? `, ${a.line2}` : ""}</p>
              <p className="text-gray-500 text-xs">{a.city}, {a.state} — {a.pincode}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
