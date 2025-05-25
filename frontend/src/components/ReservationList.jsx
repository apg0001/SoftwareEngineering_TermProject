import React, { useState, useEffect, useCallback } from 'react';
import { getReservations, cancelReservation } from '../services/api';
import '../App.css';

const ReservationList = ({ user }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getReservations(currentPage, '', user?.id);
      setReservations(response.data.reservations || []);
      setTotalPages(response.data.total_pages || 1);
      setTotalCount(response.data.total_count || 0);
      setError(null);
    } catch (err) {
      setError('예약 목록을 불러오는 중 오류가 발생했습니다.');
      console.error(err);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, user?.id]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleCancel = async (reservationId) => {
    if (window.confirm('예약을 취소하시겠습니까?')) {
      try {
        await cancelReservation(reservationId);
        fetchReservations();
      } catch (err) {
        setError('예약 취소 중 오류가 발생했습니다.');
        console.error(err);
      }
    }
  };

  if (loading && !reservations.length) {
    return (
      <div className="card">
        <div className="card-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>예약 목록을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>예약 목록</h2>
        <p className="text-muted">총 {totalCount}건의 예약</p>
      </div>
      
      <div className="card-content">
        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        ) : reservations.length === 0 ? (
          <div className="empty-state">
            <p>예약 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>예약자</th>
                  <th>날짜</th>
                  <th>시간</th>
                  <th>예약 인원</th>
                  <th>연락처</th>
                  <th>테이블 정보</th>
                  <th>액션</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td>{reservation.name}</td>
                    <td>{new Date(reservation.reservation_time).toLocaleDateString()}</td>
                    <td>{new Date(reservation.reservation_time).toLocaleTimeString()}</td>
                    <td>{reservation.guests}명</td>
                    <td>{reservation.phone}</td>
                    <td>
                      <div className="table-info">
                        <span>위치: {reservation.table_location}</span>
                        <span>최대 수용: {reservation.table_capacity}명</span>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon btn-secondary"
                          onClick={() => handleCancel(reservation.id)}
                        >
                          취소
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="btn btn-primary"
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(p => p - 1)}
            >
              이전
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`btn ${currentPage === page ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button 
              className="btn btn-primary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationList; 