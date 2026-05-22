"use client";
import { useEffect } from "react";

export default function ConditionalBodyPadding() {
  useEffect(() => {
    // The navbar is now absolute/overlay on all pages,
    // so no body padding is needed. Each page handles
    // its own spacing via its hero/header section.
    document.body.style.paddingTop = "0";
  }, []);

  return null;
}
