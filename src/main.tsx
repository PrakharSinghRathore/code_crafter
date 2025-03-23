
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Create root element
const rootElement = document.getElementById("root");

// Ensure dark mode works with next-themes
if (rootElement) {
  // Add dark mode class for initial rendering
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  createRoot(rootElement).render(<App />);
}
