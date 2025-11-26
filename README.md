# 🖥️ Terminal Portfolio - Hafiz Izzuddin

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73C92?style=for-the-badge&logo=vite&logoColor=white)

> A personal portfolio website inspired by **Arch Linux** and **Text User Interfaces (TUI)**.

This project recreates the experience of a Linux terminal environment in the browser. It features a fully interactive command-line interface, file system navigation, and retro aesthetics, all built with modern web technologies.

## ✨ Features

- **Interactive Shell**: Type commands like `ls`, `cd`, `cat`, and `help` to navigate the site.
- **Tab Completion**: Auto-complete commands and file names by pressing `Tab`.
- **Boot Sequence**: Simulated BIOS/Kernel boot logs on initial load.
- **TUI Design**: Sidebar file manager and status bars mimicking `i3wm` or `tmux`.
- **Typing Effects**: Content renders character-by-character for a realistic terminal feel.
- **Responsive Layout**: Adapts seamlessly to mobile and desktop screens.
- **Hidden Secrets**: Try `sudo` or cat specific files for easter eggs.

## 🚀 Supported Commands

Just like a real terminal, you can interact with the portfolio using the input field at the bottom:

| Command | Usage | Description |
| :--- | :--- | :--- |
| `help` | `help` | List all available commands |
| `ls` | `ls` | List directory contents (sections) |
| `cd` | `cd <dir>` | Navigate to a section (e.g., `cd projects`, `cd ..`) |
| `cat` | `cat <file>` | Display file contents (e.g., `cat work_history.txt`) |
| `whoami` | `whoami` | Display current user info |
| `clear` | `clear` | Clear the terminal history |
| `reboot` | `reboot` | Restart the system (replays boot animation) |

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/terminal-portfolio.git
   cd terminal-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📂 Project Structure

- **`/src/components`**: Reusable UI components (`TerminalWindow`, `Prompt`, `TypingEffect`).
- **`/src/constants.tsx`**: Resume data and configuration.
- **`/src/types.ts`**: TypeScript definitions.
- **`/src/App.tsx`**: Main application logic and terminal emulator state.

## 🎨 Customization

You can easily customize the portfolio with your own data:

1. Open `src/constants.tsx`.
2. Update the `RESUME_DATA` object with your personal information, experience, and projects.
3. The terminal responses in `App.tsx` will automatically reflect these changes.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

*Built with 💙 by Hafiz Izzuddin*
