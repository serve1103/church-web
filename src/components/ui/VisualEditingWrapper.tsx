"use client";

import { useEffect, useState } from "react";
import { VisualEditing } from "next-sanity/visual-editing";

const VisualEditingWrapper = () => {
  const [isInsidePresentation, setIsInsidePresentation] = useState(false);

  useEffect(() => {
    // Presentation Tool iframe 안에서만 VisualEditing 활성화
    if (window.self !== window.top) {
      setIsInsidePresentation(true);
    }
  }, []);

  if (!isInsidePresentation) return null;

  return <VisualEditing zIndex={40} />;
};

export default VisualEditingWrapper;
