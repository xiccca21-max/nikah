"use client";

import type { FormEvent, ReactNode } from "react";
import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Lenis from "lenis";

const ceremony = {
  date: "08.08.2026",
  time: "10:30",
  venue: "Орловский дворец",
  address: "Набережные Челны, Орловская улица, 209"
};

const timeline = [
  {
    time: "10:30",
    title: "Сбор гостей",
    text: "Рады будем встретить вас в Орловском дворце.",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    )
  },
  {
    time: "11:00",
    title: "Начало церемонии",
    text: "Торжественная часть никаха, тёплые слова и семейные фотографии.",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <circle cx="12" cy="13" r="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    time: "15:30",
    title: "Завершение никаха",
    text: "Небольшая пауза перед вечерней частью праздника.",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    time: "18:00",
    title: "Вечерний отдых на базе",
    text: "Продолжение вечера на базе отдыха. Свободный внешний вид, чтобы можно было расслабиться и не париться.",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 15.631a9 9 0 11-12.261-12.26 9.001 9.001 0 0012.26 12.261z" />
      </svg>
    )
  }
];

const menuCourses = {
  course1: ["Салат с ростбифом", "Цезарь с креветками"],
  course2: ["Домашняя лапша", "Уха"],
  course3: ["Стейк из лосося", "Стейк из говядины"]
};

const guestList = [
  "Выберите свое имя",
  "Алина и Руслан",
  "Тимур",
  "Эльвира",
  "Марат и Гульназ",
  "Камилла"
];

const dressItems = [
  "Классический закрытый образ",
  "Платки для девушек",
  "Тюбетейки для мужчин",
  "Допустимы любые оттенки"
];

const ease = "easeInOut";

const textReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const cardReveal = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 }
};

const vibrate = () => {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(50);
  }
};

function Unroll({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
      whileInView={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function InteractiveRings() {
  const { scrollYProgress } = useScroll();
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -180]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
      className="mx-auto mt-10 mb-2 relative flex h-24 w-24 items-center justify-center"
    >
      <motion.div 
        style={{ rotate: rotate1 }} 
        className="absolute w-16 h-16 rounded-full border-[1.5px] border-champagne/60 -ml-6"
      >
        <motion.div 
          className="absolute inset-0 rounded-full border-t-[1.5px] border-champagne opacity-80"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
      <motion.div 
        style={{ rotate: rotate2 }} 
        className="absolute w-16 h-16 rounded-full border-[1.5px] border-champagne/60 ml-6"
      >
        <motion.div 
          className="absolute inset-0 rounded-full border-t-[1.5px] border-champagne opacity-80"
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </motion.div>
  );
}

function Preloader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-ivory rounded-b-[2rem] md:rounded-b-[4rem]"
      initial={{ y: 0 }}
      animate={{ y: "-100%" }}
      transition={{ duration: 1.2, delay: 2.2, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={onComplete}
    >
      <svg width="400" height="200" viewBox="-50 -25 400 200" className="text-champagne drop-shadow-sm overflow-visible">
        <motion.text
          x="150"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          style={{ fontFamily: "var(--font-script)" }}
          className="text-[4.5rem]"
          initial={{ strokeDasharray: 3000, strokeDashoffset: 3000 }}
          animate={{ strokeDashoffset: 0, fill: "var(--champagne)" }}
          transition={{
            strokeDashoffset: { duration: 2.2, ease: "easeInOut" },
            fill: { duration: 0.8, delay: 1.5, ease: "easeIn" }
          }}
        >
          Д & И
        </motion.text>
      </svg>
    </motion.div>
  );
}

function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date("2026-08-08T10:30:00").getTime();
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center gap-2 md:gap-4 mt-8 px-2 max-w-sm mx-auto">
      {Object.entries(timeLeft).map(([unit, value], idx, arr) => (
        <React.Fragment key={unit}>
          <div className="flex flex-col items-center">
            <span className="number-value text-3xl md:text-4xl text-champagne min-w-[2.5rem] text-center">
              {value.toString().padStart(2, '0')}
            </span>
            <span className="text-[0.55rem] uppercase tracking-widest text-espresso/50 mt-2 font-bold">
              {unit === 'days' ? 'Дней' : unit === 'hours' ? 'Часов' : unit === 'minutes' ? 'Минут' : 'Секунд'}
            </span>
          </div>
          {idx < arr.length - 1 && (
            <motion.div 
              animate={{ opacity: [1, 0.3, 1] }} 
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-2xl md:text-3xl text-champagne/60 pb-5"
            >
              :
            </motion.div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.75;
    }
  }, []);

  const togglePlay = () => {
    vibrate();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.error("Audio play failed:", err);
            setIsPlaying(false);
          });
      }
    }
  };

  return (
    <div className="audio-btn glass-pill shadow-xl cursor-pointer" onClick={togglePlay}>
      {!isPlaying && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-champagne/40 opacity-75"></span>
      )}
      <button className="w-full h-full flex items-center justify-center rounded-full text-champagne relative z-10">
        {isPlaying ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
            <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="-ml-0.5">
            <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="6" cy="18" r="3" fill="currentColor"/>
            <circle cx="18" cy="16" r="3" fill="currentColor"/>
          </svg>
        )}
      </button>
      <audio ref={audioRef} loop src="/music.mp3" preload="auto" />
    </div>
  );
}

