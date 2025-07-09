import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';

// 이 클래스가 데이터베이스 테이블과 매핑됨을 나타냄
@Entity()
export class Room {
  // 기본 키(Primary Key) 컬럼이며, 값이 자동으로 생성됨
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // 회의실 이름

  @Column()
  floor: number; // 층

  @Column()
  capacity: number; // 최대 수용 인원

  @Column({ nullable: true })
  location: string; // 위치 정보는 선택 사항

  // 해당 회의실에 대한 예약 목록 (일대다 관계)
  // 하나의 회의실(One)은 여러 예약(Many)을 가질 수 있다.
  @OneToMany(() => Reservation, (reservation) => reservation.room)
  reservations: Reservation[];
}
