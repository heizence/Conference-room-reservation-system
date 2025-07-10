// TypeORM에서 엔티티와 컬럼, 관계를 정의하기 위한 데코레이터들을 가져옵니다.
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
// 관계를 맺을 Reservation 엔티티를 가져옵니다.
import { Reservation } from '../../reservations/entities/reservation.entity';

/**
 * @class Room
 * @description 데이터베이스의 'room' 테이블과 매핑되는 엔티티 클래스입니다.
 * @Entity() 데코레이터는 이 클래스가 데이터베이스 테이블에 대응하는 모델임을 나타냅니다.
 */
@Entity()
export class Room {
  // @PrimaryGeneratedColumn: 기본 키(Primary Key) 컬럼을 정의하며, 값이 자동으로 생성되고 1씩 증가합니다.
  @PrimaryGeneratedColumn()
  id: number;

  // @Column: 데이터베이스 테이블의 일반 컬럼을 정의합니다.
  @Column({ comment: '회의실 이름' })
  name: string;

  @Column({ comment: '회의실 위치 (층)' })
  floor: number;

  @Column({ comment: '최대 수용 인원' })
  capacity: number;

  // @Column({ nullable: true }): 데이터베이스에서 이 컬럼이 NULL 값을 허용하도록 설정합니다.
  @Column({ nullable: true, comment: '상세 위치 (선택 사항)' })
  location: string;

  /**
   * @description 회의실과 예약 간의 일대다(One-to-Many) 관계를 설정합니다.
   * - 하나의 회의실(One)은 여러 개의 예약(Many)을 가질 수 있습니다.
   * - `() => Reservation`: 관계의 대상이 되는 엔티티(Reservation)를 지정합니다.
   * - `(reservation) => reservation.room`: 반대편인 Reservation 엔티티에서 이 Room 엔티티에 접근할 때 사용할 속성(`reservation.room`)을 지정합니다. 이를 통해 양방향 관계가 완성됩니다.
   * - 이 속성은 데이터베이스 컬럼으로 생성되지 않고, 관계를 통해 데이터를 가져올 때 사용됩니다.
   */
  @OneToMany(() => Reservation, (reservation) => reservation.room)
  reservations: Reservation[];
}