function MagicDust() {
  const [particles, setParticles] = useState<Array<{left: string, duration: string, delay: string, opacity: number}>>([]);

  useEffect(() => {
    // Generate particles slightly after mount to avoid sync setState warnings
    const timeout = setTimeout(() => {
      const generated = Array.from({ length: 35 }).map(() => ({
        left: `${Math.random() * 100}%`,
        duration: `${10 + Math.random() * 20}s`,
        delay: `-${Math.random() * 20}s`,
        opacity: Math.random() * 0.5 + 0.2
      }));
      setParticles(generated);
    }, 50);
    return () => clearTimeout(timeout);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="magic-dust">
      {particles.map((p, i) => (
        <div 
          key={i} 
          className="dust-particle" 
          style={{
            left: p.left,
            animationDuration: p.duration,
            animationDelay: p.delay,
            opacity: p.opacity
          }} 
        />
      ))}
    </div>
  );
}

function Marquee() {
  const text = "ДАНИС & ИНЕССА • 08.08.2026 • NIKAH CEREMONY • ";
  const fullText = text.repeat(10);
  return (
    <div className="marquee-container my-16">
      <div className="marquee-content">
        <span className="marquee-text">{fullText}</span>
        <span className="marquee-text">{fullText}</span>
      </div>
    </div>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={false}
      whileInView="visible"
      viewport={{ once: true, margin: "-12% 0px" }}
      variants={textReveal}
      transition={{ duration: 1, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function DecorativeDivider({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`flex w-full items-center justify-center ${className}`}
    >
      <motion.div
        variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
        transition={{ duration: 1.2, ease: "easeInOut", delay }}
        className="h-[1px] w-16 bg-gradient-to-r from-transparent to-champagne/60 origin-right"
      />
      <motion.div
        variants={{ hidden: { scale: 0, rotate: 0 }, visible: { scale: 1, rotate: 45 } }}
        transition={{ duration: 0.8, ease: "easeOut", delay: delay + 0.4 }}
        className="mx-3 h-2 w-2 border border-champagne/60"
      />
      <motion.div
        variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
        transition={{ duration: 1.2, ease: "easeInOut", delay }}
        className="h-[1px] w-16 bg-gradient-to-l from-transparent to-champagne/60 origin-left"
      />
    </motion.div>
  );
}

function FloatingText({ text, offset = 100, className = "" }: { text: string; offset?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center z-0 ${className}`}>
      <motion.div style={{ y }} className="text-[18rem] md:text-[30rem] font-display text-champagne/[0.04] whitespace-nowrap select-none">
        {text}
      </motion.div>
    </div>
  );
}

function Section({
  eyebrow,
  children,
  className = ""
}: {
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`relative z-10 px-5 py-16 md:px-8 md:py-24 ${className}`}>
      <div className="mx-auto w-full max-w-[31rem] md:max-w-5xl">
        {eyebrow ? (
          <div className="mb-10 flex flex-col items-center">
            <Reveal>
              <p className="section-label text-center shimmer-gold">
                {eyebrow}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-4 flex items-center justify-center shimmer-gold">
                <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-champagne/50" />
                <div className="mx-2 h-1.5 w-1.5 rotate-45 bg-champagne/50" />
                <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-champagne/50" />
              </div>
            </Reveal>
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}

function MagneticButton({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.15, y: middleY * 0.15 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

function Card({
  children,
  className = "",
  delay = 0
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={false}
      whileInView="visible"
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={cardReveal}
      transition={{ duration: 1, ease, delay }}
      className={`premium-card ${className}`}
    >
      {children}
    </motion.div>
  );
}

function SilkImage({
  className = "",
  src,
  alt = "",
  uncropped = false
}: {
  className?: string;
  src?: string;
  alt?: string;
  uncropped?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  if (uncropped) {
    return (
      <div className="relative w-full">
        <motion.div
          initial={false}
          whileInView="visible"
          viewport={{ once: true, margin: "-12% 0px" }}
          variants={cardReveal}
          transition={{ duration: 1.1, ease }}
          className={`w-full overflow-hidden rounded-[1.65rem] shadow-luxury relative z-10 bg-white hairline-border ${className}`}
        >
          <Image
            src={src!}
            alt={alt}
            width={1000}
            height={1500}
            className="w-full h-auto object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.div
        ref={ref}
        initial={false}
        whileInView="visible"
        viewport={{ once: true, margin: "-12% 0px" }}
        variants={cardReveal}
        transition={{ duration: 1.1, ease }}
        className={`image-frame relative overflow-hidden z-10 ${className}`}
      >
      <div className="silk-image hairline-border relative h-full w-full overflow-hidden rounded-[1.65rem]">
        {src ? (
          <motion.div style={{ y, height: "124%", top: "-12%" }} className="absolute w-full">
            <motion.div
              initial={{ scale: 1 }}
              whileInView={{ scale: 1.06 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease }}
              className="relative h-full w-full"
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </motion.div>
          </motion.div>
        ) : null}
      </div>
    </motion.div>
    </div>
  );
}

function GlassPeekImage({
  src,
  alt = ""
}: {
  src: string;
  alt?: string;
}) {
  return (
    <motion.div
      initial={false}
      whileInView="visible"
      viewport={{ once: true, margin: "-12% 0px" }}
      variants={cardReveal}
      transition={{ duration: 1.1, ease }}
      className="hairline-border relative mx-auto w-full max-w-sm overflow-hidden rounded-[8rem] border border-champagne/30 shadow-luxury md:max-w-md aspect-[3/4]"
    >
      <div className="absolute inset-0 z-10 rounded-[8rem] shadow-[inset_0_0_40px_rgba(31,24,20,0.2)] pointer-events-none" />
      <div className="absolute inset-0 z-10 rounded-[8rem] border border-white/40 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 w-full">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
    </motion.div>
  );
}

function Watermark() {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[1] flex items-center justify-center overflow-hidden opacity-[0.02]">
        <span style={{ fontFamily: "var(--font-script)" }} className="text-[60vw] whitespace-nowrap text-espresso select-none">
          Д & И
        </span>
      </div>
      <div className="fixed inset-0 pointer-events-none z-[1] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTQwIDBDNjAgMCA4MCAyMCA4MCA0MEM4MCA2MCA2MCA4MCA0MCA4MEMyMCA4MCAwIDYwIDAgNDBDMCAyMCAyMCAwIDQwIDBaTTQwIDhDMjIuNCA4IDggMjIuNCA4IDQwQzggNTcuNiAyMi40IDcyIDQwIDcyQzU3LjYgNzIgNzIgNTcuNiA3MiA0MEM3MiAyMi40IDU3LjYgOCA0MCA4Wk00MCAxNkM1My4zIDE2 NjQgMjYuNyA2NCA0MEM2NCA1My4zIDUzLjMgNjQgNDAgNjRDMjYuNyA2NCAxNiA1My4zIDE2IDQwQzE2IDI2LjcgMjYuNyAxNiA0MCAxNlpNNDAgMjRDMzEuMiAyNCAyNCAzMS4yIDI0IDQwQzI0IDQ4LjggMzEuMiA1NiA0MCA1NkM0OC44 NTYgNTYgNDguOCA1NiA0MEM1NiAzMS4yIDQ4LjggMjQgNDAgMjRaIiBmaWxsPSIjYTk4NTRkIi8+PC9zdmc+')] bg-repeat opacity-[0.03]" />
    </>
  );
}

export default function Home() {
  const { scrollYProgress: pageProgress } = useScroll();
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState("");
  const [course1, setCourse1] = useState("");
  const [course2, setCourse2] = useState("");
  const [course3, setCourse3] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const scheduleRef = useRef<HTMLDivElement>(null);
  
  // Безопасный таймер для мобилок на случай, если прелоудер зависнет
  useEffect(() => {
    const timer = setTimeout(() => setIsPreloaderDone(true), 3500);
    return () => clearTimeout(timer);
  }, []);
  const { scrollYProgress: scheduleProgress } = useScroll({
    target: scheduleRef,
    offset: ["start center", "end center"]
  });

  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!isPreloaderDone || isRsvpOpen) {
      document.body.style.overflow = "hidden";
      lenisRef.current?.stop();
    } else {
      document.body.style.overflow = "";
      lenisRef.current?.start();
    }
  }, [isPreloaderDone, isRsvpOpen]);

  useEffect(() => {
    const isMobileDevice =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches);
    if (isMobileDevice) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => 0.5 - Math.cos(Math.PI * t) / 2,
      smoothWheel: true
    });
    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    const frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  const handleRSVPSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedGuest || selectedGuest === guestList[0] || !course1 || !course2 || !course3) return;
    
    setIsSubmitting(true);
    // Имитация отправки данных
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      vibrate();
    }, 1500);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-ivory font-sans text-espresso">
      {/* Reading Progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-champagne z-[100] origin-left pointer-events-none"
        style={{ scaleX: pageProgress }}
      />

      <AnimatePresence>
        {!isPreloaderDone && <Preloader onComplete={() => setIsPreloaderDone(true)} />}
      </AnimatePresence>

      <div className="passepartout-frame" />
      <div className="vignette-overlay" />
      <div className="editorial-grid" />
      <div className="botanical-shadow" />
      <Watermark />
      <MagicDust />
      <AudioPlayer />

      <div className="ambient-layer" />
      <div className="paper-grain" />

      <section className="relative z-10 flex min-h-screen items-center px-5 py-10 text-center">
        <div className="mx-auto w-full max-w-[31rem] md:max-w-4xl relative">
          
          <motion.div
            initial={false}
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.14 } } }}
            className="hero-card"
          >
            <motion.h1
              variants={textReveal}
              transition={{ duration: 1.1, ease }}
              className="hero-names shimmer-espresso"
            >
              <span className="hero-name shimmer-espresso">Данис</span>
              <span className="hero-amp shimmer-gold">&amp;</span>
              <span className="hero-name shimmer-espresso">Инесса</span>
            </motion.h1>

            <DecorativeDivider className="my-9" delay={0.3} />

            <motion.p
              variants={textReveal}
              transition={{ duration: 0.9, ease }}
              className="section-label mb-4 shimmer-gold mx-auto w-fit text-center"
            >
              Приглашение на никах
            </motion.p>

            <motion.p
              variants={textReveal}
              transition={{ duration: 1, ease }}
              className="mx-auto max-w-sm text-sm leading-8 text-espresso/64 md:text-base"
            >
              С радостью приглашаем вас разделить с нами благословенный день нашего никаха.
            </motion.p>

            <motion.div
              variants={cardReveal}
              transition={{ duration: 1, ease, delay: 0.1 }}
              className="glass-strip mt-10 grid gap-3 rounded-[2rem] p-4 md:grid-cols-3"
            >
              <div>
                <p className="detail-label">Дата</p>
                <p className="detail-value">{ceremony.date}</p>
              </div>
              <div>
                <p className="detail-label">Время</p>
                <p className="detail-value">{ceremony.time}</p>
              </div>
              <div>
                <p className="detail-label">Место</p>
                <p className="detail-value">{ceremony.venue}</p>
              </div>
            </motion.div>

            <motion.div
              variants={cardReveal}
              transition={{ duration: 1, ease, delay: 0.2 }}
              className="mt-8"
            >
              <Countdown />
            </motion.div>

            <DecorativeDivider className="mt-14 mb-4" delay={0.4} />

            <motion.div 
              variants={cardReveal} 
              transition={{ duration: 1, ease, delay: 0.5 }} 
              className="mt-8 flex flex-col items-center"
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTEwIDBDMTUgMCAyMCA1IDIwIDEwQzIwIDE1IDE1IDIwIDEwIDIwQzUgMjAgMCAxNSAwIDEwQzAgNSA1IDAgMTAgMFpNMTAgMkM1LjYgMiAyIDUuNiAyIDEwQzIgMTQuNCA1LjYgMTggMTAgMThDMTQuNCAxOCAxOCAxNC40IDE4IDEwQzE4IDUuNiAxNC40IDIgMTAgMlpNMTAgNEMxMy4zIDQgMTYgNi43IDE2IDEwQzE2IDEzLjMgMTMuMyAxNiAxMCAxNkM2LjcgMTYgNCAxMy4zIDQgMTBDNCA2LjcgNi43IDQgMTAgNFpNMTAgNkM3LjggNiA2IDcuOCA2IDEwQzYgMTIyLjIgNy44IDE0IDEwIDE0QzEyLjIgMTQgMTQgMTIuMiAxNCAxMEMxNCA3LjggMTIuMiA2IDEwIDZaIiBmaWxsPSIjYTk4NTRkIi8+PC9zdmc+')] pointer-events-none opacity-20" />
              <div className="font-display text-4xl md:text-5xl text-champagne opacity-80 mb-6" style={{ direction: "rtl" }}>
                ﷽
              </div>
              <p className="font-display text-[1.65rem] md:text-3xl italic text-champagne mb-3 shimmer-gold relative z-10">«Мы сотворили вас парами»</p>
              <p className="text-[0.6rem] tracking-[0.3em] font-bold text-espresso/50 uppercase relative z-10">Коран 78:8</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Section eyebrow="О дне" className="relative">
        <FloatingText text="08.08" offset={200} />
        <div className="feature-pair grid gap-6 md:grid-cols-2 md:items-center relative z-10">
          <SilkImage src="/couple-rsvp.png" alt="Danis and Inessa" className="feature-block" uncropped />
          <Card className="feature-block flex flex-col justify-center">
            <Reveal>
              <h2 className="feature-heading shimmer-espresso">День начинается с благословения.</h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="drop-cap mt-7 text-sm leading-8 text-espresso/64 md:text-base">
                Никах пройдёт в кругу семьи, родственников и друзей. Мы хотим, чтобы этот день был спокойным, красивым и наполненным уважением к традициям.
              </p>
            </Reveal>
          </Card>
        </div>
      </Section>

      <Section eyebrow="Геолокация">
        <div className="grid gap-12">
          {/* Орловский дворец */}
          <Card className="text-center">
            <Reveal>
                <div className="text-champagne font-bold text-sm tracking-widest uppercase mb-4">10:30</div>
                <h2 className="heading shimmer-espresso">{ceremony.venue}</h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-espresso/64 md:text-base">
                {ceremony.address}
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mt-8 overflow-hidden rounded-[1.2rem] border border-champagne/30 h-64 w-full relative opacity-90 transition-opacity hover:opacity-100">
                <iframe 
                  src="https://maps.google.com/maps?q=Набережные+Челны,+Орловская+улица,+209&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: 'grayscale(1) sepia(0.3) hue-rotate(5deg) contrast(0.8) opacity(0.8)' }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="pointer-events-none"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                  <div className="relative w-4 h-4 bg-champagne rounded-full shadow-[0_0_15px_rgba(169,133,77,0.8)]">
                    <span className="absolute inset-0 rounded-full bg-champagne animate-ping opacity-75"></span>
                    <div className="absolute -bottom-1 left-1/2 w-1 h-2 bg-champagne -translate-x-1/2 translate-y-full" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}></div>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.16}>
              <a
                className="btn-sweep mt-8 inline-flex rounded-full border border-champagne/35 bg-champagne px-7 py-4 text-[0.68rem] font-bold uppercase tracking-[0.26em] text-ivory transition duration-1000 ease-in-out hover:bg-espresso relative"
                href="https://www.google.com/maps/search/?api=1&query=%D0%9D%D0%B0%D0%B1%D0%B5%D1%80%D0%B5%D0%B6%D0%BD%D1%8B%D0%B5%20%D0%A7%D0%B5%D0%BB%D0%BD%D1%8B%2C%20%D0%9E%D1%80%D0%BB%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F%20209"
                target="_blank"
                rel="noreferrer"
              >
                <span className="relative z-10">Открыть в приложении</span>
              </a>
            </Reveal>
          </Card>

          {/* База отдыха Агдаш */}
          <Card className="text-center">
            <Reveal>
                <div className="text-champagne font-bold text-sm tracking-widest uppercase mb-4">18:00</div>
                <h2 className="heading shimmer-espresso">База отдыха «Агдаш»</h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-espresso/64 md:text-base">
                Набережные Челны, Боровецкий лес
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mt-8 overflow-hidden rounded-[1.2rem] border border-champagne/30 h-64 w-full relative opacity-90 transition-opacity hover:opacity-100">
                <iframe 
                  src="https://maps.google.com/maps?q=База+отдыха+Агдаш,+Набережные+Челны&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: 'grayscale(1) sepia(0.3) hue-rotate(5deg) contrast(0.8) opacity(0.8)' }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="pointer-events-none"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                  <div className="relative w-4 h-4 bg-champagne rounded-full shadow-[0_0_15px_rgba(169,133,77,0.8)]">
                    <span className="absolute inset-0 rounded-full bg-champagne animate-ping opacity-75"></span>
                    <div className="absolute -bottom-1 left-1/2 w-1 h-2 bg-champagne -translate-x-1/2 translate-y-full" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}></div>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.16}>
              <a
                className="btn-sweep mt-8 inline-flex rounded-full border border-champagne/35 bg-champagne px-7 py-4 text-[0.68rem] font-bold uppercase tracking-[0.26em] text-ivory transition duration-1000 ease-in-out hover:bg-espresso relative"
                href="https://www.google.com/maps/search/?api=1&query=%D0%91%D0%B0%D0%B7%D0%B0+%D0%BE%D1%82%D0%B4%D1%8B%D1%85%D0%B0+%D0%90%D0%B3%D0%B4%D0%B0%D1%88,+%D0%9D%D0%B0%D0%B1%D0%B5%D1%80%D0%B5%D0%B6%D0%BD%D1%8B%D0%B5+%D0%A7%D0%B5%D0%BB%D0%BD%D1%8B"
                target="_blank"
                rel="noreferrer"
              >
                <span className="relative z-10">Открыть в приложении</span>
              </a>
            </Reveal>
          </Card>
        </div>
      </Section>

      <Section eyebrow="Программа" className="relative">
        <FloatingText text="Д & И" offset={180} />
        <div className="relative z-10">
          <Reveal>
            <h2 className="heading text-center shimmer-espresso">Расписание дня</h2>
          </Reveal>
          <div className="mt-14 relative" ref={scheduleRef}>
            {/* Background thread */}
            <div className="absolute left-[1.35rem] top-4 bottom-4 w-px bg-champagne/20 md:left-[2.35rem]" />
            {/* Animated golden thread */}
            <motion.div 
              className="absolute left-[1.35rem] top-4 bottom-4 w-[2px] origin-top bg-gradient-to-b from-champagne to-champagne/40 md:left-[2.35rem]"
              style={{ scaleY: scheduleProgress }}
            />

            <div className="space-y-6">
              {timeline.map((item, index) => (
                <div key={item.time} className="relative pl-14 md:pl-24 group">
                  {/* Dot */}
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-20% 0px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="absolute left-[0.7rem] top-8 w-6 h-6 rounded-full bg-ivory border border-champagne shadow-[0_0_10px_rgba(169,133,77,0.5)] md:left-[1.7rem] flex items-center justify-center text-champagne z-10 transition-transform group-hover:scale-110" 
                  >
                    {item.icon}
                  </motion.div>
                  
                  <Card delay={index * 0.08} className="grid gap-4 p-6 md:p-8 transition-opacity duration-500 opacity-60 hover:opacity-100">
                    <div>
                      <p className="number-value text-3xl text-champagne shimmer-gold">{item.time}</p>
                    </div>
                    <div>
                      <h3 className="timeline-title shimmer-espresso">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-espresso/62">{item.text}</p>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section eyebrow="Дресс-код">
        <div className="max-w-2xl mx-auto">
          <Card>
            <Reveal>
              <h2 className="heading shimmer-espresso">Классика и уважение к традициям.</h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-7 text-sm leading-8 text-espresso/64 md:text-base">
                Просим выбрать закрытый, аккуратный и торжественный образ. Для девушек желательны платки, для мужчин — тюбетейки.
              </p>
            </Reveal>
            <div className="mt-8 grid gap-3">
              {dressItems.map((item, index) => (
                <motion.div
                  key={item}
                  initial={false}
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={cardReveal}
                  transition={{ duration: 0.9, ease, delay: index * 0.06 }}
                  className="glass-pill flex items-center gap-4 px-5 py-4"
                >
                  <span className="h-2 w-2 rounded-full bg-champagne" />
                  <span className="text-sm text-espresso/70">{item}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      <Section eyebrow="Пожелания">
        <Card className="text-center mx-auto max-w-2xl px-6 py-12 md:px-12 md:py-16">
          <Reveal>
            <h2 className="heading shimmer-espresso text-2xl md:text-3xl">О подарках</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-6 text-sm leading-8 text-espresso/64 md:text-base">
              Главный подарок для нас — это ваше присутствие и разделенная с нами радость. Пожалуйста, не утруждайте себя выбором цветов и подарков. Если вы желаете нас поздравить, мы будем искренне благодарны за ваш вклад в бюджет нашей молодой семьи.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="mt-8 flex justify-center text-champagne/80">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
          </Reveal>
        </Card>
      </Section>

      <Marquee />

      <Section eyebrow="Анкета гостя">
        <Card className="text-center mx-auto max-w-xl">
          <Reveal>
            <h2 className="heading shimmer-espresso">Присутствие</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-6 text-sm leading-8 text-espresso/62">
              Пожалуйста, подтвердите ваше присутствие и выберите предпочтения по меню, чтобы мы всё подготовили заранее.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <button 
              onClick={() => {
                vibrate();
                setIsRsvpOpen(true);
              }}
              className="btn-sweep rsvp-button mt-9 transition duration-500 ease-out hover:scale-105"
            >
              <span className="relative z-10">Подтвердить присутствие</span>
            </button>
          </Reveal>
        </Card>
      </Section>

      <section className="relative z-10 flex min-h-screen items-center px-5 py-20 text-center">
        <div className="mx-auto w-full max-w-[31rem] md:max-w-3xl">
          <Card>
            <Reveal>
              <p className="section-label mb-8 shimmer-gold">С любовью</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="hero-names mt-4 shimmer-espresso">
                <span className="hero-name shimmer-espresso">Данис</span>
                <span className="hero-amp shimmer-gold">&amp;</span>
                <span className="hero-name shimmer-espresso">Инесса</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mx-auto mt-9 max-w-lg text-sm leading-8 text-espresso/62 md:text-base">
                Будем счастливы видеть вас рядом в этот важный для нас день.
              </p>
            </Reveal>
            <DecorativeDivider className="my-9" delay={0.16} />
            <Reveal delay={0.2}>
              <p className="number-value mt-8 text-4xl text-champagne shimmer-gold">08.08.2026</p>
            </Reveal>
            <Reveal delay={0.3}>
              <InteractiveRings />
            </Reveal>
          </Card>
        </div>
      </section>

      <AnimatePresence>
        {isRsvpOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isSubmitting) {
                  vibrate();
                  setIsRsvpOpen(false);
                }
              }}
              className="fixed inset-0 z-40 bg-espresso/50 rsvp-backdrop"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 right-0 z-50 h-[100dvh] w-full max-w-md overflow-y-auto overscroll-contain touch-pan-y bg-ivory/95 px-6 py-12 shadow-2xl md:px-10"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <button 
                onClick={() => {
                  if (!isSubmitting) {
                    vibrate();
                    setIsRsvpOpen(false);
                  }
                }}
                disabled={isSubmitting}
                className="absolute right-6 top-6 rounded-full p-2 text-espresso/60 transition-colors hover:bg-champagne/10 hover:text-espresso disabled:opacity-50"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <form onSubmit={handleRSVPSubmit} className="mt-8 pb-16">
                {isSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-champagne/30 bg-champagne/10 text-champagne mb-6">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="heading mb-4 text-3xl">Спасибо!</h2>
                    <p className="text-sm leading-8 text-espresso/62">Ваш ответ успешно сохранен. Мы будем очень рады видеть вас на нашем празднике.</p>
                  </motion.div>
                ) : (
                  <>
                    <h2 className="heading mb-8 text-3xl shimmer-espresso">Ждем вас</h2>
                    
                    <div className="grid gap-6">
                      <label className="field-label">
                        Ваше имя
                        <p className="mt-2 mb-3 text-[0.6rem] normal-case tracking-normal text-espresso/40">Обязательно выберите свое имя из списка, чтобы мы ничего не перепутали.</p>
                        <div className="relative">
                          <select 
                            className="field-input appearance-none bg-transparent w-full"
                            value={selectedGuest}
                            onChange={(e) => setSelectedGuest(e.target.value)}
                            required
                          >
                            {guestList.map((guest, idx) => (
                              <option key={guest} value={guest} disabled={idx === 0} className="text-espresso bg-ivory">
                                {guest}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-espresso/40">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </div>
                      </label>
                    </div>

                    <div className="mt-10">
                      <p className="menu-title mb-4">Салат</p>
                      <div className="grid gap-3">
                        {menuCourses.course1.map((item) => (
                          <label key={item} className="menu-option relative overflow-hidden">
                            <input 
                              type="radio" 
                              name="course1" 
                              value={item}
                              checked={course1 === item}
                              onChange={(e) => setCourse1(e.target.value)}
                              className="peer sr-only" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-champagne/20 to-transparent opacity-0 peer-checked:opacity-100 transition-opacity duration-500" />
                            <span className="relative z-10 flex items-center gap-3">
                              <span className="flex-shrink-0 flex items-center justify-center w-4 h-4 rounded-full border border-champagne/50 peer-checked:border-champagne bg-white/50 shadow-inner transition-all duration-300">
                                <span className={`w-2 h-2 rounded-full bg-champagne shadow-[0_0_8px_rgba(169,133,77,0.8)] transition-transform duration-300 ${course1 === item ? 'scale-100' : 'scale-0'}`} />
                              </span>
                              {item}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8">
                      <p className="menu-title mb-4">Суп</p>
                      <div className="grid gap-3">
                        {menuCourses.course2.map((item) => (
                          <label key={item} className="menu-option relative overflow-hidden">
                            <input 
                              type="radio" 
                              name="course2" 
                              value={item}
                              checked={course2 === item}
                              onChange={(e) => setCourse2(e.target.value)}
                              className="peer sr-only" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-champagne/20 to-transparent opacity-0 peer-checked:opacity-100 transition-opacity duration-500" />
                            <span className="relative z-10 flex items-center gap-3">
                              <span className="flex-shrink-0 flex items-center justify-center w-4 h-4 rounded-full border border-champagne/50 peer-checked:border-champagne bg-white/50 shadow-inner transition-all duration-300">
                                <span className={`w-2 h-2 rounded-full bg-champagne shadow-[0_0_8px_rgba(169,133,77,0.8)] transition-transform duration-300 ${course2 === item ? 'scale-100' : 'scale-0'}`} />
                              </span>
                              {item}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8">
                      <p className="menu-title mb-4">Горячее</p>
                      <div className="grid gap-3">
                        {menuCourses.course3.map((item) => (
                          <label key={item} className="menu-option relative overflow-hidden">
                            <input 
                              type="radio" 
                              name="course3" 
                              value={item}
                              checked={course3 === item}
                              onChange={(e) => setCourse3(e.target.value)}
                              className="peer sr-only" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-champagne/20 to-transparent opacity-0 peer-checked:opacity-100 transition-opacity duration-500" />
                            <span className="relative z-10 flex items-center gap-3">
                              <span className="flex-shrink-0 flex items-center justify-center w-4 h-4 rounded-full border border-champagne/50 peer-checked:border-champagne bg-white/50 shadow-inner transition-all duration-300">
                                <span className={`w-2 h-2 rounded-full bg-champagne shadow-[0_0_8px_rgba(169,133,77,0.8)] transition-transform duration-300 ${course3 === item ? 'scale-100' : 'scale-0'}`} />
                              </span>
                              {item}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mt-10">
                      <button 
                        type="submit" 
                        disabled={isSubmitting || !selectedGuest || selectedGuest === guestList[0] || !course1 || !course2 || !course3}
                        className={`rsvp-button w-full flex items-center justify-center gap-3 transition-opacity ${(isSubmitting || !selectedGuest || selectedGuest === guestList[0] || !course1 || !course2 || !course3) ? 'opacity-50 cursor-not-allowed hover:transform-none' : ''}`}
                      >
                        {isSubmitting ? (
                          <svg className="animate-spin h-5 w-5 text-ivory" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          "Отправить"
                        )}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
