import type { ReactNode } from "react";

export default function HighlightedText({ children }: { children: ReactNode,className?:string; }) {
  return (
    <div className="relative w-fit overflow-visible">
      {children}
      <div className="absolute h-5/6 left-1/2 -translate-x-1/2 rounded-sm w-[calc(100%_+_12px)] px-6 bg-secondary/10 top-3 max-h-6"></div>
    </div>
  );
}
