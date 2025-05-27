import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = ({ user }) => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '🎯',
      title: '간편한 예약',
      description: '원하는 날짜와 시간에 맞춰 쉽고 빠르게 예약하세요.'
    },
    {
      icon: '📱',
      title: '예약 관리',
      description: '내 예약 현황을 한눈에 확인하고 관리할 수 있습니다.'
    }
  ];

  const quickMenus = [
    {
      icon: '📝',
      title: '예약하기',
      description: '새로운 예약을 생성하세요',
      link: '/new-reservation'
    },
    {
      icon: '📅',
      title: '예약 관리',
      description: '예약 현황을 확인하고 관리하세요',
      link: '/reservations'
    }
  ];

  return (
    <div className="main-page">
      <div className="container">
        <section className="hero-section">
          <div className="hero-content">
            <h1>태우나라 기찬공주에 오신 것을 환영합니다</h1>
            <p>특별한 순간을 위한 최고의 선택</p>
            {!user && (
              <div className="hero-buttons">
                <button className="btn btn-primary" onClick={() => navigate('/login')}>
                  시작하기
                </button>
                <button className="btn btn-primary" onClick={() => navigate('/signup')}>
                  회원가입
                </button>
              </div>
            )}
          </div>
        </section>

        {user && (
          <section className="quick-menu">
            <h2 className="section-title">빠른 메뉴</h2>
            <div className="quick-menu-cards">
              {quickMenus.map((menu, index) => (
                <div
                  key={index}
                  className="quick-menu-card"
                  onClick={() => navigate(menu.link)}
                >
                  <span className="quick-menu-icon">{menu.icon}</span>
                  <h3>{menu.title}</h3>
                  <p>{menu.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="features">
          <h2 className="section-title">서비스 특징</h2>
          <div className="feature-grid" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card"
                style={{
                  flex: '0 1 300px',
                  background: 'var(--background-dark)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--spacing-lg)',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <span className="feature-icon" style={{ fontSize: '2rem' }}>{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>영업 시간</h3>
            <p>월-금: 11:00 - 21:00</p>
            <p>주말: 11:00 - 22:00</p>
          </div>
          <div className="footer-section">
            <h3>연락처</h3>
            <p>전화: 02-1234-5678</p>
            <p>이메일: info@restaurant.com</p>
          </div>
          <div className="footer-section">
            <h3>위치</h3>
            <p>서울특별시 중구 을지로 123</p>
            <p>태우나라 기찬공주 빌딩 1층</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;
