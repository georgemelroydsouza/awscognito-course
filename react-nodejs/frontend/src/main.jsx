import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import Auth from './Auth.jsx';


createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  </Router>
)