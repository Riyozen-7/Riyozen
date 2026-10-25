# Riyozen portfolio
Static site, no build step. Open `index.html` (or run `python3 -m http.server` here and visit localhost:8000).
Add a project: put a compressed MP4 in `assets/video/`, a poster (webp/jpg) in `assets/posters/`, then add one entry to `projects.js`.
Compress videos: `ffmpeg -i in.mp4 -vf scale=720:1280 -c:v libx264 -crf 28 -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart out.mp4`
Before launch: add a 1200x630 share image and set `og:image` to its absolute URL.
