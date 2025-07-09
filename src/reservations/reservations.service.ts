import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Not, Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { User } from '../users/entities/user.entity';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { DeleteReservationDto } from './dto/delete-reservation.dto';
import { Room } from 'src/rooms/entities/room.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const { startTime, endTime, roomId, reserverId, attendeeIds } =
      createReservationDto;

    // 예약 시간이 과거인지 검증
    if (new Date(startTime) < new Date()) {
      throw new BadRequestException(
        '예약 시작 시간은 현재 시간보다 이후여야 합니다.',
      );
    }

    // 시작/종료 시간 순서 검증
    if (endTime <= startTime) {
      throw new BadRequestException(
        '종료 시간은 시작 시간보다 이후여야 합니다.',
      );
    }

    // 회의실 및 예약자 존재 여부 확인
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

    // 중복 예약 확인 (핵심 로직)
    const existingReservation = await this.reservationsRepository.findOne({
      where: {
        room: { id: roomId },
        // (기존 시작 시간 < 새 종료 시간) AND (기존 종료 시간 > 새 시작 시간)
        // 위 조건을 만족하면 시간대가 겹치는 것임
        startTime: LessThan(endTime),
        endTime: MoreThan(startTime),
      },
    });

    if (existingReservation) {
      throw new ConflictException('해당 시간대에 이미 예약이 존재합니다.');
    }

    // 참석자 정보 가져오기
    let attendees: User[] = [];
    if (attendeeIds && attendeeIds.length > 0) {
      attendees = await this.usersRepository.findByIds(attendeeIds);
    }

    // 예약 정보 생성 및 저장
    const newReservation = this.reservationsRepository.create({
      startTime,
      endTime,
      room,
      reserver,
      attendees,
    });

    return this.reservationsRepository.save(newReservation);
  }

  findAll(): Promise<Reservation[]> {
    return this.reservationsRepository.find();
  }

  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.reservationsRepository.findOneBy({ id });
    if (!reservation) {
      throw new NotFoundException(`ID가 ${id}인 예약을 찾을 수 없습니다.`);
    }
    return reservation;
  }

  async update(
    id: number,
    updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    const { requestingUserId, ...dto } = updateReservationDto;

    const reservation = await this.findOne(id);

    // 권한 검사: 요청한 사용자가 예약자인지 확인합니다.
    if (reservation.reserver.id !== requestingUserId) {
      throw new ForbiddenException('예약을 수정할 권한이 없습니다.');
    }

    const newStartTime = dto.startTime || reservation.startTime;
    const newEndTime = dto.endTime || reservation.endTime;

    // 예약 시간이 과거인지 검증
    if (new Date(newStartTime) < new Date()) {
      throw new BadRequestException(
        '예약 시작 시간은 현재 시간보다 이후여야 합니다.',
      );
    }

    // 시작/종료 시간 순서 검증
    if (newEndTime <= newStartTime) {
      throw new BadRequestException(
        '종료 시간은 시작 시간보다 이후여야 합니다.',
      );
    }

    // 수정 시 다른 예약과의 시간 중복 검사
    if (dto.startTime || dto.endTime) {
      const existingReservation = await this.reservationsRepository.findOne({
        where: {
          // '자기 자신을 제외한' 예약들 중에서 같은 회의실에 대해 시간대가 겹치는 예약이 있는지 확인
          id: Not(id),
          room: { id: reservation.room.id },
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

    // 예약 정보 업데이트
    const updatedReservation = await this.reservationsRepository.preload({
      id,
      ...dto,
    });

    if (!updatedReservation) {
      throw new NotFoundException(`ID가 ${id}인 예약을 찾을 수 없습니다.`);
    }

    return this.reservationsRepository.save(updatedReservation);
  }

  async remove(
    id: number,
    deleteReservationDto: DeleteReservationDto,
  ): Promise<Reservation> {
    const reservationToRemove = await this.findOne(id);

    // 권한 검사
    const { requestingUserId } = deleteReservationDto;
    if (reservationToRemove.reserver.id !== requestingUserId) {
      throw new ForbiddenException('예약을 삭제할 권한이 없습니다.');
    }

    return this.reservationsRepository.remove(reservationToRemove);
  }
}
