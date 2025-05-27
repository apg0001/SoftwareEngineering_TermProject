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

// 회원가입 API 호출 (formData 객체 구조 분해 방식)
export const signupUser = async ({ name, email, password, phoneNumber }) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, {
      name,
      email,
      password,
      phone_number: phoneNumber, // phoneNumber는 서버에서 필요할 경우 전달
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
    const response = await axios.post(`${API_URL}/reservations`, reservationData);
    console.log("✅ 예약 요청 성공:", response);  // ✅ 추가
    return response;
  } catch (err) {
    console.error("❌ 예약 요청 실패:", err);  // ✅ 추가
    throw err;
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
