<div align="center">
  <img src="https://raw.githubusercontent.com/NEXTER-Soumya/CleanIQ/master/frontend/public/favicon.ico" alt="CleanIQ Logo" width="80" />
  <h1>CleanIQ</h1>
  <p><strong>Transform messy data into beautiful insights, instantly.</strong></p>
  <p>The fastest, AI-powered platform to clean, merge, and visualize datasets without writing a single line of code.</p>
</div>

---

## 🌟 Overview

CleanIQ is a modern, AI-driven data preparation and visualization platform designed for analysts, founders, and anyone who handles data. It eliminates the need for complex Python/Pandas scripts or wrestling with Excel formulas. 

Simply upload your raw, messy data, and let the integrated AI engine format, clean, and generate powerful visualizations automatically.

## ✨ Core Features

- **⚡ Lightning Fast AI Engine**: Powered by Google Gemini, CleanIQ automatically detects data patterns, fixes mismatched types, and handles null values seamlessly.
- **📂 Any Format**: Drag and drop CSV or Excel files of any size.
- **📊 Instant Visualizations**: Turn your clean data into stunning, interactive charts with a single click.
- **💬 Ask Your Data**: Use natural language to ask questions about your datasets and get AI-generated insights and answers instantly.
- **🛡️ Bank-grade Security**: Your data is encrypted at rest and in transit. We never use your private data to train public models.
- **🎨 Premium UI/UX**: Built with modern web design principles featuring smooth animations, glassmorphism, and responsive layouts.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: Google Gemini API

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB connection string
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NEXTER-Soumya/CleanIQ.git
   cd CleanIQ
   ```

2. **Setup the Backend**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `/backend` directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Setup the Frontend**
   ```bash
   cd ../frontend
   npm install
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

4. **Access the App**
   Open `http://localhost:5173` in your browser.

## 🧑‍💻 Developer

**Soumya Biswas** - *Computer Science Engineer*
- **Portfolio**: [biswasoumya.vercel.app](https://biswasoumya.vercel.app/)
- **LinkedIn**: [soumyabiswas2003](https://www.linkedin.com/in/soumyabiswas2003/)

## 📜 License
This project is open-source and available for educational and personal use.
