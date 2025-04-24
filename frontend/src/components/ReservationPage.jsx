import React, { useEffect, useState } from "react";
import { getReservations, cancelReservation } from "../services/api"; // API 호출 함수
import { Link } from "react-router-dom"; // 홈 화면으로 이동하기 위한 Link

const ReservationPage = ({ user }) => {
  // user를 props로 받습니다.
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear(); // 년도
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월
    const day = String(date.getDate()).padStart(2, "0"); // 날짜
    const hours = String(date.getHours()).padStart(2, "0"); // 시간
    const minutes = String(date.getMinutes()).padStart(2, "0"); // 분

    return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
  };

  // 예약 목록 불러오기
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await getReservations(user.id); // 로그인한 사용자만의 예약 정보를 요청
        setReservations(response.data); // 예약 목록 저장
      } catch (err) {
        setError("Error fetching reservations"); // 에러 처리
        console.error(err); // 에러 출력
      }
    };
    if (user) {
      fetchReservations();
    }
  }, [user]);

  // 예약 취소 처리
  const handleCancel = async (id) => {
    try {
      await cancelReservation(id); // 예약 취소 API 호출
      setReservations(
        reservations.filter((reservation) => reservation.id !== id)
      ); // 취소된 예약 삭제
    } catch (err) {
      setError("Error canceling reservation"); // 취소 실패 시 에러 처리
      console.error(err); // 에러 출력
    }
  };

  return (
    <div className="reservation-page">
      <h2>나의 예약 내역</h2>
      {error && <div className="error-message">{error}</div>}{" "}
      {/* 에러 메시지 표시 */}
      {reservations.length === 0 ? (
        <div>
          <p>예약 내역이 없어요!</p>
          <Link to="/">
            <button className="go-home-button">예약하러 가기</button>
          </Link>
        </div> // 예약이 없을 때 홈 화면으로 이동할 수 있는 버튼 표시
      ) : (
        <table className="reservation-table">
          <thead>
            <tr>
              <th>테이블 번호</th>
              <th>예약 인원 수</th>
              <th>예약 날짜 및 시간</th>
              <th>취소하기</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.table_location}</td>
                <td>{reservation.guests}</td>
                <td>{formatDate(reservation.reservation_time)}</td>{" "}
                {/* 날짜 포맷팅 적용 */}
                <td>
                  <button
                    className="cancel-button"
                    onClick={() => handleCancel(reservation.id)}
                  >
                    취소
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReservationPage;
