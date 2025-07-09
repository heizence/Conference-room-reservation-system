import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const room = await this.usersRepository.findOneBy({ id });
    if (!room) {
      throw new NotFoundException(`ID가 ${id}인 유저를 찾을 수 없습니다.`);
    }
    return room;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const room = await this.usersRepository.preload({
      id,
      ...updateUserDto,
    });
    if (!room) {
      throw new NotFoundException(`ID가 ${id}인 유저를 찾을 수 없습니다.`);
    }
    return this.usersRepository.save(room);
  }

  async remove(id: number): Promise<User> {
    const roomToRemove = await this.findOne(id);
    return this.usersRepository.remove(roomToRemove);
  }
}
