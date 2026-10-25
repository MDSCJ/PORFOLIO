# PORFOLIO
Hi, I’m Chamath, a Computer Science and Engineering undergrad at the University of Moratuwa. I love problem-solving and building innovative solutions, combining technical skills with a creative edge from Graphic Design (NVQ-04).

## Development
```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
```

The site has two pages:

- `/` — a Windows 11-style desktop (`src/os/`): boot and lock screens, Start menu, taskbar, quick settings,
  draggable/snappable windows, and apps (Portfolio, File Explorer, Edge, Terminal, Notepad, Mail, Calculator,
  Settings, Recycle Bin).
  On phones (or when a desktop window is narrowed below 768px) it reboots into an Android-style shell
  (`src/android/`) that runs the same apps; widening the window switches back to Windows.
- `/portfolio/` — the 3D portfolio (`src/components/`), which the desktop's **Portfolio** app opens in a window.

All content lives in `src/data/portfolio.js` and feeds both pages (including the OS's virtual file system).
Wallpapers are in `src/os/assets/wallpapers/`. Drop a 3D model at `public/model.glb` to replace the placeholder
avatar. The previous static site is kept in `legacy/`.
