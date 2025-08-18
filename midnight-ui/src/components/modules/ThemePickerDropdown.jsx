import React, { useState, useRef, useEffect } from "react";
import { THEMES } from "../../themes/ThemeIndex";

export default function ThemePickerDropdown({ unlockedThemes = [], selectedTheme, onChange, customColor, onCustomColorChange }) {
  const [open, setOpen] = useState(false);
  const [usingCustom, setUsingCustom] = useState(selectedTheme === "custom");
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (themeKey) => {
    if (themeKey === "custom") {
      setUsingCustom(true);
      onChange("custom");
    } else {
      setUsingCustom(false);
      onChange(themeKey);
    }
    setOpen(false);
  };

  const displayName = usingCustom ? "Custom" : THEMES[selectedTheme]?.name || "Select Theme";

  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "inline-block", marginTop: "1rem" }}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "6px",
          border: "1px solid #444",
          background: "#222",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {displayName}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: 0,
            background: "#222",
            border: "1px solid #444",
            borderRadius: "6px",
            padding: "0.5rem 0",
            zIndex: 10,
            minWidth: "150px",
          }}
        >
          {unlockedThemes.map((themeKey) => {
            const theme = THEMES[themeKey];
            if (!theme) return null;

            return (
              <div
                key={themeKey}
                onClick={() => handleSelect(themeKey)}
                style={{
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: selectedTheme === themeKey && !usingCustom ? "#444" : "transparent",
                  color: theme?.preview?.color || "#fff",
                }}
              >
                <span>{theme.name}</span>
                <span
                  style={{
                    width: "20px",
                    height: "14px",
                    background: theme.preview.background,
                    borderRadius: "4px",
                    border: "1px solid #555",
                  }}
                />
              </div>
            );
          })}

          <div
            onClick={() => handleSelect("custom")}
            style={{
              padding: "0.5rem 1rem",
              cursor: "pointer",
              background: usingCustom ? "#444" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>Custom</span>
            <input
              type="color"
              value={customColor || "#ffffff"}
              onChange={(e) => onCustomColorChange(e.target.value)}
              style={{ width: "28px", height: "18px", border: "none", padding: 0, margin: 0, background: "transparent" }}
              onClick={(e) => e.stopPropagation()} // prevent closing dropdown
            />
          </div>
        </div>
      )}
    </div>
  );
}
