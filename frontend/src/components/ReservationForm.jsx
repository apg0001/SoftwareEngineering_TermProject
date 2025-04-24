import React, { useState } from "react";
import { createReservation } from "../services/api"; // api.js에서 createReservation import

const ReservationForm = ({ user }) => {
  // user를 props로 받습니다.
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    credit_card: "",
    guests: "",
    table_location: "",
    table_capacity: 2, // 예시로 기본 2인용 테이블
    reservation_time: "",
  });

  const [error, setError] = useState(null); // 예약 오류 메시지 상태
  const [success, setSuccess] = useState(null); // 성공 메시지 상태

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !user.id) {
      setError("로그인 후 예약을 진행할 수 있습니다.");
      return;
    }

    // user_id를 추가합니다.
    const reservationData = {
      ...formData,
      user_id: user.id, // 로그인한 사용자의 ID 추가
    };

    console.log(reservationData);

    try {
      // 예약 추가
      const response = await createReservation(reservationData); // createReservation 호출
      if (response.status === 201) {
        setSuccess("Reservation successful!"); // 성공 시 메시지 설정
        setError(null); // 에러 메시지 초기화
      }
    } catch (err) {
      setError("Error during reservation"); // 예약 실패 시 에러 메시지 처리
      setSuccess(null); // 성공 메시지 초기화
      console.error(err); // 에러 출력
    }
  };

  return (
    <div className="reservation-form">
      <h2>Make a Reservation</h2>
      {success && <div className="success-message">{success}</div>}{" "}
      {/* 성공 메시지 표시 */}
      {error && <div className="error-message">{error}</div>}{" "}
      {/* 에러 메시지 표시 */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <input
          type="text"
          placeholder="Credit Card"
          value={formData.credit_card}
          onChange={(e) =>
            setFormData({ ...formData, credit_card: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Guests"
          value={formData.guests}
          onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
        />
        <input
          type="text"
          placeholder="Table Location"
          value={formData.table_location}
          onChange={(e) =>
            setFormData({ ...formData, table_location: e.target.value })
          }
        />
        <input
          type="datetime-local"
          value={formData.reservation_time}
          onChange={(e) =>
            setFormData({ ...formData, reservation_time: e.target.value })
          }
        />
        <button type="submit">Reserve</button>
      </form>
    </div>
  );
};

export default ReservationForm;
