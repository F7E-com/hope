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
            src={`https://www.youtube.com/embed/${src}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );

    case "drive":
      return (
        <div className="media-container drive">
          <iframe
            className="drive-embed"
            src={`https://drive.google.com/file/d/${src}/preview`}
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
