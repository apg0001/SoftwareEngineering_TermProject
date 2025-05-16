import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import {
  createReservation,
  cancelReservation,
} from "./services/api";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import ReservationForm from "./components/ReservationForm";
import ReservationList from "./components/ReservationList";
import Header from "./components/Header";
import MainPage from "./components/MainPage";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // 예약 추가
  const handleAddReservation = async (reservationData) => {
    try {
      await createReservation(reservationData);
      setError(null);
    } catch (err) {
      setError("예약 생성 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  // 예약 취소
  const handleCancelReservation = async (id) => {
    try {
      await cancelReservation(id);
      setError(null);
    } catch (err) {
      setError("예약 취소 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  // 로그아웃
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="app">
        <Header user={user} handleLogout={handleLogout} />
        
        {error && (
          <div className="alert alert-error" style={{ margin: 'var(--spacing-md)' }}>
            {error}
          </div>
        )}

        <main className="main-content">
          <Routes>
            <Route path="/login" element={
              user ? <Navigate to="/" /> : <LoginPage setUser={setUser} />
            } />
            <Route path="/signup" element={
              user ? <Navigate to="/" /> : <SignupPage />
            } />
            <Route path="/reservations" element={
              user ? (
                <ReservationList 
                  user={user}
                  onCancelReservation={handleCancelReservation}
                />
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/new-reservation" element={
              user ? (
                <ReservationForm 
                  user={user}
                  onAddReservation={handleAddReservation}
                />
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/" element={
              <MainPage user={user} />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
