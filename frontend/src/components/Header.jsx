import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ user, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <header>
      <div className="header-content">
        <div className="header-left">
          <Link to="/" className="logo">
            <span className="logo-icon">👑</span>
            <h1>태우나라 기찬공주</h1>
          </Link>
        </div>

        <nav className="header-nav">
          {user ? (
            <>
              <Link to="/" className="nav-link">홈</Link>
              <Link to="/reservations" className="nav-link">예약 관리</Link>
            </>
          ) : (
            <Link to="/" className="nav-link">홈</Link>
          )}
        </nav>

        <div className="header-right">
          {user ? (
            <div className="user-menu">
              <span className="user-name">{user.name}님</span>
              <button onClick={handleLogout} className="btn btn-primary btn-sm">
                로그아웃
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button onClick={() => navigate('/login')} className="btn btn-primary btn-sm">
                로그인
              </button>
              <button onClick={() => navigate('/signup')} className="btn btn-primary btn-sm">
                회원가입
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
