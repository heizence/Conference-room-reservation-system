// 다른 모듈에 있는 Room과 User 엔티티를 가져옵니다. 이 엔티티들과 관계를 맺게 됩니다.
import { Room } from '../../rooms/entities/room.entity';
import { User } from '../../users/entities/user.entity';
// TypeORM에서 엔티티와 컬럼, 관계를 정의하기 위한 데코레이터들을 가져옵니다.
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

/**
 * @class Reservation
 * @description 데이터베이스의 'reservations' 테이블과 매핑되는 엔티티 클래스입니다.
 * @Entity() 데코레이터는 이 클래스가 TypeORM 엔티티임을 나타냅니다.
 */
@Entity()
export class Reservation {
  // @PrimaryGeneratedColumn: 기본 키(Primary Key) 컬럼을 정의하며, 값이 자동으로 생성되고 1씩 증가합니다.
  @PrimaryGeneratedColumn()
  id: number;

  // @Column: 데이터베이스 테이블의 일반 컬럼을 정의합니다.
  @Column({ type: 'datetime', comment: '예약 시작 시간' })
  startTime: Date;

  @Column({ type: 'datetime', comment: '예약 종료 시간' })
  endTime: Date;

  // @CreateDateColumn: 엔티티가 처음 생성될 때의 타임스탬프를 자동으로 기록합니다.
  @CreateDateColumn({ comment: '예약 생성 일시' })
  createdAt: Date;

  /**
   * @description 예약자와의 관계 (다대일)
   * - 여러 개의 예약(Many)은 한 명의 사용자(One)에 의해 생성될 수 있습니다.
   * - `() => User`: 관계를 맺을 대상 엔티티를 지정합니다.
   * - `(user) => user.reservations`: 반대편(User) 엔티티에서 이 관계에 접근할 때 사용할 속성을 지정합니다.
   * - `{ eager: true }`: Reservation 엔티티를 조회할 때마다 연결된 User(reserver) 정보도 항상 함께 로드합니다. (N+1 문제에 주의해야 합니다)
   */
  @ManyToOne(() => User, (user) => user.reservations, { eager: true })
  // @JoinColumn: 외래 키(Foreign Key)가 생성될 컬럼을 지정합니다. 이 데코레이터가 있는 쪽에 외래 키가 생깁니다.
  @JoinColumn({ name: 'reserverId' }) // DB 테이블에 'reserverId'라는 이름의 컬럼이 생성됩니다.
  reserver: User;

  /**
   * @description 예약된 회의실과의 관계 (다대일)
   * - 여러 개의 예약(Many)은 하나의 회의실(One)에 대해 이루어질 수 있습니다.
   */
  @ManyToOne(() => Room, (room) => room.reservations, { eager: true })
  @JoinColumn({ name: 'roomId' }) // DB 테이블에 'roomId'라는 이름의 컬럼이 생성됩니다.
  room: Room;

  /**
   * @description 참석자들과의 관계 (다대다)
   * - 하나의 예약(Many)에 여러 명의 사용자(Many)가 참석할 수 있습니다.
   * - 반대로, 한 명의 사용자(Many)도 여러 예약(Many)에 참석할 수 있습니다.
   */
  @ManyToMany(() => User, { eager: true })
  // @JoinTable: 다대다 관계를 관리하기 위한 중간 테이블(Junction Table)을 자동으로 생성합니다.
  // 이 테이블은 reservation의 id와 user의 id를 컬럼으로 가집니다.
  @JoinTable({
    name: 'reservation_attendees', // 중간 테이블의 이름을 지정할 수 있습니다.
    joinColumn: { name: 'reservationId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  attendees: User[];
}
