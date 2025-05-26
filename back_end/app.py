from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timedelta
# models.py에서 db, User, Reservation을 임포트
from models import db, User, Reservation, Table

app = Flask(__name__)
CORS(app)

# DB 설정
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///restaurant.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)  # Flask 앱과 db 연결
# 잘못 추가된 테이블 정보 삭제


def delete_invalid_tables():
    invalid_tables = Table.query.all()  # 모든 테이블 정보 조회
    for table in invalid_tables:
        db.session.delete(table)  # 테이블 삭제
    db.session.commit()  # 삭제된 내용 커밋

# 테이블 정보를 10개 생성하는 함수


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


# 서버 실행 전에 잘못된 테이블 정보를 삭제하고, 테이블을 생성
with app.app_context():
    delete_invalid_tables()  # 잘못된 테이블 정보 삭제
    db.create_all()  # models.py에서 정의된 테이블 생성
    create_tables()

# API로 테이블 정보 제공


@app.route('/api/tables', methods=['GET'])
def get_tables():
    tables = Table.query.all()  # 테이블 정보 조회
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

    # 이메일 중복 확인
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"message": "이미 존재하는 이메일 주소입니다."}), 400  # 중복된 이메일 오류

    # 새로운 사용자 추가
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
    user = User.query.filter_by(
        email=data['email'], password=data['password']).first()
    print(user.id)
    print(user.name)
    print(user.email)
    if user:
        return jsonify({
            "message": "Login successful!",
            "user": {
                "email": user.email,
                "name": user.name,  # 사용자 이름도 반환
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
    print(data)
    user_id = data.get('user_id')  # user_id는 필수 값입니다.

    if not user_id:
        return jsonify({"message": "User ID is required!"}), 400

    reservation_date = datetime.strptime(
        data['reservation_time'], '%Y-%m-%dT%H:%M')
    now = datetime.now()

    if reservation_date > now + timedelta(days=30):
        return jsonify({"message": "You can only reserve within 1 month!"}), 400
    
    if reservation_date < now:
        return jsonify({"message": "지난 날짜 및 시간에는 예약할 수 없습니다."})

    # 중복 예약 체크 (같은 날짜, 시간, 테이블 위치)
    existing_reservation = Reservation.query.filter_by(
        reservation_time=data['reservation_time'],
        table_location=data['table_location']
    ).first()

    if existing_reservation:
        return jsonify({"message": "This table is already reserved at the selected time!"}), 400

    # 예약 추가
    reservation = Reservation(
        name=data['name'],
        phone=data['phone'],
        credit_card=data['credit_card'],
        guests=data['guests'],
        table_location=data['table_location'],
        table_capacity=data['table_capacity'],
        reservation_time=data['reservation_time'],
        user_id=user_id  # user_id 추가
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
    
    # 기본 쿼리 생성
    query = Reservation.query
    
    # 사용자 ID 필터링
    if user_id:
        query = query.filter_by(user_id=user_id)
    
    # 검색어 필터링
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            db.or_(
                Reservation.name.ilike(search_term),
                Reservation.phone.ilike(search_term),
                Reservation.table_location.ilike(search_term)
            )
        )
    
    # 전체 레코드 수 계산
    total_count = query.count()
    total_pages = (total_count + limit - 1) // limit
    
    # 페이지네이션 적용
    reservations = query.order_by(Reservation.reservation_time.desc())\
        .offset((page - 1) * limit)\
        .limit(limit)\
        .all()
        
    print(reservations)

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
            'user_id': r.user_id
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

        # 예약 시간 하루 전까지만 취소 가능
        if reservation_datetime <= now + timedelta(days=1):
            return jsonify({'message': '예약은 최소 하루 전에 취소해야 합니다.'}), 400

        db.session.delete(reservation)
        db.session.commit()
        return jsonify({'message': 'Reservation canceled'}), 200

    return jsonify({'message': 'Reservation not found'}), 404


if __name__ == '__main__':
    app.run(debug=True)