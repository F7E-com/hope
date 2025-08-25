import React from "react";

export default function ModuleContainer({ children }) {
  const count = React.Children.count(children);

  // Define layouts based on module count
  const layoutClass = {
    1: "grid grid-cols-1 gap-4",
    2: "grid grid-cols-2 gap-4",
    3: "grid grid-cols-3 gap-4",
  }[count] || "grid grid-cols-4 gap-4"; // 4 or more

  return <div className={layoutClass}>{children}</div>;
}
