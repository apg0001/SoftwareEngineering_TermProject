import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import {
  getReservations,
  createReservation,
  cancelReservation,
} from "./services/api";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import ReservationForm from "./components/ReservationForm";
import TableList from "./components/TableList";
import Header from "./components/Header";
import ReservationPage from "./components/ReservationPage"; // 예약 내역 페이지

function App() {
  const [user, setUser] = useState(null); // 로그인한 사용자의 상태
  const [reservations, setReservations] = useState([]); // 예약 목록
  const [error, setError] = useState(null); // 에러 메시지 상태

  // 예약 목록 불러오기
  const fetchReservations = async () => {
    try {
      const response = await getReservations();
      setReservations(response.data);
    } catch (err) {
      setError("Error fetching reservations");
      console.error(err); // 에러 출력
    }
  };

  // 예약 추가
  const addReservation = async (reservationData) => {
    try {
      await createReservation(reservationData);
      fetchReservations(); // 예약 추가 후 예약 목록 갱신
    } catch (err) {
      setError("Error creating reservation");
      console.error(err); // 에러 출력
    }
  };

  // 예약 취소
  const cancelReservationHandler = async (id) => {
    try {
      await cancelReservation(id);
      fetchReservations(); // 예약 취소 후 예약 목록 갱신
    } catch (err) {
      setError("Error canceling reservation");
      console.error(err); // 에러 출력
    }
  };

  // 로그아웃
  const handleLogout = () => {
    setUser(null); // 로그아웃 시 사용자 정보 초기화
  };

  // 로그인 상태가 바뀔 때마다 예약 목록을 불러옴
  useEffect(() => {
    if (user) {
      fetchReservations();
    }
  }, [user]);

  return (
    <Router>
      <div>
        <Header user={user} handleLogout={handleLogout} />
        {error && <div style={{ color: "red" }}>{error}</div>}{" "}
        {/* 에러 메시지 표시 */}
        <Routes>
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route
            path="/signup"
            element={<SignupPage handleSignup={setUser} />}
          />
          {/* 예약 내역 페이지 */}
          <Route
            path="/reservations"
            element={<ReservationPage user={user} />}
          />{" "}
          {/* 예약 내역 페이지 추가 */}
          <Route
            path="/"
            element={
              user ? (
                <div style={{ textAlign: "center" }}>
                  {/* <h2>{user.name}님 반갑습니다!</h2>  */}
                  <TableList
                    reservations={reservations}
                    cancelReservation={cancelReservationHandler}
                  />
                  <ReservationForm
                    addReservation={addReservation}
                    user={user}
                  />{" "}
                  {/* user 정보를 ReservationForm으로 전달 */}
                </div>
              ) : (
                <div style={{ textAlign: "center" }} className="main-page">
                  <h2>식당 예약 및 예약 확인을 위해 로그인해주세요.</h2>
                  <div className="login-buttons">
                    <Link to="/login">
                      <button>로그인</button>
                    </Link>
                    <Link to="/signup">
                      <button>회원가입</button>
                    </Link>
                  </div>
                </div>
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
