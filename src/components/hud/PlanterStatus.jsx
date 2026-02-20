import { playClickSfx, playHoverSfx } from "../../utils/sfx";

export default function PlanetControls({ planets, active, setActive }) {
  return (
    <div className="absolute bottom-3 md:bottom-6 min-[2200px]:bottom-8 min-[2800px]:bottom-10 w-full flex justify-center px-2">
      <div className="w-full overflow-x-auto px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:w-auto md:overflow-visible md:px-0">
        <div className="mx-auto relative flex w-max min-w-full snap-x snap-mandatory items-center justify-start gap-2.5 px-1 md:max-w-[92%] min-[2200px]:max-w-[86%] min-[2800px]:max-w-[80%] md:min-w-0 md:w-auto md:flex-nowrap md:justify-center md:gap-5 min-[2200px]:gap-6 min-[2800px]:gap-7 md:px-7 min-[2200px]:px-9 min-[2800px]:px-11 md:py-3 min-[2200px]:py-4 min-[2800px]:py-5 md:rounded-[999px] md:snap-none">
          
          {planets.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                playClickSfx();
                setActive(p.id);
              }}
              onMouseEnter={playHoverSfx}
              className={`
                shrink-0 snap-center cursor-pointer
                px-3 py-1.5 text-[10px] md:px-5 md:text-xs md:py-2 min-[2200px]:px-7 min-[2200px]:py-3 min-[2200px]:text-sm min-[2800px]:px-8 min-[2800px]:py-3.5 min-[2800px]:text-base rounded-full
                border-2 border-cyan-400/50 bg-black
                md:border-cyan-300/20 md:bg-[#01040c]/90
                font-sora tracking-wider font-semibold
                transition-all duration-300
                hover:bg-cyan-400 hover:text-black
                ${active === p.id ? "bg-cyan-400 text-black md:bg-cyan-300" : "text-cyan-300 md:text-cyan-200"}
              `}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
