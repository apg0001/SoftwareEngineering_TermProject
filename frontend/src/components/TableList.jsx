import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TableList = ({ onTableSelect }) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTableId, setSelectedTableId] = useState(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/tables');
        setTables(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('테이블 정보를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  const handleTableClick = (table) => {
    setSelectedTableId(table.id);
    onTableSelect(table);
  };

  const getTableClass = (table) => {
    return table.id === selectedTableId ? 'table-item table-selected' : 'table-item';
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>테이블 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-content">
          <div className="alert alert-error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>테이블 배치도</h2>
        <p className="text-muted">예약할 테이블을 선택해주세요</p>
      </div>
      <div className="card-content">
        <div className="table-layout">
          {tables.map((table) => (
            <div
              key={table.id}
              className={getTableClass(table)}
              onClick={() => handleTableClick(table)}
            >
              <div className="table-number">{table.id}번</div>
              <div className="table-location">{table.location}</div>
              <div className="table-capacity">{table.capacity}인석</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableList;
