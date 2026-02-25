"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import type { HeroBlock as HeroBlockType, SanityImage } from "@/types/sanity";

interface HeroBlockProps {
  block: HeroBlockType;
}

const SLIDE_INTERVAL = 5000;
const TRANSITION_DURATION = 700;

const HeroBlock = ({ block }: HeroBlockProps) => {
  // 하위 호환: backgroundImages 우선, 없으면 backgroundImage를 배열로 변환
  const rawImages =
    block.backgroundImages && block.backgroundImages.length > 0
      ? block.backgroundImages
      : block.backgroundImage
        ? [block.backgroundImage]
        : [];
  // asset 참조가 없는 이미지 제외 (Studio에서 이미지 미업로드 상태)
  const images = rawImages.filter((img) => img.asset?._ref);

  const hasMultiple = images.length > 1;
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartRef = useRef<number>(0);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), TRANSITION_DURATION);
    },
    [isTransitioning],
  );

  const goNext = useCallback(() => {
    goTo((current + 1) % images.length);
  }, [current, images.length, goTo]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + images.length) % images.length);
  }, [current, images.length, goTo]);

  // 자동 재생
  useEffect(() => {
    if (!hasMultiple) return;
    timerRef.current = setInterval(goNext, SLIDE_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasMultiple, goNext]);

  // 자동 재생 리셋 (수동 조작 시)
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(goNext, SLIDE_INTERVAL);
  }, [goNext]);

  const handlePrev = () => {
    goPrev();
    resetTimer();
  };

  const handleNext = () => {
    goNext();
    resetTimer();
  };

  const handleDot = (index: number) => {
    goTo(index);
    resetTimer();
  };

  // 터치 스와이프
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!hasMultiple) return;
    const diff = touchStartRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  return (
    <section
      className="relative flex min-h-[420px] items-center justify-center overflow-hidden sm:min-h-[540px] lg:min-h-[75vh]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 슬라이드 배경 이미지 트랙 */}
      {images.length > 0 && (
        <div
          className="absolute inset-0 flex"
          style={{
            width: `${images.length * 100}%`,
            transform: `translateX(-${(current * 100) / images.length}%)`,
            transition: `transform ${TRANSITION_DURATION}ms ease-in-out`,
          }}
        >
          {images.map((img, i) => {
            const bgUrl = urlFor(img).width(1920).quality(85).url();
            return (
              <div
                key={img.asset?._ref || i}
                className="relative h-full shrink-0"
                style={{
                  width: `${100 / images.length}%`,
                  backgroundImage: `url(${bgUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            );
          })}
        </div>
      )}

      {/* overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/95 via-primary/70 to-primary/50" />

      {/* decorative accent line */}
      <div className="absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />

      {/* content */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-16 text-center">
        {block.subtitle && (
          <p className="mb-4 text-sm font-medium tracking-[0.2em] uppercase text-accent-light sm:text-base">
            {block.subtitle}
          </p>
        )}
        <h1 className="text-3xl leading-tight font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {block.title}
        </h1>
        {block.buttonText && block.buttonLink && (
          <Link
            href={block.buttonLink}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-accent-light hover:shadow-xl"
          >
            {block.buttonText}
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        )}
      </div>

      {/* 슬라이드 컨트롤 (이미지 2장 이상일 때만) */}
      {hasMultiple && (
        <>
          {/* 좌우 화살표 */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute top-1/2 left-4 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 sm:left-6 sm:h-12 sm:w-12"
            aria-label="이전 슬라이드"
          >
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute top-1/2 right-4 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 sm:right-6 sm:h-12 sm:w-12"
            aria-label="다음 슬라이드"
          >
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>

          {/* 인디케이터 도트 */}
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleDot(i)}
                className={`h-2.5 rounded-full transition-all ${
                  i === current
                    ? "w-8 bg-accent"
                    : "w-2.5 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`슬라이드 ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroBlock;
