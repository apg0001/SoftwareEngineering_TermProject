from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# 유저 모델
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)

# 예약 모델
class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    phone = db.Column(db.String(20))
    credit_card = db.Column(db.String(20))
    guests = db.Column(db.Integer)
    table_location = db.Column(db.String(50))
    table_capacity = db.Column(db.Integer)
    reservation_time = db.Column(db.String(20))

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('reservations', lazy=True))

    # 🔧 추가된 부분
    table_id = db.Column(db.Integer, db.ForeignKey('table.id'), nullable=False)
    table = db.relationship('Table', backref=db.backref('reservations', lazy=True))

# 테이블 모델
class Table(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(50), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"<Table {self.location}, Capacity {self.capacity}>"
