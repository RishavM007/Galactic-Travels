export default function HelmetFrame() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <div className="
        w-[90%] h-[85%]
        rounded-[40px]
        border border-cyan-400/40
        shadow-[0_0_40px_rgba(0,255,255,0.4)]
        backdrop-blur-md
      " />
    </div>
  );
}