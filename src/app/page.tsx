"use client";

import Image, { StaticImageData } from "next/image";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { AnimatedCircularProgressBar } from "@/components/magicui/animated-circular-progress-bar";
import { AuroraText } from "@/components/magicui/aurora-text";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { useState, useEffect, useCallback } from "react";
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

// Image imports (these are StaticImageData objects)
import plastic1 from "./blog/plastic1.png";
import plastic2 from "./blog/plastic2.png";
import nvim1 from "./blog/nvim1.png";
import nvim2 from "./blog/nvim2.png";
import python1 from "./blog/python_tel_bot1.png";
import python2 from "./blog/python_tel_bot2.png";
import python3 from "./blog/python_tel_bot3.png";
import python4 from "./blog/python_tel_bot4.png";
import eco1 from "./blog/eco1.png";
import eco2 from "./blog/eco2.png";
import eco3 from "./blog/eco3.png";
import eco4 from "./blog/eco4.png";
import eco5 from "./blog/eco5.png";
import eco6 from "./blog/eco6.png";
import ifi_web from "./blog/more.png";

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
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow h-full flex flex-col">
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
                  <div className="relative w-full h-[125px] mb-3">
                    <Image
                      src={imageUrls[0]}
                      alt={`${title} preview`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
                <h3 className="font-semibold"><AuroraText>{title}</AuroraText></h3>
                <p className="text-sm text-muted-foreground flex-grow">{description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {tags.map((tag, index) => (
                    <Badge key={index}>{tag}</Badge>
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
    <main className="flex flex-col min-h-[100dvh] space-y-10 px-4 md:px-8 lg:px-12 py-8">
      {/* Hero Section */}
      <section id="hero" className="w-full">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="gap-2 flex justify-between items-start">
            <div className="flex-col flex flex-1 space-y-1.5">
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                yOffset={8}
                text={`Hi, I'm ${DATA.name.split(" ")[0]} 👋`}
              />
              <BlurFadeText
                className="max-w-[600px] md:text-xl"
                delay={BLUR_FADE_DELAY}
                text={DATA.description}
              />
            </div>
            <BlurFade delay={BLUR_FADE_DELAY}>
              <Avatar className="size-24 sm:size-28 border">
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="w-full max-w-3xl mx-auto">
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <SparklesText className="text-2xl sm:text-3xl font-semibold mb-4"><AuroraText>About</AuroraText></SparklesText>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
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
      </section>

      {/* Skills Section */}
      <section id="skills">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h2 className="text-xl font-bold"><AuroraText>Skills</AuroraText></h2>
          </BlurFade>
          <div className="flex flex-wrap gap-1">
            {DATA.skills.map((skill, id) => (
              <BlurFade key={skill} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                <Badge key={skill}>{skill}</Badge>
              </BlurFade>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 sm:grid-cols-3">
            <BlurFade delay={BLUR_FADE_DELAY * 10}>
              <div className="flex flex-col items-center">
                <AnimatedCircularProgressBar
                  min={0} // Added min prop
                  max={100}
                  value={80}
                  gaugePrimaryColor="rgb(79, 70, 229)"
                  gaugeSecondaryColor="rgba(79, 70, 229, 0.2)"
                />
                <p className="mt-2 text-sm font-medium">Python Programming</p>
              </div>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 10.1}>
              <div className="flex flex-col items-center">
                <AnimatedCircularProgressBar
                  min={0} // Added min prop
                  max={100}
                  value={100}
                  gaugePrimaryColor="rgb(79, 70, 229)"
                  gaugeSecondaryColor="rgba(79, 70, 229, 0.2)"
                />
                <p className="mt-2 text-sm font-medium">Django Web Framework</p>
              </div>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 10.2}>
              <div className="flex flex-col items-center">
                <AnimatedCircularProgressBar
                  min={0} // Added min prop
                  max={100}
                  value={80}
                  gaugePrimaryColor="rgb(79, 70, 229)"
                  gaugeSecondaryColor="rgba(79, 70, 229, 0.2)"
                />
                <p className="mt-2 text-sm font-medium">Django REST Framework</p>
              </div>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 10.3}>
              <div className="flex flex-col items-center">
                <AnimatedCircularProgressBar
                  min={0} // Added min prop
                  max={100}
                  value={65}
                  gaugePrimaryColor="rgb(79, 70, 229)"
                  gaugeSecondaryColor="rgba(79, 70, 229, 0.2)"
                />
                <p className="mt-2 text-sm font-medium">SQL Database</p>
              </div>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 10.4}>
              <div className="flex flex-col items-center">
                <AnimatedCircularProgressBar
                  min={0} // Added min prop
                  max={100}
                  value={85}
                  gaugePrimaryColor="rgb(79, 70, 229)"
                  gaugeSecondaryColor="rgba(79, 70, 229, 0.2)"
                />
                <p className="mt-2 text-sm font-medium">Web API</p>
              </div>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 10.5}>
              <div className="flex flex-col items-center">
                <AnimatedCircularProgressBar
                  min={0} // Added min prop
                  max={100}
                  value={100}
                  gaugePrimaryColor="rgb(79, 70, 229)"
                  gaugeSecondaryColor="rgba(79, 70, 229, 0.2)"
                />
                <p className="mt-2 text-sm font-medium">Web</p>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="w-full">
        <div className="space-y-12 w-full py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 11}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                  <AuroraText>My Projects</AuroraText>
                </div>
                <SparklesText className="text-2xl sm:text-3xl"><AuroraText>Check out my latest work</AuroraText></SparklesText>
              </div>
            </div>
          </BlurFade>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
            <ProjectCard
              delay={BLUR_FADE_DELAY * 12}
              title="یوتوب"
              description="A scalable video platform inspired by YouTube, built with Django and DRF, featuring video uploads, advanced search, user authentication, and a RESTful API. 📹🌐"
              tags={["Django", "DRF", "Python", "REST API"]}
              link="https://youtube-three-pearl.vercel.app"
              linkText="View Project"
              imageUrls={[]} // You can add images like [plastic1, plastic2] if desired
              fullDescription={`
**Period**: January 2024 - April 2024

The <AuroraText>YouTube</AuroraText> project is a video platform developed using Django Rest Framework (DRF) and Django. Inspired by YouTube, it implements its core features. The goal is to create an online video management system with modern, scalable, and optimized features.

**Key Features of the Project**:
- **Video Upload and Management** 📹: Upload, categorize, and manage videos with support for various formats.
- **Authentication and User Management** 🔒: Registration, login, user profile management, and access level control.
- **Advanced Search and Filtering** 🔍: Search and filter videos by title, category, and publication date.
- **Like, Dislike, and Comments System** 💬: User interaction with videos through likes, dislikes, and comments.
- **Video Playback with Multiple Qualities** 🎥: Support for multiple playback qualities for a better user experience.
- **DRF-Based API** 🌐: Provides a RESTful API for front-end and back-end communication.
- **Optimization and Security** 🛡️: Uses JWT Authentication for session management, access control, and video protection.

**Technologies Used**:
- **Backend**: Django, Django Rest Framework (DRF), Celery, Redis
- **Frontend**: React or Vue.js (if needed)
- **Database**: PostgreSQL, MySQL
- **Deployment**: Docker, Nginx, Gunicorn
              `}
            />
            <ProjectCard
              delay={BLUR_FADE_DELAY * 12.05}
              title="مارکت شاپ"
              description="A professional e-commerce platform built with Django and Python, featuring a scalable architecture, advanced authentication, fast search, and a modern responsive design. 🛒✨"
              tags={["Django", "Python", "Jalali Date", "E-commerce"]}
              link="#"
              linkText="View Details"
              imageUrls={[]} // You can add images like [eco1, eco2, eco3] if desired
              fullDescription={`
**Period**: September 2023 - November 2023

This project was designed and implemented using Django as the main framework and Python as the programming language. 🐍

**Key Features of the Project**:
- **Scalable and Optimized Architecture** 🚀: Built for performance and growth.
- **Advanced Authentication System** 🔒: Secure user login and access control.
- **Fast Search and Data Filtering** 🔍: Quick and efficient product search.
- **Modern and Responsive Design** 📱: Enhanced user experience across devices.
- **Jalali Date Support** 📅: Tailored for regional user needs.

Despite the extensive scope of the project, including:
- **Product Categorization and Upload** 🛍️: Easy product management.
- **Account Management and Registration** 👤: Seamless user onboarding.
- **Fast Search and Navigation** ⚡: Quick access to products.
- **Advanced Security and Access Management** 🛡️: Robust protection mechanisms.
- And many other features 🌟

All were developed in the best way using Django and various Python libraries to create a professional e-commerce website.
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
              </p>
            </div>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}
