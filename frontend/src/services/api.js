import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api";

// 로그인 API 호출
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response;
  } catch (err) {
    console.error(err);
    alert(err.response ? err.response.data.message : "Login failed");
    throw new Error("Login failed");
  }
};

// 회원가입 API 호출
export const signupUser = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, {
      name,
      email,
      password,
    });
    return response;
  } catch (err) {
    console.error(err);
    alert(err.response ? err.response.data.message : "Signup failed");
    throw new Error("Signup failed");
  }
};

// 예약 추가 API 호출
export const createReservation = async (reservationData) => {
  try {
    const response = await axios.post(
      `${API_URL}/reservations`,
      reservationData
    );
    return response; // 성공 시 응답 반환
  } catch (err) {
    console.error("Error adding reservation", err);
    alert(err.response ? err.response.data.message : "Error adding reservation");
    throw err; // 실패 시 에러 던지기
  }
};

// 예약 목록 가져오기 (페이지네이션, 검색 지원)
export const getReservations = async (page = 1, searchTerm = '', userId = null) => {
  try {
    const response = await axios.get(`${API_URL}/reservations`, {
      params: {
        page,
        search: searchTerm,
        user_id: userId,
        limit: 10
      }
    });
    return response;
  } catch (err) {
    console.error('Error fetching reservations:', err);
    throw new Error(err.response?.data?.message || '예약 목록을 불러오는데 실패했습니다.');
  }
};

// 예약 취소 API 호출
export const cancelReservation = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/cancel/${id}`);
    return response;
  } catch (err) {
    console.error(err);
    alert(err.response ? err.response.data.message : "Canceling reservation failed");
    throw new Error("Canceling reservation failed");
  }
};