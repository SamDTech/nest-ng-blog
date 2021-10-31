 import { RolesGuard } from './../auth/guards/roles.guard';
import { User } from './entities/user.interface';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { hasRole } from 'src/auth/decorator/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { userRole } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() user: User): Observable<User | Object> {
    return this.userService.create(user).pipe(
      map((user: User) => user),
      catchError((err) => of({ error: err.message })),
    );
  }

  @Post('login')
  login(@Body() user: User): Observable<Object> {
    return this.userService.login(user).pipe(
      map((jwt: string) => {
        return { accessToken: jwt };
      }),
    );
  }

  @hasRole(userRole.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(): Observable<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<User> {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() user: User): Observable<any> {
    return this.userService.update(+id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.deleteOne(+id);
  }


  @hasRole(userRole.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/role')
  updateRoleOfUser(@Param('id') id: string, @Body() user: User ): Observable<User>{
    return this.userService.updateRoleOfUser(+id, user)
  }
}
