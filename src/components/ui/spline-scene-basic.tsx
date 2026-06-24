'use client'

import Image from "next/image"
import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { DATA } from "@/data/resume";

export function SplineSceneBasic() {
  return (
    <Card className="w-full h-[400px] md:h-[550px] bg-black/[0.96] relative overflow-hidden rounded-2xl">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="flex flex-col md:flex-row h-full">
        {/* Left content */}
        <div className="flex-1 p-6 md:p-10 relative z-10 flex flex-col justify-center order-2 md:order-1">
        
            <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-primary/20 bg-muted">
              <Image
                src={`/${DATA.avatarUrl}`}
                alt={DATA.name}
                fill
                className="object-cover"
              />
            </div>
          
        
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 tracking-tighter">
            salar rezaie
          </h1>
          <p className="mt-4 text-neutral-300 text-sm md:text-base max-w-md">
            an energetic and adaptable software engineer and web developer
          </p>
          
        </div>
        
        {/* Right content - 3D Scene */}
        <div className="flex-1 relative h-[220px] md:h-full order-1 md:order-2">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  )
}
