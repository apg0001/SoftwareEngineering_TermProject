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
      setError('Invalid credentials');  // 로그인 실패 시 에러 처리
      console.error(err);  // 에러 출력
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>로그인</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              placeholder="이메일"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          {error && <div className="error-message">{error}</div>} {/* 로그인 실패 시 에러 메시지 */}
          <button type="submit" className="login-btn">로그인</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;