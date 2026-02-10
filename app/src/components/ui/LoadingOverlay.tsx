const DuckAndWave = () => (
  <div className="relative flex flex-col items-center flex-shrink-0 w-[400px]">
    {/* Duck (Bouncing) */}
    <div className="w-16 h-16 relative z-10 animate-bounce-gentle -mb-6">
      <img
        src="/duck.svg"
        alt="Loading Duck"
        className="w-full h-full object-contain"
      />
    </div>

    {/* Wave */}
    <svg
      className="w-[400px] h-12 text-black"
      viewBox="0 0 400 20"
      preserveAspectRatio="none"
    >
      <path
        d="M0 10 Q 25 20 50 10 T 100 10 T 150 10 T 200 10 T 250 10 T 300 10 T 350 10 T 400 10"
        fill="transparent"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  </div>
);

export const LoadingOverlay = () => {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center pointer-events-auto"
      role="status"
      aria-live="polite"
      aria-label="Loading..."
    >
      <div className="relative w-[200px] h-40 overflow-hidden flex items-center mb-4 border-b border-gray-200/0">
        <div className="flex animate-marquee">
          {/* Ensure container is wide enough for 2 items */}
          <DuckAndWave />
          <DuckAndWave />
        </div>
      </div>

      <div className="z-50">
        <p className="text-black font-mono text-md tracking-wider whitespace-nowrap">
          Loading 3D Modeling
        </p>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-400px);
          }
        }

        .animate-marquee {
          animation: marquee 4s linear infinite;
          width: 800px; /* Ensure container is wide enough for 2 items */
        }

        @keyframes bounce-gentle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
