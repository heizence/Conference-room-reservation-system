-- 사용자 정보를 저장하는 테이블
CREATE TABLE "users" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT (datetime('now')),
    CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")
);

-- 회의실 정보를 저장하는 테이블
CREATE TABLE "rooms" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "name" VARCHAR NOT NULL,
    "floor" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "location" VARCHAR
);

-- 예약 정보를 저장하는 테이블
CREATE TABLE "reservations" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT (datetime('now')),
    "reserverId" INTEGER,
    "roomId" INTEGER,
    FOREIGN KEY("reserverId") REFERENCES "users"("id"),
    FOREIGN KEY("roomId") REFERENCES "rooms"("id")
);

-- 예약과 참석자(사용자)의 다대다 관계를 위한 중간 테이블
CREATE TABLE "reservation_attendees_user" (
    "reservationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    PRIMARY KEY("reservationId", "userId"),
    FOREIGN KEY("reservationId") REFERENCES "reservations"("id") ON DELETE CASCADE,
    FOREIGN KEY("userId") REFERENCES "users"("id") ON DELETE CASCADE
);