import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity()
export class User {
  // 기본 키(Primary Key) 컬럼이며, 값이 자동으로 1씩 증가
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // 사용자 이름

  // 'email' 컬럼을 생성하며, 중복될 수 없도록 unique 제약 조건을 추가
  @Column({ unique: true })
  email: string; // 사용자 이메일

  // 데이터가 생성될 때의 시간이 자동으로 기록되는 컬럼.
  @CreateDateColumn()
  createdAt: Date;

  // 사용자가 생성한 예약 목록 (일대다 관계)
  // 한 명의 사용자(One)는 여러 예약(Many)을 생성할 수 있다.
  @OneToMany(() => Reservation, (reservation) => reservation.reserver)
  reservations: Reservation[];
}
