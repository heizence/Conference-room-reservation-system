// TypeORM에서 엔티티와 컬럼, 관계를 정의하기 위한 데코레이터들을 가져옵니다.
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
// 관계를 맺을 Reservation 엔티티를 가져옵니다.
import { Reservation } from '../../reservations/entities/reservation.entity';

/**
 * @class User
 * @description 데이터베이스의 'user' 테이블과 매핑되는 엔티티 클래스입니다.
 */
@Entity()
export class User {
  // @PrimaryGeneratedColumn: 기본 키(Primary Key) 컬럼을 정의하며, 값이 자동으로 생성되고 1씩 증가합니다.
  @PrimaryGeneratedColumn()
  id: number;

  // @Column: 데이터베이스 테이블의 일반 컬럼을 정의합니다.
  @Column({ comment: '사용자 이름' })
  name: string;

  // @Column({ unique: true }): 데이터베이스에서 이 컬럼의 값이 고유해야 함을 나타내는 제약 조건(unique constraint)을 설정합니다.
  // 동일한 이메일로 중복 가입하는 것을 방지합니다.
  @Column({ unique: true, comment: '사용자 이메일' })
  email: string;

  // @CreateDateColumn: 엔티티가 처음 데이터베이스에 저장될 때의 시간이 자동으로 기록됩니다.
  @CreateDateColumn({ comment: '가입 일시' })
  createdAt: Date;

  /**
   * @description 사용자와 예약 간의 일대다(One-to-Many) 관계를 설정합니다.
   * - 한 명의 사용자(One)는 여러 개의 예약(Many)을 생성할 수 있습니다.
   * - `() => Reservation`: 관계의 대상이 되는 엔티티가 Reservation임을 명시합니다.
   * - `(reservation) => reservation.reserver`: 반대편인 Reservation 엔티티에서 이 User 엔티티에 접근할 때 사용할 속성(`reservation.reserver`)을 지정합니다.
   */
  @OneToMany(() => Reservation, (reservation) => reservation.reserver)
  reservations: Reservation[];
}
