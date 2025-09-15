"use client";

import { useState, useEffect } from "react";

const SIDEBAR_STORAGE_KEY = "sidebar-open";

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored !== null) {
      setIsOpen(JSON.parse(stored));
    } else {
      // Default to closed on first visit
      setIsOpen(false);
    }
    setIsLoaded(true);
  }, []);

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(isOpen));
    }
  }, [isOpen, isLoaded]);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    isLoaded,
    toggle,
    open,
    close,
  };
}