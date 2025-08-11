"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

type Slide = { id: string; src: string }

export function Slider({ images = [] as Slide[], intervalMs = 4000 }: { images: Slide[]; intervalMs?: number }) {
  const items = images.length
    ? images
    : [
        { id: "1", src: "/slide-1-abstract-network.png" },
        { id: "2", src: "/slide-2-abstract.png" },
        { id: "3", src: "/slide-3-abstract.png" },
      ]
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), intervalMs)
    return () => clearInterval(t)
  }, [items.length, intervalMs])

  return (
    <div className="relative rounded-lg overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={items[idx].src || "/placeholder.svg"}
        alt={"slide " + (idx + 1)}
        className="w-full h-56 sm:h-80 md:h-[420px] object-cover"
      />
      <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2">
        {items.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIdx(i)}
            className={cn("h-2 w-2 rounded-full bg-white/60", i === idx ? "w-6 bg-white" : "")}
            aria-label={"Go to slide " + (i + 1)}
          />
        ))}
      </div>
    </div>
  )
}
