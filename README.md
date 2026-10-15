# Riyozen portfolio

A one-page portfolio site: plain HTML, CSS and JavaScript. No build step.

## Files
- `index.html` - the whole site (text, styles, 3D scene)
- `assets/video/reel-1.mp4`, `reel-2.mp4` - 45-second preview reels
- `assets/img/poster-1.jpg`, `poster-2.jpg` - thumbnails shown before play

## Run it on your computer
Double-click `index.html`. The 3D background loads Three.js from the internet (cdnjs), so you need a connection.

## Put it online (free)
Upload the whole folder to Netlify (drag and drop at app.netlify.com/drop), Cloudflare Pages, or GitHub Pages. Keep the folder structure as it is.

## Edit
- Reel titles and captions: search `index.html` for `<figcaption>`.
- Email and WhatsApp: search for `mailto:` and `wa.me`.
- Colors: the variables at the top of the `<style>` block (`--bg`, `--ink`, `--accent`).
- Fonts: Instrument Serif and Manrope from Google Fonts.

## Use full-length videos
Replace the two files in `assets/video/` with your finished videos, keeping the same names (or edit the `src` in `index.html`). On real hosting there is no 16 MB limit, but keep each file under about 100 MB for quick loading.

## Add another reel
Copy one `<figure>...</figure>` block in `index.html`, then change the video, poster and caption.
