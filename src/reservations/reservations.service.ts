// NestJS에서 제공하는 기본 데코레이터 및 예외 처리 클래스들을 가져옵니다.
import {
  Injectable, // 서비스 클래스임을 나타냅니다.
  ConflictException, // 리소스 충돌 시 사용 (예: 중복 예약)
  NotFoundException, // 리소스를 찾을 수 없을 때 사용
  ForbiddenException, // 권한이 없을 때 사용
  BadRequestException, // 잘못된 요청일 때 사용
} from '@nestjs/common';
// TypeORM Repository를 주입받기 위한 데코레이터를 가져옵니다.
import { InjectRepository } from '@nestjs/typeorm';
// TypeORM의 쿼리 연산자들을 가져옵니다.
import { LessThan, MoreThan, Not, Repository } from 'typeorm';
// DTO(Data Transfer Object)들을 가져옵니다.
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { User } from '../users/entities/user.entity';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { DeleteReservationDto } from './dto/delete-reservation.dto';
import { Room } from 'src/rooms/entities/room.entity';

/**
 * @class ReservationsService
 * @description 예약과 관련된 비즈니스 로직을 처리하는 서비스 클래스입니다.
 */
@Injectable()
export class ReservationsService {
  // 생성자에서 Repository들을 의존성 주입(DI) 받습니다.
  // 이를 통해 각 엔티티에 대한 데이터베이스 작업을 수행할 수 있습니다.
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * 새로운 예약을 생성합니다.
   * @param createReservationDto 예약 생성에 필요한 데이터
   * @returns 생성된 예약 정보
   */
  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const { startTime, endTime, roomId, reserverId, attendeeIds } =
      createReservationDto;

    // 1. 유효성 검사: 예약 시간이 과거인지 확인합니다.
    if (new Date(startTime) < new Date()) {
      throw new BadRequestException(
        '예약 시작 시간은 현재 시간보다 이후여야 합니다.',
      );
    }

    // 2. 유효성 검사: 종료 시간이 시작 시간보다 이전이거나 같은지 확인합니다.
    if (endTime <= startTime) {
      throw new BadRequestException(
        '종료 시간은 시작 시간보다 이후여야 합니다.',
      );
    }

    // 3. 관련 엔티티 조회: 회의실과 예약자가 실제로 존재하는지 확인합니다.
    const room = await this.roomsRepository.findOneBy({ id: roomId });
    if (!room) {
      throw new NotFoundException(
        `ID가 ${roomId}인 회의실을 찾을 수 없습니다.`,
      );
    }
    const reserver = await this.usersRepository.findOneBy({ id: reserverId });
    if (!reserver) {
      throw new NotFoundException(
        `ID가 ${reserverId}인 사용자를 찾을 수 없습니다.`,
      );
    }

    // 4. 중복 예약 확인 (핵심 로직)
    // 같은 회의실에 대해, 요청된 시간대와 겹치는 예약이 있는지 확인합니다.
    const existingReservation = await this.reservationsRepository.findOne({
      where: {
        room: { id: roomId },
        // 조건: (기존 예약의 시작 시간 < 새로운 예약의 종료 시간) AND (기존 예약의 종료 시간 > 새로운 예약의 시작 시간)
        // 이 두 조건을 모두 만족하면 시간대가 겹치는 것으로 판단합니다.
        startTime: LessThan(endTime), // LessThan -> "미만 (<)"
        endTime: MoreThan(startTime), // MoreThan -> "초과 (>)"
      },
    });

    if (existingReservation) {
      throw new ConflictException('해당 시간대에 이미 예약이 존재합니다.');
    }

    // 5. 참석자 정보 처리: 참석자 ID 목록이 있다면 해당 사용자 정보를 조회합니다.
    let attendees: User[] = [];
    if (attendeeIds && attendeeIds.length > 0) {
      // findByIds는 TypeORM v0.2.x에서 사용되던 메서드입니다. v0.3.x 이상에서는 In 연산자를 사용하는 것이 일반적입니다.
      // 여기서는 findByIds가 여전히 유효하다고 가정합니다.
      attendees = await this.usersRepository.findByIds(attendeeIds);
    }

