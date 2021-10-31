import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum userRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  CHIEF_EDITOR = 'chief_editor',
  USER = 'user',
}

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: userRole, default: userRole.USER })
  role: userRole;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
