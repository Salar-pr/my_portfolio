"use client";

import Image, { StaticImageData } from "next/image";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { AuroraText } from "@/components/magicui/aurora-text";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { useState, useEffect } from "react";
import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";
import { AnimatedList } from "@/components/magicui/animated-list";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { MorphingText } from "@/components/magicui/morphing-text";
import { HyperText } from "@/components/magicui/hyper-text";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { ResumeCard } from "@/components/resume-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { DATA } from "@/data/resume";
import Link from "next/link";
import Markdown from "react-markdown";
import { SplineSceneBasic } from "@/components/ui/spline-scene-basic";
import { motion } from "framer-motion";


const BLUR_FADE_DELAY = 0.04;

interface ProjectCardProps {
  delay: number;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  linkText?: string;
  imageUrls: StaticImageData[];
  fullDescription?: string;
}

function ProjectCard({ delay, title, description, tags, link, linkText, imageUrls, fullDescription }: ProjectCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [drawerLoading, setDrawerLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    const drawerTimer = setTimeout(() => {
      if (imageUrls.length === 0) {
        setDrawerLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(drawerTimer);
    };
  }, [imageUrls.length]);

  const [loadedImagesCount, setLoadedImagesCount] = useState(0);
  useEffect(() => {
    if (imageUrls.length > 0 && loadedImagesCount === imageUrls.length) {
      setDrawerLoading(false);
    }
  }, [loadedImagesCount, imageUrls.length]);

  const handleImageLoad = () => {
    setLoadedImagesCount((prevCount) => prevCount + 1);
  };

  return (
    <BlurFade delay={delay}>
      <Drawer
        onOpenChange={(open) => {
          if (open) {
            setDrawerLoading(true);
            setLoadedImagesCount(0);
          }
        }}
      >
        <DrawerTrigger className="text-left w-full">
          <div className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow h-full flex flex-col group">
            {isLoading ? (
              <div className="space-y-2 flex-grow">
                <Skeleton className="h-[125px] w-full rounded-lg mb-3" />
                <Skeleton className="h-[20px] w-[200px] rounded-full" />
                <Skeleton className="h-[15px] w-[150px] rounded-full" />
                <div className="flex flex-wrap gap-1 mt-2">
                  {tags.map((_, index) => (
                    <Skeleton key={index} className="h-[20px] w-[60px] rounded-full" />
                  ))}
                </div>
              </div>
            ) : (
              <>
                {imageUrls[0] && (
                  <div className="relative w-full h-[125px] mb-3 overflow-hidden rounded-lg">
                    <Image
                      src={imageUrls[0]}
                      alt={`${title} preview`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <h3 className="font-semibold text-lg"><AuroraText>{title}</AuroraText></h3>
                <p className="text-sm text-muted-foreground flex-grow line-clamp-3">{description}</p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} className="px-2 py-1 text-[10px]">{tag}</Badge>
                  ))}
                </div>
              </>
            )}
          </div>
        </DrawerTrigger>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle><AuroraText>{title}</AuroraText></DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 overflow-y-auto">
            {imageUrls.length > 0 ? (
              <>
                {drawerLoading && (
                  <div className="space-y-4">
                    {imageUrls.map((_, index) => (
                      <Skeleton key={index} className="h-48 w-full rounded-lg" />
                    ))}
                  </div>
                )}
                <div className={`flex flex-col gap-4 ${drawerLoading ? "hidden" : "block"}`}>
                  {imageUrls.map((imageUrl, index) => (
                    <div key={index} className="w-full relative aspect-[4/3] max-h-[400px]">
                      <Image
                        src={imageUrl}
                        alt={`${title} image ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                        className="rounded-lg object-contain"
                        onLoad={handleImageLoad}
                        onError={() => {
                          console.error(`Error loading image: ${imageUrl}`);
                          handleImageLoad();
                        }}
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="prose max-w-full text-pretty font-sans text-sm sm:text-base text-muted-foreground dark:prose-invert">
                <Markdown>{fullDescription || description}</Markdown>
              </div>
            )}
          </div>
          <DrawerFooter>
            {link && (
              <Button asChild>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  {linkText || "View Project"}
                </a>
              </Button>
            )}
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </BlurFade>
  );
}

export default function Page() {
  return (
    <main className="flex flex-col min-h-[100dvh] space-y-16 px-4 md:px-8 lg:px-12 py-8 max-w-7xl mx-auto">
      {/* Hero Section with 3D Spline */}
      <section id="hero" className="w-full">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <SplineSceneBasic />
        </BlurFade>
      </section>

      {/* About Section */}
      <section id="about" className="w-full max-w-3xl mx-auto">
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <SparklesText className="text-2xl sm:text-3xl font-semibold mb-4"><AuroraText>About</AuroraText></SparklesText>
        </BlurFade>
        
           
        <BlurFade delay={BLUR_FADE_DELAY * 5}>
          <Markdown className="prose max-w-full text-pretty font-sans text-sm sm:text-base text-muted-foreground dark:prose-invert">
            {DATA.summary}
          </Markdown>
        </BlurFade>
      </section>

      {/* Work Experience Section */}
      <section id="work" className="w-full max-w-3xl mx-auto">
        <div className="flex min-h-0 flex-col gap-y-4">
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <SparklesText className="text-2xl sm:text-3xl font-semibold mb-4"><AuroraText>Work Experience</AuroraText></SparklesText>
          </BlurFade>
          {DATA.work.map((work, id) => (
            <BlurFade key={work.company} delay={BLUR_FADE_DELAY * 6 + id * 0.05}>
              <ResumeCard
                logoUrl={work.logoUrl}
                altText={work.company}
                title={work.company}
                subtitle={work.title}
                href={work.href ?? undefined}
                badges={work.badges}
                period={`${work.start} - ${work.end ?? "Present"}`}
                description={work.description}
              />
            </BlurFade>
          ))}
        </div>

        {/* Skills Section - Simplified (no levels) */}
        <div id="skills" className="mt-8 flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h2 className="text-xl font-bold"><AuroraText>Skills</AuroraText></h2>
          </BlurFade>
          <div className="flex flex-wrap gap-2">
            {DATA.skills.map((skill, id) => (
              <BlurFade key={skill} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                <Badge 
                  key={skill} 
                  className="px-4 py-1.5 text-sm transition-all hover:scale-105 hover:bg-primary hover:text-primary-foreground cursor-default"
                >
                  {skill}
                </Badge>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="w-full">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center space-y-12 py-12 px-4 sm:px-6">
          <BlurFade delay={BLUR_FADE_DELAY * 11}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                  <AuroraText>My Projects</AuroraText>
                </div>
                <SparklesText className="text-2xl sm:text-3xl"><AuroraText>Check out my latest work</AuroraText></SparklesText>
              </div>
            </div>
          </BlurFade>
          <div className="grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 auto-rows-fr justify-items-center">
            <ProjectCard
              delay={BLUR_FADE_DELAY * 12}
              title="Bot Maker"
              description="BotMaker is a powerful platform that lets you design and launch Telegram bots with zero coding knowledge. Whether you need a bot for business, automation, or fun – BotMaker makes it as simple as drag, drop, and deploy."
              tags={[ "Python","OOP","Linux" ]}
              link="https://github.com/Salar-pr/BotMaker-"
              linkText="View Project"
              imageUrls={[]}
              fullDescription={`
**Period**: January 2024 - April 2024

The <AuroraText>BotMaker</AuroraText> a powerful platform that lets you design and launch Telegram bots with zero coding knowledge. Whether you need a bot for business, automation, or fun – BotMaker makes it as simple as drag, drop, and deploy.

**Key Features of the Project**:
-📦 No-Code Bot Creation – Build bots with a simple interface
-⚡ Instant Deployment – Go live on Telegram in seconds
-🎨 Customizable – Add buttons, menus, and responses easily
-🛠️ Multi-Function Support – From auto-replies to advanced workflows
-🌍 Cross-Platform – Works anywhere, anytime
              `}
            />
            <ProjectCard
              delay={BLUR_FADE_DELAY * 12.05}
              title="hash_project"
              description="A modern Persian web platform built with Django, Django REST Framework, Next.js, and JWT authentication. It features custom scrypt+pepper+HMAC security, admin approval workflows, and a responsive RTL dashboard."
              tags={["Django", "Next.js", "Python", "JWT", "RTL"]}
              link="https://github.com/Salar-pr/hash_project-main"
              linkText="View Repository"
              imageUrls={[]}
              fullDescription={`
**Period**: September 2023 - November 2023

this is a full-stack web platform built with Django + Django REST Framework on the backend and Next.js + React on the frontend. It preserves a custom security model using original scrypt + pepper + salt + HMAC hashing.

**Key Features**:
- **Secure Authentication** 🔒: JWT access/refresh tokens + DRF TokenAuthentication
- **Custom Password Security** 🛡️: Original scrypt + pepper + salt + HMAC-SHA256 verification
- **Approval Workflow** ✅: Users require admin approval before accessing the system
- **Employee Dashboard** 📋: Attendance, schedules, tasks, weekly reports, and calendar events
- **Admin Panel** ⚙️: Separate business admin area for user approval, attendance, schedule, task, and event management
- **Persian RTL UX** 🌙: Responsive RTL interface designed for modern web and mobile devices

The project demonstrates a clean separation between backend REST APIs and a premium Next.js frontend while preserving original security logic from the source application.
              `}
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact">
        <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 16}>
            <div className="space-y-3">
              <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                <AuroraText>Contact</AuroraText>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                <AuroraText>Get in Touch</AuroraText>
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed flex flex-wrap justify-center items-center gap-6">
                <a
                  href="mailto:salar_pr@outlook.com"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  Contact via Gmail 📧
                </a>
                <a
                  href="https://t.me/salarrii"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  Telegram: @salarrii 💬
                </a>
                <a
                  href="tel:+989027142836"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
                >
                  Call: 09027142836 📞
                </a>
                <a
                  href="https://www.linkedin.com/in/salar-rez"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
                >
                  LinkedIn : Salar Rezaie 🖇
                </a>
                <a
                  href="https://github.com/Salar-pr"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-gray-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
                >
                  GitHub : Salar_pr 💻
                </a>
              </p>
            </div>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}
