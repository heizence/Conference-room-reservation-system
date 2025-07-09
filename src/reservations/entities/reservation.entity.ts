import { Room } from '../../rooms/entities/room.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  // 예약 시작 시간
  @Column({ type: 'datetime' })
  startTime: Date;

  // 예약 종료 시간
  @Column({ type: 'datetime' })
  endTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  // 예약자 (User와의 다대일 관계)
  // 여러 예약(Many)은 한 명의 사용자(One)에 의해 생성될 수 있다.
  @ManyToOne(() => User, (user) => user.reservations, { eager: true })
  @JoinColumn({ name: 'reserverId' }) // DB에 reserverId 컬럼 생성
  reserver: User;

  // 예약된 회의실 (Room과의 다대일 관계)
  // 여러 예약(Many)은 하나의 회의실(One)에 대해 이루어질 수 있다.
  @ManyToOne(() => Room, (room) => room.reservations, { eager: true })
  @JoinColumn({ name: 'roomId' }) // DB에 roomId 컬럼 생성
  room: Room;

  // 참석자들 (User와의 다대다 관계)
  // 하나의 예약(Many)에 여러 사용자(Many)가 참석할 수 있다.
  @ManyToMany(() => User, { eager: true })
  @JoinTable() // 다대다 관계를 위한 중간 테이블을 자동으로 생성
  attendees: User[];
}
