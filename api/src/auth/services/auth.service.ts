import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable, of } from 'rxjs';
import { User } from 'src/user/entities/user.interface';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJwt(user: User): Observable<string> {
    return from(this.jwtService.signAsync({ user }));
  }

  hashPassword(password: string): Observable<string> {
    console.log(password);
    const hashed = bcrypt.hash(password, 12);
    console.log('PASSWORD', hashed);
    return from<string>(bcrypt.hash(password, 12));
  }

  comparePassword(
    password: string,
    hashPassword: string,
  ): Observable<any | boolean> {
    return of<any | boolean>(bcrypt.compare(password, hashPassword));
  }
}
