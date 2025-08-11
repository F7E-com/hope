F7E MIDNIGHT UI


SUMMARY

A multimedia sharing platform allowing artists to host and showcase their work and link to their sites using modular, customizable homepages.

Open Project Collab Boards allow creators to host open source projects, or those seeking credit or experience to contribute to open, collaborative works one asset at a time.


FEATURES


Hosting:

Media is uploaded to host sites and URLs (YouTube, Imgur, etc.) are stored in Firebase using React APIs, then displayed as links or content modules on creator homepages. 


Creator Pages:

React/JS content module APIs designed to draw from specified cloud storage/filehosts.

Homepage layouts are saved to Firebase in JSON format, but can be downloaded clientside.

Creators select whether their content is available for download. Downloaded content takes priority when loading content pages or modules


Content Modules:

Modules should be drag-and-drop, resizable, and themed - either individually or to fit the user’s chosen client window theme.


Image (.jpg, .bmp, .gif)

Audio Player (Upload, .mp3, .wav)

Audio Player (Embedded, SoundCloud)

Video (Embedded, YouTube)

Video (Upload, .mp4, .wmv)

Game Window (Viewport, .html)

Text Window (Written in-client)

Document Showcase (.txt, .rtf, .docx, .pdf, comes with scrollbar and sizing code)

Graphic Novel Reader (Embed)


Platform:

Platform/UI themes are created to fit a monthly artistic theme. These client window themes are then archived and made downloadable.


Open Projects:

A categorized list of open-source assets and projects under development - a first-come-first-serve way to get some experience, credit, or free labor.

Post a project, list your project and assets with percent finished, and vet submissions to complete it with a little help from the community.

All credit where credit is due, and no money changes hands through the platform (as per explicitly stated rules.)


TOOLS


Frontend - React

Web Deployment - Netlify/GitHub Pages

Filehosting - Firebase/GDrive

Image Hosting - Imgur (with client API)

Video Hosting - YouTube 

Sound hosting - SoundCloud 

Graphic Novel Reader - Swiper.js (house-made)

Backend/Client - Electron (downloadable)



PROCESS 

Suggested timeframe: 3-6 months

(Each phase ideally includes live testing.)


Phase 1: Web deployment 

Create initial UI theme and layouts
Create React UI homepage, media, content pages


Phase 2: User base

Add Firebase/Firestore support to store user account and content page data
Add user-created homepages/profiles


Phase 3: Filehosting 

Create APIs for communicating with content hosting sites
Create modular homepage setup


Phase 4: Clientside 

Create downloadable Electron shell
Add structure for downloading and managing downloadable content, including page layouts and client themes


Phase 5: Continuing Support 

Introduce tiered hosting service through Patreon, allowing creators to pay directly for more storage on hosting sites and better platform access
Preserve existing services as free tier
