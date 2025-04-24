import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api";

function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지를 위한 상태
  const [successMessage, setSuccessMessage] = useState(""); // 성공 메시지를 위한 상태

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 회원가입 API 호출
      const response = await axios.post(`${API_URL}/signup`, formData);

      if (response.status === 201) {
        setSuccessMessage("Signup successful! Please log in.");
        setErrorMessage(""); // 에러 메시지 초기화
        setFormData({ name: "", email: "", password: "" }); // 폼 데이터 초기화
      }
    } catch (err) {
      setErrorMessage("Error during signup. Please try again.");
      setSuccessMessage(""); // 성공 메시지 초기화
      console.error(err);
    }
  };

  return (
    <div className="login-page">
      <div className="signup-container">
        <h2>회원가입</h2>

        {/* 성공 및 에러 메시지 표시 */}
        {successMessage && (
          <div style={{ color: "green" }}>{successMessage}</div>
        )}
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
          <label htmlFor="email">이름</label>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="form-group">
          <label htmlFor="email">이메일</label>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="form-group">
          <label htmlFor="email">비밀번호</label>
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <button type="submit">회원가입</button>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
