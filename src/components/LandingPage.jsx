function LandingPage({ onEnter }) {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/20 blur-[120px]" />

      <div className="relative z-10 flex min-h-screen flex-col px-6 py-8 sm:px-8 sm:py-10">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-xs tracking-[0.3em] uppercase text-white/70">
              Powered by Chowly
            </p>
            <p className="text-xs tracking-[0.3em] uppercase text-amber-300">
              . Victoria Island
            </p>
          </div>
          <div className="rounded-full border border-amber-400/30 bg-white/5 px-3 py-1 backdrop-blur">
            <p className="text-xs text-amber-300">Table 07 Ready</p>
          </div>
        </div>

        <div className="mt-auto space-y-8 sm:space-y-10">
          <div className="max-w-lg">
            <h1 className="text-5xl font-light leading-none sm:text-6xl md:text-7xl">
              The Yellow
              <br />
              Chilli
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
              Your table is ready. Explore today's menu, place your order,
              and enjoy a seamless dining experience.
            </p>
          </div>

          <div className="space-y-5">
            <button
              onClick={onEnter}
              className="w-full rounded-full bg-amber-500 px-10 py-4 text-lg font-semibold text-black shadow-[0_0_40px_rgba(245,158,11,0.25)] transition-all duration-300 hover:scale-[1.02] hover:bg-amber-400 sm:w-auto"
            >
              Enter Restaurant
            </button>
            <p className="text-sm text-white/50">
              Tap to begin your table-side experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;