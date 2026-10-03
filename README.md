# Pixel Study

> A tiny pixel study companion for your desk.

**Pixel Study** is a lightweight desktop study companion built with **Tauri, React, and TypeScript**.

It sits beside your work while you study, giving you a small pixel-art companion, study sessions, course tracking, streaks, and a cozy environment without turning your study session into another giant dashboard.

The idea is simple:

**Choose a course → choose your study time → sit down → study → finish → track your progress.**

---

## ✦ Features

* 🎓 Semester and course setup
* ⏱️ Custom study-session durations
* 🧍 Pixel character opening sequence
* 💻 Study timer with pause/resume
* 🌙 Closing animation when a session ends
* 📚 Course-based study tracking
* 🔥 Study streaks
* 📊 Study statistics
* 💾 Persistent local data
* 🎨 Customizable character and environment
* 🌦️ Different environments and weather
* 🌙 Time-of-day scenes
* 🪴 Small environmental animations
* 🖥️ Compact desktop window
* 🧩 Designed to be modified and extended

---

## ✦ The Idea

Most productivity applications try to become the place where you do everything.

Pixel Study does the opposite.

It is meant to **stay out of the way**.

You can keep it open beside your notes, textbook, IDE, browser, or lecture material while the little companion studies alongside you.

The character isn't supposed to replace your study tools.

She's just there.

---

# ✦ Tech Stack

* **Tauri 2**
* **React**
* **TypeScript**
* **Vite**
* **Rust**
* **Tauri Store**
* **CSS**
* Pixel-art assets

---

# ✦ Getting Started

## Requirements

Before running Pixel Study locally, install:

* Node.js
* npm
* Rust
* Tauri prerequisites for your operating system

Then clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/pixel-study.git
cd pixel-study
```

Install dependencies:

```bash
npm install
```

Run the development application:

```bash
npm run tauri dev
```

Build the application:

```bash
npm run tauri build
```

---

# ✦ Project Structure

A simplified structure looks like this:

```text
pixel-study/
│
├── src/
│   ├── assets/
│   │   ├── characters/
│   │   ├── environments/
│   │   ├── animations/
│   │   └── ui/
│   │
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
│
├── src-tauri/
│   ├── src/
│   ├── capabilities/
│   ├── tauri.conf.json
│   └── Cargo.toml
│
├── package.json
├── tsconfig.json
└── README.md
```

---

# ✦ Customize Your Pixel Study

One of the main goals of this project is that **Pixel Study doesn't have to look like my version.**

You can fork the project and make it yours.

Change the:

* character
* outfits
* room
* desk
* wallpapers
* color palette
* animations
* weather
* time of day
* study-session behavior
* courses
* statistics
* UI
* sounds
* decorations
* themes
* streak system
* anything else you want

If you can modify the code or replace an asset, you can create your own version.

---

# ✦ Forking the Project

To create your own version:

### 1. Fork the repository

Click **Fork** on GitHub.

This creates your own copy of Pixel Study that you can modify independently.

### 2. Clone your fork

```bash
git clone https://github.com/YOUR_USERNAME/pixel-study.git
cd pixel-study
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start development

```bash
npm run tauri dev
```

### 5. Start customizing

Modify the source code and replace the assets with your own.

---

# ✦ Creating Your Own Character

Pixel Study is designed so the visual assets can be replaced.

You can create your own:

```text
characters/
├── idle/
├── studying/
├── reading/
├── writing/
├── drinking/
├── stretching/
├── opening/
└── closing/
```

Keep the frame dimensions and positioning consistent so animations remain smooth.

For best results, keep the character aligned to the same pixel grid across frames.

---

# ✦ Creating Your Own Room

You can replace the default environment with your own study space.

For example:

```text
environments/
├── morning/
├── afternoon/
├── sunset/
├── night/
├── rainy/
└── storm/
```

The recommended approach is to separate the environment from the character.

