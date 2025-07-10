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
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * @class UsersService
 * @description 사용자와 관련된 비즈니스 로직을 처리하는 서비스 클래스입니다.
 */
@Injectable()
export class UsersService {
  // 생성자에서 User Repository를 의존성 주입(DI) 받습니다.
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * 새로운 사용자를 생성합니다.
   * @param createUserDto 사용자 생성에 필요한 데이터
   * @returns 생성된 사용자 정보
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // 1. 중복 확인: 같은 이메일의 사용자가 이미 존재하는지 확인합니다.
    const existingUser = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    // 2. 엔티티 생성: DTO를 기반으로 새로운 User 엔티티 인스턴스를 만듭니다.
    const newUser = this.usersRepository.create(createUserDto);

    // 3. 데이터베이스 저장: 생성된 엔티티를 데이터베이스에 저장합니다.
    return this.usersRepository.save(newUser);
  }

  /**
   * 모든 사용자 목록을 조회합니다.
   * @returns 모든 사용자 정보의 배열
   */
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * 특정 ID의 사용자를 조회합니다.
   * @param id 조회할 사용자의 ID
   * @returns 조회된 사용자 정보
   */
  async findOne(id: number): Promise<User> {
    // ID를 기준으로 사용자를 찾습니다.
    const user = await this.usersRepository.findOneBy({ id });

    // 사용자가 존재하지 않으면 NotFoundException 예외를 발생시킵니다.
    if (!user) {
      throw new NotFoundException(`ID가 ${id}인 사용자를 찾을 수 없습니다.`);
    }
    return user;
  }

  /**
   * 특정 사용자의 정보를 수정합니다.
   * @param id 수정할 사용자의 ID
   * @param updateUserDto 수정할 데이터
   * @returns 수정된 사용자 정보
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // 1. preload: DB에서 ID에 해당하는 데이터를 찾은 후, 업데이트 DTO의 내용으로 덮어쓴 새로운 엔티티를 반환합니다.
    const user = await this.usersRepository.preload({
      id,
      ...updateUserDto,
    });

    // ID에 해당하는 사용자가 없는 경우 예외를 발생시킵니다.
    if (!user) {
      throw new NotFoundException(`ID가 ${id}인 사용자를 찾을 수 없습니다.`);
    }

    // 2. 데이터베이스 저장: 변경된 내용이 적용된 엔티티를 데이터베이스에 저장합니다.
    return this.usersRepository.save(user);
  }

  /**
   * 특정 사용자를 삭제합니다.
   * @param id 삭제할 사용자의 ID
   * @returns 삭제된 사용자 정보
   */
  async remove(id: number): Promise<User> {
    // 1. 삭제할 사용자를 먼저 조회합니다.
    // findOne 메서드를 재사용하여 '찾을 수 없음' 예외 처리를 일관되게 유지합니다.
    const userToRemove = await this.findOne(id);

    // 2. 엔티티 삭제: 조회된 엔티티를 데이터베이스에서 삭제합니다.
    return this.usersRepository.remove(userToRemove);
  }
}
