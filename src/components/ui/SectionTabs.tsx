"use client";

import { useEffect, useState, useCallback } from "react";

interface Tab {
  label: string;
  anchor: string;
}

const TABS: Tab[] = [
  { label: "인사말", anchor: "greeting" },
  { label: "예배안내", anchor: "worship" },
  { label: "섬기는 사람들", anchor: "staff" },
  { label: "연혁", anchor: "history" },
  { label: "오시는 길", anchor: "directions" },
];

const SectionTabs = () => {
  const [activeAnchor, setActiveAnchor] = useState(TABS[0].anchor);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    // Find the topmost visible section
    const visible = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

    if (visible.length > 0) {
      setActiveAnchor(visible[0].target.id);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "-120px 0px -60% 0px",
      threshold: 0,
    });

    TABS.forEach(({ anchor }) => {
      const el = document.getElementById(anchor);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [handleObserver]);

  const handleClick = (anchor: string) => {
    setActiveAnchor(anchor);
    const el = document.getElementById(anchor);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-[72px] z-30 border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4">
        <nav className="flex gap-1 overflow-x-auto py-2">
          {TABS.map(({ label, anchor }) => (
            <button
              key={anchor}
              onClick={() => handleClick(anchor)}
              className={`shrink-0 rounded-md px-5 py-2.5 text-sm font-medium transition-colors ${
                activeAnchor === anchor
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:bg-gray-100 hover:text-text"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SectionTabs;
