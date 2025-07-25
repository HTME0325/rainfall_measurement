import Home from "./pages/Home";
import TrendPage from "./pages/TrendPage";
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import 'leaflet/dist/leaflet.css';



export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/trend" element={<TrendPage />} />
      </Route>
    </Routes>
  )
}
