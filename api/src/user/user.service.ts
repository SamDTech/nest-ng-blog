import { UserEntity } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { from, Observable, of } from 'rxjs';
import { User } from './entities/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  create(user: User): Observable<User>{
    return from(this.userRepository.save(user))
  }


  findAll(): Observable<User[]> {
    return from(this.userRepository.find())
  }

  findOne(id: number) {
    return from(this.userRepository.findOneOrFail(id))
  }

  update(id: number, user: User) {
    return from(this.userRepository.update(id, user))
  }

  deleteOne(id: number) {
    return from(this.userRepository.delete(id))
  }
}
