import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,
  ) {}
  create(createRoomDto: CreateRoomDto): Promise<Room> {
    const newRoom = this.roomsRepository.create(createRoomDto);
    return this.roomsRepository.save(newRoom);
  }

  findAll(): Promise<Room[]> {
    return this.roomsRepository.find();
  }

  async findOne(id: number): Promise<Room> {
    const room = await this.roomsRepository.findOneBy({ id });
    if (!room) {
      throw new NotFoundException(`ID가 ${id}인 회의실을 찾을 수 없습니다.`);
    }
    return room;
  }

  async update(id: number, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const room = await this.roomsRepository.preload({
      id,
      ...updateRoomDto,
    });
    if (!room) {
      throw new NotFoundException(`ID가 ${id}인 회의실을 찾을 수 없습니다.`);
    }
    return this.roomsRepository.save(room);
  }

  async remove(id: number): Promise<Room> {
    const roomToRemove = await this.findOne(id);
    return this.roomsRepository.remove(roomToRemove);
  }
}
