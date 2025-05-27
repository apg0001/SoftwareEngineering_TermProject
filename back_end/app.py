import os
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timedelta
from models import db, User, Reservation, Table

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///restaurant.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# 🔧 초기 테이블 데이터 설정 함수
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

# 🔧 DB 파일 존재 여부 확인
db_file = 'restaurant.db'
db_exists = os.path.exists(db_file)

# 🔧 DB가 없는 경우에만 초기화
with app.app_context():
    if not db_exists:
        db.create_all()
        create_tables()


@app.route('/api/tables', methods=['GET'])
def get_tables():
    tables = Table.query.all()
    return jsonify([{
        'id': t.id,
        'location': t.location,
        'capacity': t.capacity
    } for t in tables])

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

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"message": "이미 존재하는 이메일 주소입니다."}), 400

    new_user = User(
        name=data['name'],
        email=data['email'],
        password=data['password']
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "회원가입이 완료되었습니다."}), 201

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

@app.route('/api/logout', methods=['POST'])
def logout():
    return jsonify({"message": "Logout successful!"}), 200

@app.route('/api/reservations', methods=['POST'])
def create_reservation():
    data = request.get_json()
    print('[DEBUG] 받은 데이터:', data)  # ✅ 추가

    user_id = data.get('user_id')
    table_id = data.get('table_id')
    print('[DEBUG] user_id:', user_id)   # ✅ 추가
    print('[DEBUG] table_id:', table_id) # ✅ 추가

    ...

    if not user_id or not table_id:
        return jsonify({"message": "User ID와 Table ID는 필수입니다."}), 400

    try:
        reservation_date = datetime.strptime(data['reservation_time'], '%Y-%m-%dT%H:%M')
    except Exception:
        return jsonify({"message": "날짜 형식이 잘못되었습니다."}), 400

    now = datetime.now()
    if reservation_date > now + timedelta(days=30):
        return jsonify({"message": "한 달 이내의 예약만 가능합니다."}), 400
    if reservation_date < now:
        return jsonify({"message": "지난 날짜 및 시간에는 예약할 수 없습니다."}), 400  # 🔧 수정됨

    # 🔧 table_id 기반 중복 예약 체크
    existing_reservation = Reservation.query.filter_by(
        reservation_time=data['reservation_time'],
        table_id=table_id
    ).first()
    if existing_reservation:
        return jsonify({"message": "해당 시간에 이미 예약된 테이블입니다."}), 400

    reservation = Reservation(
        name=data['name'],
        phone=data['phone'],
        credit_card=data['credit_card'],
        guests=data['guests'],
        table_location=data['table_location'],
        table_capacity=data['table_capacity'],
        reservation_time=data['reservation_time'],
        user_id=user_id,
        table_id=table_id  # 🔧 추가
    )

    try:
        db.session.add(reservation)
        db.session.commit()
        return jsonify({"message": "Reservation created successfully!"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error creating reservation: {str(e)}"}), 500


@app.route('/api/reservations', methods=['GET'])
def get_reservations():
    user_id = request.args.get('user_id')
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
        .offset((page - 1) * limit).limit(limit).all()

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
            'table_id': r.table_id  # 🔧 필요 시 프론트에 제공
        } for r in reservations],
        'total_pages': total_pages,
        'current_page': page,
        'total_count': total_count
    })

@app.route('/api/cancel/<int:id>', methods=['DELETE'])
def cancel_reservation(id):
    reservation = Reservation.query.get(id)
    if reservation:
        now = datetime.now()
        reservation_datetime = datetime.strptime(reservation.reservation_time, '%Y-%m-%dT%H:%M')
        if reservation_datetime.date() <= now.date():
            return jsonify({'message': '예약 당일은 취소가 불가능합니다.'}), 400

        db.session.delete(reservation)
        db.session.commit()
        return jsonify({'message': 'Reservation canceled'}), 200

    return jsonify({'message': 'Reservation not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
