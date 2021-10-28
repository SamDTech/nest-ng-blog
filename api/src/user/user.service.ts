import { AuthService } from './../auth/services/auth.service';
import { UserEntity } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { from, Observable, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { User } from './entities/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private authService: AuthService,
  ) {}

  create(user: User): Observable<User> {
   
    return this.authService.hashPassword(user.password).pipe(
      switchMap((passwordHash: string) => {
        return from(
          this.userRepository.save({ ...user, password: passwordHash }),
        ).pipe(
          map((user: User) => {
            const { password, ...rest } = user;

            return rest;
          }),
          catchError((err) => throwError(() => err)),
        );
      }),
    );
  }

  findAll(): Observable<User[]> {
    return from(this.userRepository.find()).pipe(
      map((users) => {
        users.forEach((user) => {
          delete user.password;
        });

        return users;
      }),
    );
  }

  findOne(id: number) {
    return from(this.userRepository.findOneOrFail(id)).pipe(
      map((user: User) => {
        const { password, ...rest } = user;

        return rest;
      }),
    );
  }

  update(id: number, user: User) {
    delete user.email;
    delete user.password;
    return from(this.userRepository.update(id, user));
  }

  deleteOne(id: number) {
    return from(this.userRepository.delete(id));
  }

  login(user: User): Observable<string> {
    return this.validateUser(user.email, user.password).pipe(
      switchMap((user: User) => {
        if (user) {
          // generate jwt
          return this.authService.generateJwt(user).pipe(map((jwt) => jwt));
        } else {
          return 'Wrong Credentials';
        }
      }),
    );
  }

  validateUser(email: string, password: string): Observable<User> {
    return this.findByMail(email).pipe(
      switchMap((user) =>
        this.authService.comparePassword(password, user.password).pipe(
          map((isMatch: boolean) => {
            if (isMatch) {
              const { password, ...rest } = user;
              return rest;
            } else {
              throw Error;
            }
          }),
        ),
      ),
    );
  }

  findByMail(email: string): Observable<User> {
    return from(this.userRepository.findOne({ email }));
  }
}
