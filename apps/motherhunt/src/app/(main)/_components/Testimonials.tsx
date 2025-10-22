"use client";

import { cn } from "@shared/ui/lib/utils";
import { QuoteIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface TestimonialsData {
  name: string;
  position: string;
  text: string;
  bgImagePath: string;
}

const TESTIMONIALS_DATA: TestimonialsData[] = [
  {
    name: "Yoshio Sano",
    position: "Leading casting director in Tokyo, Japan",
    text: "It's a game changer! I am so excited to see how industry will expand with such strong product.",
    bgImagePath: "/testimonials-0.png",
  },
  {
    name: "Kulele Zuma",
    position: "Street scouter in Durban, Africa",
    text: "My city is lacking opportunities so I'm happy to start scouting worldwide with Motherhunt.",
    bgImagePath: "/testimonials-1.png",
  },
  {
    name: "Agnes Dore",
    position: "Head booker of agency in Berlin, Germany",
    text: "We are happy to sign models of different ethnicities and create more diversity.",
    bgImagePath: "/testimonials-2.png",
  },
];

export const Testimonials = () => {
  const [isAppliedZoom, setIsAppliedZoom] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let zoomTimeoutId: NodeJS.Timeout | null = null;
    const intervalId = setInterval(() => {
      setActiveIndex((prev) =>
        prev < TESTIMONIALS_DATA.length - 1 ? prev + 1 : 0,
      );
      setIsAppliedZoom(true);
      zoomTimeoutId = setTimeout(() => {
        setIsAppliedZoom(false);
      }, 10);
    }, 5000);

    return () => {
      clearInterval(intervalId);
      if (zoomTimeoutId) clearTimeout(zoomTimeoutId);
    };
  }, []);

  return (
    <div className="self-stretch flex justify-center items-center mx-6">
      <div className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-clip">
        <Image
          src={`/testimonials-${activeIndex}.png`}
          alt="testimonial"
          width="0"
          height="0"
          sizes="100vh"
          className={cn("absolute h-full w-auto right-0 -rotate-15 top-1/12", {
            "scale-[500%]": isAppliedZoom,
            "scale-100 transition-transform duration-800 ease-out":
              !isAppliedZoom,
          })}
          priority
        />
        <div className="absolute items-center w-full h-full bg-gradient-to-br from-primary/70 via-teal-800/70 to-blue-800/70">
          <div
            className={cn(
              "w-full md:w-1/2 h-full flex justify-center items-center flex-col gap-2 px-2 md:px-6",
              {
                "-translate-x-full": isAppliedZoom,
                "-translate-x-0 transition-transform duration-400 ease-out":
                  !isAppliedZoom,
              },
            )}
          >
            <h4 className="text-4xl text-background/80">
              {TESTIMONIALS_DATA[activeIndex]?.name}
            </h4>
            <h6 className="text-sm text-background font-mono font-light text-center">
              {TESTIMONIALS_DATA[activeIndex]?.position}
            </h6>
            <span className="text-lg mt-4 text-secondary text-center">
              <QuoteIcon className="inline rotate-180 mr-1" />
              {TESTIMONIALS_DATA[activeIndex]?.text}
              <QuoteIcon className="inline ml-1" />
            </span>
          </div>
        </div>
        <div className="absolute bottom-4 md:bottom-6 w-full h-1">
          <div className="relative mx-4 md:mx-8 flex h-full rounded-full overflow-clip">
            <div
              className={cn("absolute bg-background/70 h-full w-full", {
                "-translate-x-full": isAppliedZoom,
                "-translate-x-0 transition-transform duration-[5000ms] ease-in-out":
                  !isAppliedZoom,
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
