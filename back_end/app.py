import os
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timedelta
from models import db, User, Reservation, Table

# Flask 앱 생성 및 설정
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///restaurant.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
# 잘못 추가된 테이블 정보 삭제More actions


def delete_invalid_tables():
    invalid_tables = Table.query.all()  # 모든 테이블 정보 조회
    for table in invalid_tables:
        db.session.delete(table)  # 테이블 삭제
    db.session.commit()  # 삭제된 내용 커밋
    
    
# 초기 테이블 생성 함수
def create_tables():
    tables = [
        Table(location='창가', capacity=2),
        Table(location='안쪽', capacity=4),
        Table(location='방', capacity=6),
        Table(location='창가', capacity=4),
        Table(location='안쪽', capacity=2),
        Table(location='방', capacity=10),
        Table(location='창가', capacity=2),
        Table(location='안쪽', capacity=4),
        Table(location='방', capacity=8),
        Table(location='창가', capacity=10),
    ]
    db.session.add_all(tables)
    db.session.commit()

# DB 초기화
with app.app_context():
    delete_invalid_tables()  # 잘못된 테이블 정보 삭제
if not os.path.exists('restaurant.db'):
    with app.app_context():
        db.create_all()
        create_tables()


# ✅ 테이블 전체 조회
@app.route('/api/tables', methods=['GET'])
def get_tables():
    tables = Table.query.all()
    return jsonify([{
        'id': t.id,
        'location': t.location,
        'capacity': t.capacity
    } for t in tables])

# ✅ 단일 테이블 조회
@app.route('/api/tables/<int:id>', methods=['GET'])
def get_table(id):
    table = Table.query.get(id)
    if table:
        return jsonify({
            'id': table.id,
            'location': table.location,
            'capacity': table.capacity
        })
    return jsonify({'message': '테이블을 찾을 수 없습니다.'}), 404

# ✅ 회원가입
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "이미 존재하는 이메일 주소입니다."}), 400

    new_user = User(
        name=data['name'],
        email=data['email'],
        password=data['password']
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "회원가입이 완료되었습니다."}), 201

# ✅ 로그인
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email'], password=data['password']).first()
    if user:
        return jsonify({
            "message": "Login successful!",
            "user": {
                "email": user.email,
                "name": user.name,
                "id": user.id
            }
        }), 200
    return jsonify({"message": "Invalid credentials!"}), 401

# ✅ 로그아웃 (토큰 없으므로 단순 반환)
@app.route('/api/logout', methods=['POST'])
def logout():
    return jsonify({"message": "Logout successful!"}), 200

# ✅ 예약 생성
@app.route('/api/reservations', methods=['POST'])
def create_reservation():
    data = request.get_json()
    print(data)
    user_id = data.get('user_id')
    table_id = data.get('table_id')
    reservation_time_str = data.get('reservation_time')

    if not user_id or not table_id:
        return jsonify({"message": "User ID와 Table ID는 필수입니다."}), 400

    try:
        reservation_date = datetime.strptime(reservation_time_str, '%Y-%m-%dT%H:%M')
    except Exception:
        return jsonify({"message": "날짜 형식이 잘못되었습니다. (예: 2025-06-20T18:00)"}), 400

    now = datetime.now()
    if reservation_date > now + timedelta(days=30):
        return jsonify({"message": "한 달 이내의 예약만 가능합니다."}), 400
    if reservation_date < now:
        return jsonify({"message": "지난 날짜 및 시간에는 예약할 수 없습니다."}), 400

    existing = Reservation.query.filter_by(
        reservation_time=reservation_time_str,
        table_id=table_id
    ).first()
    if existing:
        return jsonify({"message": "해당 시간에 이미 예약된 테이블입니다."}), 400

    new_reservation = Reservation(
        name=data['name'],
        phone=data['phone'],
        credit_card=data['credit_card'],
        guests=data['guests'],
        table_location=data['table_location'],
        table_capacity=data['table_capacity'],
        reservation_time=reservation_time_str,
        user_id=user_id,
        table_id=table_id
    )

    try:
        db.session.add(new_reservation)
        db.session.commit()
        return jsonify({"message": "Reservation created successfully!"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error creating reservation: {str(e)}"}), 500

# ✅ 예약 목록 조회 (유저 필터링, 검색, 페이지네이션)
@app.route('/api/reservations', methods=['GET'])
def get_reservations():
    user_id = request.args.get('user_id', type=int)
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    search = request.args.get('search', '')

    query = Reservation.query
    if user_id:
        query = query.filter_by(user_id=user_id)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            db.or_(
                Reservation.name.ilike(search_term),
                Reservation.phone.ilike(search_term),
                Reservation.table_location.ilike(search_term)
            )
        )

    total_count = query.count()
    total_pages = (total_count + limit - 1) // limit
    reservations = query.order_by(Reservation.reservation_time.desc())\
                        .offset((page - 1) * limit)\
                        .limit(limit)\
                        .all()

    return jsonify({
        'reservations': [{
            'id': r.id,
            'name': r.name,
            'phone': r.phone,
            'credit_card': r.credit_card,
            'guests': r.guests,
            'table_location': r.table_location,
            'table_capacity': r.table_capacity,
            'reservation_time': r.reservation_time,
            'user_id': r.user_id,
            'table_id': r.table_id
        } for r in reservations],
        'total_pages': total_pages,
        'current_page': page,
        'total_count': total_count
    })

# ✅ 예약 취소
# @app.route('/api/cancel/<int:id>', methods=['DELETE'])
# def cancel_reservation(id):
#     reservation = Reservation.query.get(id)
#     if not reservation:
#         return jsonify({'message': 'Reservation not found'}), 404

#     now = datetime.now()
#     try:
#         resv_time = reservation.reservation_time
#         if isinstance(resv_time, str):
#             resv_time = datetime.strptime(resv_time, '%Y-%m-%dT%H:%M')
#     except Exception:
#         return jsonify({'message': '예약 시간 파싱 오류'}), 500

#     if resv_time.date() <= now.date():
#         return jsonify({'message': '예약 당일은 취소가 불가능합니다.'}), 400

#     db.session.delete(reservation)
#     db.session.commit()
#     return jsonify({'message': 'Reservation canceled'}), 200
@app.route('/api/cancel/<int:id>', methods=['DELETE'])
def cancel_reservation(id):
    reservation = Reservation.query.get(id)
    if not reservation:
        return jsonify({'message': 'Reservation not found'}), 404

    # 클라이언트에서 전달한 user_id 받기 (쿼리 파라미터 또는 JSON body로 받도록 처리 가능)
    user_id = request.args.get('user_id', type=int)
    if user_id is None:
        # 또는 request.json.get('user_id') 로도 받을 수 있음
        return jsonify({'message': 'User ID is required'}), 400

    # 예약된 user_id와 요청 user_id가 일치하는지 확인
    if reservation.user_id != user_id:
        return jsonify({'message': '권한이 없습니다. (User ID mismatch)'}), 403

    now = datetime.now()
    try:
        resv_time = reservation.reservation_time
        if isinstance(resv_time, str):
            resv_time = datetime.strptime(resv_time, '%Y-%m-%dT%H:%M')
    except Exception:
        return jsonify({'message': '예약 시간 파싱 오류'}), 500

    if resv_time.date() <= now.date():
        return jsonify({'message': '예약 당일은 취소가 불가능합니다.'}), 400

    db.session.delete(reservation)
    db.session.commit()
    return jsonify({'message': 'Reservation canceled'}), 200

# 서버 실행
if __name__ == '__main__':
    app.run(debug=True)
