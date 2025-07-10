// NestJS에서 제공하는 기본 데코레이터 및 예외 처리 클래스들을 가져옵니다.
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
// TypeORM Repository를 주입받기 위한 데코레이터를 가져옵니다.
import { InjectRepository } from '@nestjs/typeorm';
// TypeORM의 Repository 클래스를 가져옵니다.
import { Repository } from 'typeorm';
// DTO(Data Transfer Object)들을 가져옵니다.
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
// Room 엔티티를 가져옵니다.
import { Room } from './entities/room.entity';

/**
 * @class RoomsService
 * @description 회의실과 관련된 비즈니스 로직을 처리하는 서비스 클래스입니다.
 */
@Injectable()
export class RoomsService {
  // 생성자에서 Room Repository를 의존성 주입(DI) 받습니다.
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,
  ) {}

  /**
   * 새로운 회의실을 생성합니다.
   * @param createRoomDto 회의실 생성에 필요한 데이터
   * @returns 생성된 회의실 정보
   */
  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    // 1. 중복 확인: 같은 이름의 회의실이 이미 존재하는지 확인합니다.
    const existingRoom = await this.roomsRepository.findOneBy({
      name: createRoomDto.name,
    });
    if (existingRoom) {
      throw new ConflictException('이미 같은 이름의 회의실이 존재합니다.');
    }

    // 2. 엔티티 생성: DTO를 기반으로 새로운 Room 엔티티 인스턴스를 만듭니다.
    const newRoom = this.roomsRepository.create(createRoomDto);

    // 3. 데이터베이스 저장: 생성된 엔티티를 데이터베이스에 저장합니다.
    return this.roomsRepository.save(newRoom);
  }

  /**
   * 모든 회의실 목록을 조회합니다.
   * @returns 모든 회의실 정보의 배열
   */
  findAll(): Promise<Room[]> {
    return this.roomsRepository.find();
  }

  /**
   * 특정 ID의 회의실을 조회합니다.
   * @param id 조회할 회의실의 ID
   * @returns 조회된 회의실 정보
   */
  async findOne(id: number): Promise<Room> {
    // ID를 기준으로 회의실을 찾습니다.
    const room = await this.roomsRepository.findOneBy({ id });

    // 회의실이 존재하지 않으면 NotFoundException 예외를 발생시킵니다.
    if (!room) {
      throw new NotFoundException(`ID가 ${id}인 회의실을 찾을 수 없습니다.`);
    }
    return room;
  }

  /**
   * 특정 회의실의 정보를 수정합니다.
   * @param id 수정할 회의실의 ID
   * @param updateRoomDto 수정할 데이터
   * @returns 수정된 회의실 정보
   */
  async update(id: number, updateRoomDto: UpdateRoomDto): Promise<Room> {
    // 1. preload: DB에서 ID에 해당하는 데이터를 찾은 후, 업데이트 DTO의 내용으로 덮어쓴 새로운 엔티티를 반환합니다.
    // 만약 ID에 해당하는 데이터가 없으면 undefined를 반환합니다.
    const room = await this.roomsRepository.preload({
      id,
      ...updateRoomDto,
    });

    // ID에 해당하는 회의실이 없는 경우 예외를 발생시킵니다.
    if (!room) {
      throw new NotFoundException(`ID가 ${id}인 회의실을 찾을 수 없습니다.`);
    }

    // 2. 데이터베이스 저장: 변경된 내용이 적용된 엔티티를 데이터베이스에 저장합니다.
    return this.roomsRepository.save(room);
  }

  /**
   * 특정 회의실을 삭제합니다.
   * @param id 삭제할 회의실의 ID
   * @returns 삭제된 회의실 정보
   */
  async remove(id: number): Promise<Room> {
    // 1. 삭제할 회의실을 먼저 조회합니다.
    // findOne 메서드를 재사용하여 '찾을 수 없음' 예외 처리를 일관되게 유지합니다.
    const roomToRemove = await this.findOne(id);

    // 2. 엔티티 삭제: 조회된 엔티티를 데이터베이스에서 삭제합니다.
    return this.roomsRepository.remove(roomToRemove);
  }
}
