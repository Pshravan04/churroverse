import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full bg-orange-600/5 blur-[120px]" />
      </div>
      <div className="relative z-10 text-center max-w-md">
        <div className="text-8xl mb-6">🌌</div>
        <h1 className="text-7xl font-black text-white mb-2 tracking-tighter">404</h1>
        <p className="text-xl font-bold text-orange-400 mb-3">Lost in Space</p>
        <p className="text-gray-500 mb-8 leading-relaxed">
          This cosmic coordinate doesn&apos;t exist. The churro you&apos;re looking for drifted into an uncharted nebula.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-full font-bold transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_35px_rgba(234,88,12,0.5)]"
        >
          ← Return to Base
        </Link>
      </div>
    </div>
  );
}
