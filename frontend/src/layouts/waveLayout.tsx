import { Image } from "@heroui/react";
import Wave1 from "../assets/wave.svg";
import type { ReactNode } from "react";

export default function WaveLayout({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "flex flex-col bg-content1 lg:rounded-4xl lg:shadow-xl overflow-hidden " +
        (className ?? "")
      }
    >
      <Image
        src={Wave1}
        alt="wave"
        className="w-full  max-w-full"
        classNames={{
          wrapper: "!max-w-full hidden lg:block z-1 w-full",
          img: "max-w-full",
        }}
      />
      {children}
      <Image
        src={Wave1}
        alt="wave"
        className="w-full max-w-full"
        classNames={{
          wrapper:
            "!max-w-full bg-content1 rotate-180 hidden lg:block z-1 w-full",
          img: "max-w-full",
        }}
      />
    </div>
  );
}