    // 6. 예약 엔티티 생성 및 저장
    const newReservation = this.reservationsRepository.create({
      startTime,
      endTime,
      room,
      reserver,
      attendees,
    });

    return this.reservationsRepository.save(newReservation);
  }

  /**
   * 모든 예약 목록을 조회합니다.
   */
  findAll(): Promise<Reservation[]> {
    return this.reservationsRepository.find();
  }

  /**
   * 특정 ID의 예약을 조회합니다.
   * @param id 조회할 예약의 ID
   */
  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.reservationsRepository.findOneBy({ id });
    if (!reservation) {
      throw new NotFoundException(`ID가 ${id}인 예약을 찾을 수 없습니다.`);
    }
    return reservation;
  }

  /**
   * 특정 예약을 수정합니다.
   * @param id 수정할 예약의 ID
   * @param updateReservationDto 수정할 데이터
   */
  async update(
    id: number,
    updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    // DTO에서 권한 검증용 ID와 실제 업데이트 데이터를 분리합니다.
    const { requestingUserId, ...dto } = updateReservationDto;

    // 1. 수정할 예약을 먼저 조회합니다. (findOne 재사용)
    const reservation = await this.findOne(id);

    // 2. 권한 검사: 요청을 보낸 사용자가 실제 예약자인지 확인합니다.
    if (reservation.reserver.id !== requestingUserId) {
      throw new ForbiddenException('예약을 수정할 권한이 없습니다.');
    }

    // 3. 시간 유효성 검사 (수정될 시간을 기준으로)
    const newStartTime = dto.startTime || reservation.startTime;
    const newEndTime = dto.endTime || reservation.endTime;

    if (new Date(newStartTime) < new Date()) {
      throw new BadRequestException(
        '예약 시작 시간은 현재 시간보다 이후여야 합니다.',
      );
    }
    if (newEndTime <= newStartTime) {
      throw new BadRequestException(
        '종료 시간은 시작 시간보다 이후여야 합니다.',
      );
    }

    // 4. 중복 예약 확인 (수정 시)
    // 시간 정보(startTime 또는 endTime)가 수정될 경우에만 중복 검사를 수행합니다.
    if (dto.startTime || dto.endTime) {
      const existingReservation = await this.reservationsRepository.findOne({
        where: {
          // '자기 자신(현재 수정 중인 예약)을 제외한' 예약들 중에서
          id: Not(id),
          room: { id: reservation.room.id },
          // 시간대가 겹치는지 확인합니다.
          startTime: LessThan(newEndTime),
          endTime: MoreThan(newStartTime),
        },
      });

      if (existingReservation) {
        throw new ConflictException(
          '해당 시간대에 이미 다른 예약이 존재하여 수정할 수 없습니다.',
        );
      }
    }

    // 5. 예약 정보 업데이트
    // preload: 기존 엔티티에 새로운 데이터를 병합하여 반환합니다. ID에 해당하는 엔티티가 없으면 undefined를 반환합니다.
    const updatedReservation = await this.reservationsRepository.preload({
      id,
      ...dto,
    });

    if (!updatedReservation) {
      throw new NotFoundException(`ID가 ${id}인 예약을 찾을 수 없습니다.`);
    }

    return this.reservationsRepository.save(updatedReservation);
  }

  /**
   * 특정 예약을 삭제합니다.
   * @param id 삭제할 예약의 ID
   * @param deleteReservationDto 삭제 요청자 정보
   */
  async remove(
    id: number,
    deleteReservationDto: DeleteReservationDto,
  ): Promise<Reservation> {
    // 1. 삭제할 예약을 먼저 조회합니다.
    const reservationToRemove = await this.findOne(id);

    // 2. 권한 검사: 요청을 보낸 사용자가 예약자인지 확인합니다.
    const { requestingUserId } = deleteReservationDto;
    if (reservationToRemove.reserver.id !== requestingUserId) {
      throw new ForbiddenException('예약을 삭제할 권한이 없습니다.');
    }

    // 3. 예약 삭제
    // remove는 엔티티 인스턴스를 받아 삭제를 수행하고, 삭제된 엔티티를 반환합니다.
    return this.reservationsRepository.remove(reservationToRemove);
  }
}
