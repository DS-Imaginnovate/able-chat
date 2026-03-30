# AbleChat - AI Logistics Copilot

**AbleChat** is a high-performance, AI-driven logistics assistant designed specifically for the **FleetEnable** ecosystem. It provides logistics professionals with a seamless, intuitive interface to manage orders, extract document data, and streamline supply chain operations using advanced natural language processing.

## 🚀 Key Features

- **FleetEnable Integration**: Direct connection to your FleetEnable environment for real-time logistics support.
- **Secure Authentication**: Enterprise-grade login and session management powered by Ant Design.
- **Optimistic Chat UI**: Ultra-responsive interaction with real-time feedback and "thinking" indicators.
- **Rich Message Formatting**: Support for comprehensive Markdown responses, including organized lists and bold key information.
- **Intelligent Sidebar**: Effortless navigation through chat history and session management.
- **Premium Aesthetics**: A modern, minimalist interface built with accessibility and productivity in mind.

## 🛠️ Technology Stack

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **UI Framework**: [Ant Design (antd)](https://ant.design/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom CSS for branding
- **Routing**: [React Router v7](https://reactrouter.com/)
- **API Handling**: [Axios](https://axios-http.com/)
- **Formatting**: [React Markdown](https://github.com/remarkjs/react-markdown)

## 📦 Getting Started

### Prerequisites

- Node.js (Latest stable version recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rohitC23/able-chat.git
   cd able-chat
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add your API base URL:
   ```env
   VITE_API_BASE_URL=https://your-api-base-url.com
   ```

### Running Locally

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 📂 Project Structure

- `src/components`: Reusable UI components (Sidebar, Dashboard items).
- `src/context`: Authentication and Chat state management.
- `src/pages`: Main application views (Login, Dashboard).
- `src/services`: API integration layers.
- `src/assets`: Branding and visual assets.

---

Built with ❤️ for **FleetEnable**.
