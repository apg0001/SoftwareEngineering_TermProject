import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TableList from './TableList';

const ReservationForm = ({ user, onAddReservation }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    people: '',
    tableLocation: '',
    specialRequests: '',
    name: user?.name || '',
    phone: '',
    credit_card: ''
  });
  const [error, setError] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      setError('로그인이 필요합니다.');
      return;
    }
    try {
      const reservationTime = `${formData.date}T${formData.time}`;
      await onAddReservation({
        ...formData,
        user_id: user.id,
        reservation_time: reservationTime,
        table_location: selectedTable?.location || '',
        table_capacity: selectedTable?.capacity || 0,
        guests: parseInt(formData.people, 10)
      });
      navigate('/reservations');
    } catch (err) {
      setError('예약 생성 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTableSelect = async (table) => {
    try {
      setSelectedTable(table);
      setFormData(prev => ({
        ...prev,
        tableLocation: `${table.location} ${table.id}번`
      }));
    } catch (err) {
      console.error('테이블 정보를 가져오는데 실패했습니다:', err);
    }
  };

  return (
    <div className="reservation-form-container">
      <TableList onTableSelect={handleTableSelect} />
      
      <div className="card">
        <div className="card-header">
          <h2>새로운 예약</h2>
        </div>
        <div className="card-content">
          {error && <div className="alert alert-error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">예약자 이름</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">연락처</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="010-0000-0000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="credit_card">신용카드 번호</label>
              <input
                type="text"
                id="credit_card"
                name="credit_card"
                value={formData.credit_card}
                onChange={handleChange}
                required
                placeholder="0000-0000-0000-0000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">날짜</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">시간</label>
              <select
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              >
                <option value="">시간을 선택하세요</option>
                {Array.from({ length: 8 }, (_, i) => i + 12).map(hour => (
                  <option key={hour} value={`${hour}:00`}>
                    {hour}:00
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="people">인원</label>
              <select
                id="people"
                name="people"
                value={formData.people}
                onChange={handleChange}
                required
              >
                <option value="">인원을 선택하세요</option>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>
                    {num}명
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tableLocation">테이블 위치</label>
              <input
                type="text"
                id="tableLocation"
                name="tableLocation"
                value={formData.tableLocation}
                readOnly
                placeholder="위의 테이블 배치도에서 테이블을 선택해주세요"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="specialRequests">특별 요청사항</label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder="특별한 요청사항이 있다면 입력해주세요"
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                예약하기
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;
