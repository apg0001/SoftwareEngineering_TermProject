import React from "react";
import { Link } from "react-router-dom";

function Header({ user, handleLogout}) {
  return (
    <div
      style={{
        padding: "10px",
        backgroundColor: "#f4f4f4",
        textAlign: "center",
      }}
    >
      <h1>
        <Link to="/" style={{ color: "black", textDecoration: "none" }}>
          기가차니의 심야식당
        </Link>
      </h1>

      {user ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span style={{ marginRight: "10px" }}>{user.name}님 반갑습니다!</span>
          <Link to="/reservations">
            {" "}
            <button className="nav-button">예약 내역 확인</button>{" "}
          </Link>
          <button onClick={handleLogout} className="nav-button">
            로그아웃
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          {/* 로그인 상태가 아닐 때는 버튼들만 표시 */}
        </div>
      )}
    </div>
  );
}

export default Header;
