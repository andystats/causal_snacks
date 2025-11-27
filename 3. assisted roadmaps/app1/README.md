# Causal Roadmap Copilot

An interactive React application that guides users through the Causal Roadmap framework for generating high-quality real-world evidence (RWE).

This version includes both an **Offline Mode** (fully self-sufficient) and an **AI Copilot Mode** (requires an API key) to assist with study design.

## 🚀 How to Run the App

The application is set up in the `causal-roadmap-app` directory using Vite + React.

### Prerequisites
- **Node.js** (version 18+ recommended)
- **Terminal/Command Prompt**

### Start the App
1. Open your terminal.
2. Navigate to the project folder:
   ```bash
   cd causal-roadmap-app
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Look for the URL in the terminal output (usually `http://localhost:5173/`).
5. **Command + Click** the link or paste it into your browser (Chrome/Safari/Edge) to open the app.

### Stopping the App
- Press `Ctrl + C` in the terminal window to stop the server.

---

## 🛠 Features

### 1. The 8-Step Causal Roadmap
Synthesizes Target Trial Emulation (Hernán), ICH E9(R1), and Causal Roadmap (van der Laan) into a guided workflow:
1. **Define Causal Question**
2. **Specify Causal Model** (DAGs)
3. **Consider Observed Data**
4. **Assess Identifiability**
5. **Define Statistical Estimand**
6. **Choose Estimator** (TMLE/Super Learner)
7. **Sensitivity Analysis** (E-value/G-value)
8. **Results & Interpretation**

### 2. Dual Modes
- **Offline Mode (Default):** Click through all steps, view built-in examples (Williamson et al. case study), and export your work to Markdown without any internet connection.
- **AI Copilot Mode:** Click the "Open Copilot" button to chat with an AI assistant trained on causal inference concepts. (Requires an OpenAI or Gemini API key).

### 3. Export
- **Markdown Export:** Save your study design as a `.md` file, suitable for inclusion in a Statistical Analysis Plan (SAP) or GitHub repository.

---

## 🔮 Next Steps & Deployment Options

You can take this prototype and host it for others to use or package it as a standalone desktop application.

### Option A: Host on GitHub Pages (Free Web Hosting)
Perfect for sharing with colleagues or students.

1.  **Create a GitHub Repository:**
    - Go to GitHub.com -> New Repository -> Name it `causal-roadmap`.
2.  **Push Code:**
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin <YOUR_GITHUB_URL>
    git push -u origin main
    ```
3.  **Deploy:**
    - Install the deploy tool: `npm install gh-pages --save-dev`
    - Update `package.json` scripts:
      ```json
      "scripts": {
        "predeploy": "npm run build",
        "deploy": "gh-pages -d dist"
      }
      ```
    - Run: `npm run deploy`
    - Your app will be live at `https://<username>.github.io/causal-roadmap`.

### Option B: Package as a Mac App (DMG)
Create a standalone `.dmg` file that users can install like any other Mac app.

1.  **Use Electron or Tauri:**
    - **Electron:** Standard industry choice (Slack, VS Code). easier to set up but larger file size.
    - **Tauri:** Newer, smaller file size, uses Rust (but you write JS for the UI).
2.  **Steps for Electron:**
    - Initialize Electron inside the folder.
    - Create a `main.js` file to create the application window.
    - Use `electron-builder` to compile the `.app` and `.dmg`.
    - **Certificate:** To share it broadly without warning messages, you will need an Apple Developer Account ($99/year) to sign the app.

### Option C: Private Organization Hosting (Vercel/Netlify)
If this is for a company (e.g., Lucidity Sciences), Vercel or Netlify offers easier "Push to Deploy" workflows with password protection capabilities.

---

## 📚 Source Papers
- **Dang et al. (2023)** - "A causal roadmap for generating high-quality real-world evidence" - *JCTS*
- **Williamson et al. (2023)** - "An application of the Causal Roadmap in two safety monitoring case studies" - *JCTS*

*Context: Causal Methods Spring 2026 Course Materials*