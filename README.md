# 📝 Sticky Notes – Electron App

A lightweight **desktop sticky notes application** built with [Electron](https://www.electronjs.org/).  
Keep your thoughts, reminders, and todos always visible on your desktop with a **blurry, semi-transparent sticky note style**.

---

## ✨ Features

- 📌 Create multiple sticky notes  
- 🔄 Notes persist across app restarts (saved locally)  
- 🖼️ Blurry / transparent sticky window style  
- 📍 Always-on-top mode  
- 🎛️ Adjustable opacity for notes  
- 🖱️ Drag, resize, and move notes freely  
- ⌨️ Global shortcut to create a new note (`Ctrl + Alt + N` on Windows / Linux, `Cmd + Alt + N` on macOS)  
- 🖼️ Tray menu for quick actions  

---

## 🚀 Getting Started

### 1. Clone the repo

git clone https://github.com/keshavkdas/Sticky-Notes-Electron.git
cd Sticky-Notes-Electron

2. Install dependencies
npm install

3. Run in development
npm start

4. Build installer / exe
npm run dist


The built .exe (or installer) will be available inside the dist/ folder.

<img width="1060" height="639" alt="image" src="https://github.com/user-attachments/assets/151d847c-c713-40ac-9858-b1ea6b88b7d6" />

🛠️ Tech Stack

Electron
 – cross-platform desktop apps

Node.js
 – runtime

electron-store
 – persistent storage

electron-builder
 – packaging

📦 Packaging & Distribution

npm run dist → creates an installer or portable executable in dist/

Windows: .exe

Mac: .dmg / .app

Linux: .AppImage / .deb

🧑‍💻 Contributing

Fork the repo

Create a new branch (feature/awesome-thing)

Commit your changes

Push and open a Pull Request 🎉

