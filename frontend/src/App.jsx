// App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Reservations from './pages/Reservations.jsx';
import Tournaments from './pages/Tournaments.jsx';
import Events from './pages/Events.jsx';
import DashboardAdmin from './pages/DashboardAdmin.jsx';
import BoardGames from './pages/BoardGames.jsx';
import MyReservations from './pages/MyReservations.jsx';
import Profile from './pages/Profile.jsx';
import About from './pages/About.jsx';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/my-reservations" element={<MyReservations />} />
        <Route path="/boardgames" element={<BoardGames />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/events" element={<Events />} />
        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
export default App;