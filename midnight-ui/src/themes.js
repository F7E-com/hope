// src/themes.js

export const FACTION_THEMES = {
  government: {
    id: "government",
    name: "Government",
    description:
      "The shining faces of the city’s elected best, ready to make the hard decision or show newcomers around with a sincere smile.",
    colors: {
      background: "#ffffff",
      accent: "#000000",
      text: "#111111",
    },
    banner: "/themes/gov_banner.jpg", // swap in real assets later
    style: {
      motif: "Black & White marble, polished floors; courts",
      focus: "Community",
      duties: [
        "Creating Community Guidelines",
        "Proposing polls and policy alterations",
        "Event hosting & announcements",
        "Greeting & orienting new users",
      ],
    },
  },

  infrastructure: {
    id: "infrastructure",
    name: "Infrastructure",
    description:
      "Retro City’s builders and construction crews - not to mention parks & rec. Responsible for maintaining easy traffic and redesigning workflows.",
    colors: {
      background: "#002244",
      accent: "#FFD700",
      text: "#ffffff",
    },
    banner: "/themes/infrastructure_banner.jpg",
    style: {
      motif: "Blueprints, roads, and city planning",
      focus: "Website",
      duties: [
        "Community event planning & structure",
        "Bug reporting/on-the-fly fixes",
        "Website/platform updates and upgrades",
        "Flagging/removing unsafe content",
      ],
    },
  },

  security: {
    id: "security",
    name: "Security",
    description:
      "Hard at attention, the city’s security officers stand ready to keep the peace…or help neutralize threats with honor and aplomb.",
    colors: {
      background: "#1f1f2e",
      accent: "#6c7a89",
      text: "#cfd8dc",
    },
    banner: "/themes/security_banner.jpg",
    style: {
      motif: "Panels, wiring, a bit scuffed",
      focus: "Peacekeeping",
      duties: [
        "Public security",
        "Conflict resolution",
        "Community standards enforcement",
      ],
    },
  },

  commerce: {
    id: "commerce",
    name: "Commerce",
    description:
      "All things that glitter may not be gold, but they can still turn a profit.",
    colors: {
      background: "#fff8e1",
      accent: "#d4af37",
      text: "#222222",
    },
    banner: "/themes/commerce_banner.jpg",
    style: {
      motif: "Splendor, Grandeur, Business",
      focus: "Revenue",
      duties: [
        "Product standards",
        "Focus groups",
        "Fundraising",
        "Marketing",
      ],
    },
  },

  industry: {
    id: "industry",
    name: "Industry",
    description:
      "All metals have their foundry, and Retro City’s rivets are in good hands - greasy, but strong & capable.",
    colors: {
      background: "#2c1b0e",
      accent: "#e25822",
      text: "#f5deb3",
    },
    banner: "/themes/industry_banner.jpg",
    style: {
      motif: "Foundry/factory",
      focus: "Open Projects",
      duties: [
        "In-progress project hosting and organization",
        "Platform updates",
        "Open-source firmware & plugins",
      ],
    },
  },

  research: {
    id: "research",
    name: "Research",
    description:
      "Once all smoke and crystal balls, the Mages’ Guild has become an austere academy - a monolith - where silence is key, and the unknown become known.",
    colors: {
      background: "#e0f7fa",
      accent: "#00bcd4",
      text: "#003344",
    },
    banner: "/themes/research_banner.jpg",
    style: {
      motif: "Reductionist future, glossy white hallways",
      focus: "Development",
      duties: [
        "Platform feature meetings",
        "Polls and statistics",
        "Record keeping and organization",
      ],
    },
  },

  background: {
    id: "background",
    name: "Background",
    description:
      "The unsung heroes of the night. Faction Seven is always watching.",
    colors: {
      background: "#0d0d0d",
      accent: "#800080",
      text: "#e0e0e0",
    },
    banner: "/themes/background_banner.jpg",
    style: {
      motif: "Sleek cyberpunk/dark metal",
      focus: "Normalcy",
      duties: [
        "Gathering community intel",
        "Handling problems before they arise",
        "Remaining elusive",
      ],
    },
  },
};
