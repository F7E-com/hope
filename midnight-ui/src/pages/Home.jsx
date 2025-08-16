export default function Home() {
  return (
    <div className="main-container">
      {/* Suggested Links (Left Sidebar) */}
      <div className="sidebar left">
        <div className="suggested">
          <img src="media1.jpg" alt="Media 1" />
          <a href="#">Urban Echoes</a>
        </div>
        <div className="suggested">
          <img src="media2.jpg" alt="Media 2" />
          <a href="#">Moonlit Strands</a>
        </div>
        {/* Add more links as needed */}
      </div>

      {/* Featured Showcase */}
      <div className="featured">
        <h2>
          Featured Content: "Just for Kicks" by{" "}
          <a
            href="https://Raszyra.github.io/Site/about.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            F7E
          </a>
        </h2>
        <div className="youtube-embed-container">
          <iframe
            className="youtube-embed"
            src="https://www.youtube.com/embed/P0h0rO7eods?si=MMQiYKH9NEHZJ61p"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Site News (Right Sidebar) */}
      <div className="sidebar right">
        <div className="news">
          <h3>Site News</h3>
          <p>
            Faction Seven content platform up and running! Main page features
            and modules fully (mostly) functional.
          </p>
        </div>
      </div>

      {/* Showcase 2 & 3 */}
      <div className="showcases">
        <div className="showcase-2">
          <h4>
            "R E L A X" by{" "}
            <a
              href="https://Raszyra.github.io/Site/about.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              F7E
            </a>
          </h4>
          <div className="youtube-embed-container">
            <iframe
              className="responsive-image"
              src="https://drive.google.com/file/d/1PhvScbMV0aXOONmudS8SIr4F_KJiajKM/preview"
              title="image"
              allow="autoplay"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className="showcase-3">
          <img src="showcase3.jpg" alt="Showcase 3" />
          <h4>
            Nevereign: Shadow Rising by{" "}
            <a
              href="https://Raszyra.github.io/Site/about.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              F7E
            </a>
          </h4>
          <div className="text-embed-container">
            <iframe
              src="https://docs.google.com/document/d/1yEb24TJz9DchfmO80x89cFe9qKe9uPGzHoAASy4KsNk/preview"
              title="Nevereign: Shadow Rising"
              width="640"
              height="480"
              allow="autoplay"
            ></iframe>
          </div>
          Read the whole story{" "}
          <a
            href="https://Patreon.com/FactionSevenEntertainment"
            style={{ color: "red" }}
          >
            here
          </a>
          .
        </div>
      </div>

      {/* Media Spotlights 4-10 */}
      <div className="spotlight-list">
        <ul>
          <li><a href="#">[4] Iris.exe – Short horror game</a></li>
          <li><a href="#">[5] Selene’s Vault – Digital comic</a></li>
          <li><a href="#">[6] Synth Sketches – Concept art</a></li>
          <li><a href="#">[7] Rooftop Hymns – Poetry</a></li>
          <li><a href="#">[8] Last Light – Animated short</a></li>
          <li><a href="#">[9] Outskirts – Creator podcast</a></li>
          <li><a href="#">[10] F7 Monthly Jam Results</a></li>
        </ul>
      </div>
    </div>
  );
}
