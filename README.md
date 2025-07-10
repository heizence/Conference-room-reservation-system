# 📅 회의실 예약 시스템 (백엔드)

## 1. 프로젝트 개요

이 프로젝트는 NestJS, TypeORM, SQLite를 사용하여 구현한 회의실 예약 시스템의 백엔드 서버입니다. 사용자와 회의실 정보를 관리하고, 지정된 시간에 회의실을 예약하는 기능을 제공합니다.

관계형 데이터베이스의 특성을 활용하여 예약 시간 중복 방지, 사용자 권한 검증 등 실제 서비스에서 마주할 수 있는 복합적인 비즈니스 로직을 구현하는 것을 목표로 합니다.

## 2. 주요 기능

### 🏢 회의실 관리 (`/rooms`)

- 회의실의 생성, 전체/개별 조회, 수정, 삭제 (CRUD) 기능을 제공합니다.
- 각 회의실은 이름, 층, 최대 수용 인원 등의 속성을 가집니다.

### 👤 사용자 관리 (`/users`)

- 사용자의 생성, 전체/개별 조회, 수정, 삭제 (CRUD) 기능을 제공합니다.
- 각 사용자는 이름, 이메일 등의 속성을 가집니다.

### ✅ 예약 관리 (`/reservations`)

- **예약 생성**: 특정 사용자가 특정 회의실을 지정된 시간(`startTime`, `endTime`)에 예약합니다.
- **유효성 검증**:
  - 예약의 종료 시간은 시작 시간보다 이후여야 합니다.
  - 예약의 시작 시간은 현재 시간보다 이후여야 합니다.
- **중복 예약 방지**: 동일한 회의실에 대해 시간대가 겹치는 예약이 이미 존재할 경우, 새로운 예약을 방지합니다.
- **권한 검증**: 예약의 수정 및 삭제는 해당 예약을 등록한 사용자 본인만 가능합니다.

## 3. 기술 스택

- **Framework**: NestJS, TypeScript
- **Database**: SQLite (파일 기반 관계형 데이터베이스)
- **ORM**: TypeORM
- **API Documentation**: Swagger (`@nestjs/swagger`)
- **Containerization**: Docker, Docker Compose

## 4. 시작하기

### 사전 요구사항

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)이 설치되어 있어야 합니다.

### 설치

#### 1. 저장소를 로컬 컴퓨터에 복제(clone)

```bash
git clone <your-repository-url>
```

#### 2. 프로젝트 폴더로 이동

```bash
cd <project-directory>
```

#### 3. 환경변수 생성

프로젝트 root 경로에서 .env 파일을 생성하고 .env.example 에 있는 내용들을 붙여넣기 하여 값을 수정합니다.

#### 4. Docker 실행

Docker 이미지를 빌드하고 컨테이너를 백그라운드에서 실행합니다.

-d 옵션은 터미널을 차지하지 않고 백그라운드에서 실행하도록 합니다.

```bash
docker-compose up --build -d
```

#### 5. 서버 확인

http://localhost:{PORT} 로 접속하여 "Hello, world" 메시지가 잘 출력되는지 확인합니다.

API 문서 (Swagger UI): http://localhost:{PORT}/apidoc

데이터는 프로젝트 루트에 생성되는 db.sqlite 파일에 저장됩니다.(VS Code의 'SQLite' 확장 프로그램 등으로 열어볼 수 있습니다.)

## 부록 - 데이터베이스 Schema

### 테이블 목록

- users
- rooms
- reservations
- reservation_attendees_user

### **users 테이블**

사용자 정보를 저장합니다.

| 컬럼명      | 데이터 타입 | 설명                               | 제약 조건         |
| ----------- | ----------- | ---------------------------------- | ----------------- |
| `id`        | INTEGER     | 사용자 고유 ID                     | Primary Key       |
| `name`      | VARCHAR     | 사용자 이름                        | Not Null          |
| `email`     | VARCHAR     | 사용자 이메일, 로그인 시 사용 가능 | Not Null, Unique  |
| `createdAt` | DATETIME    | 사용자 정보 생성 일시              | Not Null, Default |

### **rooms 테이블**

회의실 정보를 저장합니다.

| 컬럼명     | 데이터 타입 | 설명                | 제약 조건   |
| ---------- | ----------- | ------------------- | ----------- |
| `id`       | INTEGER     | 회의실 고유 ID      | Primary Key |
| `name`     | VARCHAR     | 회의실 이름         | Not Null    |
| `floor`    | INTEGER     | 회의실 위치 (층)    | Not Null    |
| `capacity` | INTEGER     | 최대 수용 인원      | Not Null    |
| `location` | VARCHAR     | 상세 위치 (예: A동) | Nullable    |

### **reservations 테이블**

예약 정보를 저장하며, `users`와 `rooms` 테이블을 연결하는 역할을 합니다.

| 컬럼명       | 데이터 타입 | 설명                         | 제약 조건               |
| ------------ | ----------- | ---------------------------- | ----------------------- |
| `id`         | INTEGER     | 예약 고유 ID                 | Primary Key             |
| `startTime`  | DATETIME    | 예약 시작 시간               | Not Null                |
| `endTime`    | DATETIME    | 예약 종료 시간               | Not Null                |
| `createdAt`  | DATETIME    | 예약 정보 생성 일시          | Not Null, Default       |
| `reserverId` | INTEGER     | 예약을 생성한 사용자 ID (FK) | Foreign Key to users.id |
| `roomId`     | INTEGER     | 예약된 회의실 ID (FK)        | Foreign Key to rooms.id |

### **reservation_attendees_user 테이블**

하나의 예약에 여러 사용자가 참석하는 다대다 관계를 표현하는 Junction Table입니다.

| 컬럼명          | 데이터 타입 | 설명                    | 제약 조건                                   |
| --------------- | ----------- | ----------------------- | ------------------------------------------- |
| `reservationId` | INTEGER     | 예약 ID (FK)            | Primary Key, Foreign Key to reservations.id |
| `userId`        | INTEGER     | 참석하는 사용자 고유 ID |
