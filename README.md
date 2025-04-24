# SoftwareEngineering_TermProject
소프트웨어공학 텀프로젝트 레포입니다.

# Restaurant Reservation System

## 기능 소개

이 프로젝트는 **식당 예약 시스템**을 구현한 웹 애플리케이션입니다. 사용자는 로그인 후 식당 예약을 할 수 있으며, 자신의 예약 내역을 확인하고, 예약을 취소할 수 있습니다.

### 주요 기능:
1. **회원가입**: 사용자는 이메일과 비밀번호로 회원가입을 할 수 있습니다.
2. **로그인**: 기존 사용자는 이메일과 비밀번호를 이용하여 로그인할 수 있습니다.
3. **예약**: 로그인한 사용자는 사용 가능한 테이블을 선택하고 예약을 할 수 있습니다.
4. **예약 내역 확인**: 사용자는 로그인 후, 자신이 예약한 테이블을 확인할 수 있습니다.
5. **예약 취소**: 사용자는 예약한 테이블을 취소할 수 있습니다.
6. **로그아웃**: 사용자는 언제든지 로그아웃을 할 수 있습니다.

## 프로젝트 디렉토리 구조
```
restaurant-reservation/
├── backend/                  # Flask 백엔드
│   ├── app.py                # Flask 앱 메인 파일 (기능: 회원가입, 로그인, 예약, 취소)
│   ├── models.py             # 데이터베이스 모델 정의 (User, Reservation)
│   ├── routes.py             # API 라우트 정의 (회원가입, 로그인, 예약 등)
│   ├── requirements.txt      # 필요한 Python 라이브러리
│   └── config.py             # 환경 설정 파일
├── frontend/                 # React 프론트엔드
│   ├── public/               # public 폴더 (index.html 등)
│   │   └── index.html        # HTML 템플릿
│   ├── src/                  # React 소스 코드
│   │   ├── App.jsx           # 메인 컴포넌트 (회원가입, 로그인, 예약 관리)
│   │   ├── components/       # 각종 컴포넌트
│   │   │   ├── SignupPage.jsx    # 회원가입 컴포넌트
│   │   │   ├── LoginPage.jsx     # 로그인 컴포넌트
│   │   │   ├── TableList.jsx # 예약된 테이블 목록을 보여주는 컴포넌트
│   │   │   └── ReservationForm.jsx # 예약 폼
│   │   ├── services/         # API 호출을 관리하는 파일
│   │   │   └── api.js        # 백엔드 API 호출 관리
│   │   ├── index.js          # React entry point
│   ├── .gitignore            # Git ignore 파일 (node_modules, build 등)
│   ├── package.json          # React 프로젝트 메타데이터 및 의존성 관리
│   ├── README.md             # 프로젝트 설명 파일
└── .gitignore                # Git ignore 파일 (백엔드와 프론트엔드 공통)
```

## API 설명 및 파라미터

### 1. **POST /api/signup**
- **설명**: 사용자가 회원가입을 할 수 있습니다.
- **요청 바디**:
    ```json
    {
      "name": "사용자 이름",
      "email": "사용자 이메일",
      "password": "사용자 비밀번호"
    }
    ```
- **응답**:
    - 성공:
      ```json
      {
        "message": "User created successfully!"
      }
      ```
    - 실패:
      ```json
      {
        "message": "Error during signup"
      }
      ```

### 2. **POST /api/login**
- **설명**: 사용자가 로그인할 수 있습니다.
- **요청 바디**:
    ```json
    {
      "email": "사용자 이메일",
      "password": "사용자 비밀번호"
    }
    ```
- **응답**:
    - 성공:
      ```json
      {
        "message": "Login successful!",
        "user": {
          "email": "사용자 이메일",
          "name": "사용자 이름",
          "id": "사용자 ID"
        }
      }
      ```
    - 실패:
      ```json
      {
        "message": "Invalid credentials!"
      }
      ```

### 3. **POST /api/reservations**
- **설명**: 사용자가 예약을 추가할 수 있습니다.
- **요청 바디**:
    ```json
    {
      "name": "사용자 이름",
      "phone": "사용자 전화번호",
      "credit_card": "사용자 신용카드 번호",
      "guests": "예약 인원",
      "table_location": "테이블 위치",
      "table_capacity": "테이블 수용 인원",
      "reservation_time": "예약 시간",
      "user_id": "사용자 ID"
    }
    ```
- **응답**:
    - 성공:
      ```json
      {
        "message": "Reservation created successfully!"
      }
      ```
    - 실패:
      ```json
      {
        "message": "Error creating reservation"
      }
      ```

### 4. **GET /api/reservations**
- **설명**: 로그인한 사용자의 예약 내역을 조회할 수 있습니다.
- **쿼리 파라미터**:
    - `user_id`: 사용자의 ID (로그인한 사용자의 예약만 조회)
- **응답**:
    ```json
    [
      {
        "id": "예약 ID",
        "name": "사용자 이름",
        "phone": "사용자 전화번호",
        "credit_card": "사용자 신용카드 번호",
        "guests": "예약 인원",
        "table_location": "테이블 위치",
        "table_capacity": "테이블 수용 인원",
        "reservation_time": "예약 시간"
      },
      ...
    ]
    ```

### 5. **DELETE /api/cancel/{id}**
- **설명**: 예약을 취소할 수 있습니다.
- **URL 파라미터**:
    - `id`: 취소할 예약의 ID
- **응답**:
    - 성공:
      ```json
      {
        "message": "Reservation canceled"
      }
      ```
    - 실패:
      ```json
      {
        "message": "Reservation not found"
      }
      ```