This allows the same character animation to work across multiple environments.

For example:

```text
Rainy Night
      +
Studying Animation
      =
Rainy Night Study Session
```

You don't need to create a completely new character animation for every background.

---

# ✦ Adding Animations

Animations are made from sequential frames.

For example:

```text
studying/
├── frame_01.png
├── frame_02.png
├── frame_03.png
├── frame_04.png
├── ...
└── frame_16.png
```

The application can then cycle through the frames to create the animation.

You can add completely new actions such as:

* drinking coffee
* reading
* coding
* taking notes
* stretching
* checking the phone
* listening to music
* looking out the window
* taking a break

---

# ✦ Custom Themes

The visual styling is controlled primarily through the application's CSS.

You can create your own theme by changing:

* background colors
* text colors
* accent colors
* borders
* shadows
* buttons
* typography
* panels

For example, you could make:

```text
Midnight Pink
Sakura
Lavender
Forest
Coffee Shop
Ocean
Monochrome
Retro CRT
```

The default Pixel Study aesthetic is only one possibility.

---

# ✦ Adding Courses

Courses are stored as part of the application's persistent data.

You can create your own semester structure and add whatever subjects you are studying.

For example:

```text
Semester 1

├── Artificial Intelligence
├── Deep Learning
├── Database Systems
├── Computer Networks
└── Research Methods
```

Pixel Study is not tied to a particular university or academic program.

---

# ✦ Data & Privacy

Pixel Study is designed around local data storage.

Your study sessions and course information are stored locally by the application.

The project does not require an online account to use the core study functionality.

---

# ✦ Contributing

Contributions are welcome.

You can contribute by:

* fixing bugs
* improving accessibility
* adding features
* improving animations
* creating new themes
* creating new environments
* improving documentation
* optimizing performance
* adding tests

### Basic workflow

```bash
git checkout -b feature/my-feature
```

Make your changes, then:

```bash
git add .
git commit -m "Add my feature"
git push origin feature/my-feature
```

Then open a Pull Request on GitHub.

---

# ✦ Making Your Own Version

You are also free to take Pixel Study in a completely different direction.

For example, you could turn it into:

* a cat study companion
* a robot coding companion
* a fantasy study room
* a minimal Pomodoro app
* a university-specific study tracker
* a language-learning companion
* a programming companion
* a completely different pixel-art environment

You don't need to keep the original visual style.

**Fork it. Change it. Make it yours.**

---

# ✦ License

Pixel Study is released under the **MIT License**.

This means you can use, modify, copy, merge, publish, distribute, sublicense, and sell your own versions of the software, subject to the terms of the license.

See [`LICENSE`](LICENSE) for the full license text.

---

## ✦ Asset Licensing

The software license and the artwork license may be different.

Before redistributing a fork, check the license or usage terms for any included:

* character artwork
* pixel-art assets
* fonts
* sounds
* icons
* third-party libraries

If you create your own character, artwork, sounds, or other assets, you should provide the appropriate licensing information for those assets.

---

## ✦ Roadmap

Pixel Study is still evolving.

Possible future additions:

* [ ] More character animations
* [ ] More outfits
* [ ] Custom characters
* [ ] Room customization
* [ ] Weather system
* [ ] Dynamic time of day
* [ ] More study statistics
* [ ] Weekly/monthly/semester analytics
* [ ] Custom sounds
* [ ] Ambient audio
* [ ] More themes
* [ ] Import/export of study data
* [ ] Custom animation packs
* [ ] Community-created themes and rooms
* [ ] Community-created characters

---

## ✦ Why Pixel Study?

Studying can get repetitive.

Sometimes having a tiny companion sitting beside you is enough to make the session feel a little less lonely.

Pixel Study is built around that idea.

**Open your notes.**

**Start the timer.**

**Study together.**

---

<p align="center">
  Made with pixels, code, and probably too much studying.
</p>
