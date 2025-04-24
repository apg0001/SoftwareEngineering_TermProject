import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api/tables';  // 백엔드 API 주소

const TableList = () => {
  const [tables, setTables] = useState([]);
  const [error, setError] = useState('');

  // 테이블 정보 불러오기
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get(API_URL);
        setTables(response.data);
      } catch (err) {
        setError('Error fetching table data');
        console.error(err);
      }
    };

    fetchTables();
  }, []);

  return (
    <div className="table-list">
      <h2>예약 가능한 테이블</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="table-list-container">
        {tables.map((table, index) => (
          <div key={index} className="table-item">
            <p><strong>번호:</strong> {table.id}</p>  {/* 테이블 번호 추가 */}
            <p><strong>위치:</strong> {table.location}</p>
            <p><strong>인원:</strong> 최대 {table.capacity}명</p>
            {/* <button>예약</button> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableList;