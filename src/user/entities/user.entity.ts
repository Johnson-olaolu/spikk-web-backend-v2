import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import Profile from './profile.entity';
import { RoleTypes } from 'src/utils/constants';

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column()
  public userName: string;

  @Column({
    unique: true,
  })
  public email: string;

  @Column()
  public password: string;

  @Column({
    default: RoleTypes.Spikker,
  })
  public role: RoleTypes;

  @Column({
    nullable: true,
  })
  public phoneNum?: string;

  @Column({
    nullable: true,
  })
  public resetPasswordToken?: string;

  @Column({
    default: false,
  })
  public isVerified: boolean;

  @Column({
    nullable: true,
  })
  public confirmUserToken?: string;

  @Column({
    nullable: true,
  })
  public tokenTimeToLive?: Date;

  @OneToOne(() => Profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  profile?: Profile;

  async comparePasswords(
    userPassword: string,
    password: string,
  ): Promise<boolean> {
    const result = await bcrypt.compareSync(password, userPassword);
    return result;
  }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default User;
