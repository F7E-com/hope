// src/components/MediaViewer.jsx
import React from "react";
import "../styles/MediaViewer.css";

export default function MediaViewer({ type, src, title = "" }) {
  switch (type) {
    case "youtube":
      return (
        <div className="media-container youtube">
          <iframe
            className="youtube-embed"
            src={src}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );

    case "gdrive":
      return (
        <div className="media-container drive">
          <iframe
            className="drive-embed"
            src={src}
            title={title}
            allow="autoplay"
            allowFullScreen
          ></iframe>
        </div>
      );

    case "image":
      return (
        <div className="media-container image">
          <img src={src} alt={title} className="responsive-image" />
        </div>
      );

      case "text":
      return (
        <div className="media-container text">
          <p className="text-content">{src}</p>
        </div>
      );

      case "webpage":
      return (
        <div className="media-container webpage">
          <iframe src={src} title={title} className="webpage-embed"></iframe>
        </div>
      );

    case "audio":
      return (
        <div className="media-container audio">
          <audio controls>
            <source src={src} />
            Your browser does not support audio playback.
          </audio>
        </div>
      );

    case "pdf":
      return (
        <div className="media-container pdf">
          <iframe src={src} title={title} className="pdf-embed"></iframe>
        </div>
      );

    default:
      return <p>Unsupported media type: {type}</p>;
  }
}
