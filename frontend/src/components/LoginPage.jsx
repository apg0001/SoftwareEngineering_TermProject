import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';  // api.js에서 loginUser import

const LoginPage = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);  // 로그인 에러 메시지 상태
  const navigate = useNavigate();  // 페이지 이동을 위한 navigate 훅

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(formData.email, formData.password);  // 로그인 API 호출
      // console.log(user)
      setUser({ email: formData.email, name: user.data.user.name, id: user.data.user.id });  // 로그인 성공 시 사용자 정보 저장
      navigate('/');  // 로그인 후 메인 페이지로 이동
    } catch (err) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');  // 로그인 실패 시 에러 처리
      console.error(err);  // 에러 출력
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>로그인</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              placeholder="이메일을 입력하세요"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>} {/* 로그인 실패 시 에러 메시지 */}
          <button type="submit" className="btn btn-primary">로그인</button>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <a href="/signup" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
              회원가입
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;