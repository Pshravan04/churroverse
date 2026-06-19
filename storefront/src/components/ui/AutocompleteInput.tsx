"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface AutocompleteInputProps {
  value: string;
  onChange: (val: string) => void;
  onSelect: (val: string) => void;
  suggestions: string[];
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
}

export default function AutocompleteInput({
  value,
  onChange,
  onSelect,
  suggestions,
  placeholder,
  label,
  icon,
}: AutocompleteInputProps) {
  const [open, setOpen] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close / reset focus when suggestions change
  useEffect(() => {
    if (suggestions.length === 0 || value.length < 1) {
      setOpen(false);
    } else {
      setOpen(true);
    }
    setFocusedIdx(-1);
  }, [suggestions, value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIdx((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIdx((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
      } else if (e.key === "Enter" && focusedIdx >= 0) {
        e.preventDefault();
        onSelect(suggestions[focusedIdx]);
        setOpen(false);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    },
    [open, suggestions, focusedIdx, onSelect]
  );

  const showDropdown = open && suggestions.length > 0;

  return (
    <div className="relative" ref={wrapperRef}>
      {label && (
        <label className="text-xs text-gray-400 block mb-1.5 flex items-center gap-1.5">
          {icon}
          {label}
        </label>
      )}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggestions.length > 0 && value.length >= 1) setOpen(true);
        }}
        placeholder={placeholder}
        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50 transition-colors"
        autoComplete="off"
      />

      {showDropdown && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-[#1a1020] border border-white/10 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden max-h-48 overflow-y-auto">
          {suggestions.map((s, idx) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(s);
                setOpen(false);
              }}
              onMouseEnter={() => setFocusedIdx(idx)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                idx === focusedIdx
                  ? "bg-orange-600/20 text-orange-300"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
