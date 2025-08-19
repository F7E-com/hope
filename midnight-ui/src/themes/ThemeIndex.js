import './FactionThemes.css';

export const THEMES = {
  vale: {
    name: "Vale",
    className: "vale",
    fontFamily: "'Cinzel', serif",
    modulePadding: "32px",
    moduleMargin: "24px auto",
    preview: {
      background: "linear-gradient(to bottom right, #1b2a2f, #2e3e3f)",
      color: "#c0ffd4"
    }
  },

  neon: {
    name: "Neon Glow",
    className: "neon",
    fontFamily: "'Orbitron', sans-serif",
    modulePadding: "28px",
    moduleMargin: "20px auto",
    preview: {
      background: "black",
      color: "#0ff"
    }
  },

  pastel: {
    name: "Pastel Dreams",
    className: "pastel",
    fontFamily: "'Comic Neue', cursive",
    modulePadding: "30px",
    moduleMargin: "22px auto",
    preview: {
      background: "#ffd",
      color: "#333"
    }
  },

  // --- Faction Themes ---
  government: {
    name: "Government",
    className: "government",
    fontFamily: "'Merriweather', serif",
    modulePadding: "32px",
    moduleMargin: "24px auto",
    preview: {
      background: "linear-gradient(to bottom right, #ffffff, #000000)",
      color: "#111"
    },
    details: {
      ui: "Black & white marble floors, polished hallways, statues, formal courts",
      focus: "Community",
      tasks: [
        "Creating community guidelines",
        "Proposing polls and policy alterations",
        "Event hosting & announcements",
        "Greeting & orienting new users"
      ]
    }
  },

  infrastructure: {
    name: "Infrastructure",
    className: "infrastructure",
    fontFamily: "'Roboto', sans-serif",
    modulePadding: "30px",
    moduleMargin: "22px auto",
    preview: {
      background: "linear-gradient(to bottom right, #1e3f9e, #f9d300)",
      color: "#fff"
    },
    details: {
      ui: "Industrial-blueprints, construction beams, yellow warning accents",
      focus: "Website",
      tasks: [
        "Community event planning & structure",
        "Bug reporting / on-the-fly fixes",
        "Website/platform updates and upgrades",
        "Flagging/removing unsafe content"
      ]
    }
  },

  security: {
    name: "Security",
    className: "security",
    fontFamily: "'Roboto Mono', monospace",
    modulePadding: "28px",
    moduleMargin: "20px auto",
    preview: {
      background: "linear-gradient(to bottom right, #3a5f9e, #7d7d7d)",
      color: "#e0e0e0"
    },
    details: {
      ui: "Panels, wiring, slightly scuffed tech surfaces",
      focus: "Peacekeeping",
      tasks: [
        "Public security",
        "Conflict resolution",
        "Community standards enforcement"
      ]
    }
  },

  commerce: {
    name: "Commerce",
    className: "commerce",
    fontFamily: "'Playfair Display', serif",
    modulePadding: "32px",
    moduleMargin: "24px auto",
    preview: {
      background: "linear-gradient(to bottom right, #ffd700, #fff8dc)",
      color: "#333"
    },
    details: {
      ui: "Splendor, grandeur, revolving glass doors, shiny surfaces",
      focus: "Revenue",
      tasks: [
        "Product standards",
        "Focus groups",
        "Fundraising",
        "Marketing"
      ]
    }
  },

  industry: {
    name: "Industry",
    className: "industry",
    fontFamily: "'Roboto', sans-serif",
    modulePadding: "32px",
    moduleMargin: "24px auto",
    preview: {
      background: "linear-gradient(to bottom right, #b22222, #ff8c00, #a0522d)",
      color: "#fff"
    },
    details: {
      ui: "Foundry/factory, molten metal accents, rivets, gears",
      focus: "Open Projects",
      tasks: [
        "In-progress project hosting and organization",
        "Platform updates",
        "Open-source firmware & plugins"
      ]
    }
  },

  research: {
    name: "Research",
    className: "research",
    fontFamily: "'Lora', serif",
    modulePadding: "30px",
    moduleMargin: "22px auto",
    preview: {
      background: "linear-gradient(to bottom right, #00ffff, #ffffff)",
      color: "#001f33"
    },
    details: {
      ui: "Glossy white hallways, minimalist, austere academic spaces",
      focus: "Development",
      tasks: [
        "It Could Be Better platform feature meetings",
        "Polls and statistics",
        "Record keeping and organization"
      ]
    }
  },

  background: {
    name: "Background",
    className: "background",
    fontFamily: "'Courier New', monospace",
    modulePadding: "28px",
    moduleMargin: "20px auto",
    preview: {
      background: "linear-gradient(to bottom right, #0d0d0d, #4b0082)",
      color: "#c0c0ff"
    },
    details: {
      ui: "Sleek cyberpunk, dark metals, hidden corners, subtle glows",
      focus: "Normalcy",
      tasks: [
        "Gathering community intel",
        "Handling problems before they arise",
        "Remaining elusive"
      ]
    }
  }
};
