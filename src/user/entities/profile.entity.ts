import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user.entity';

@Entity()
class Profile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column(() => User)
  @JoinColumn()
  public user: User;

  @Column()
  public profile_image: string;

  @Column()
  public address: string;
}
export default Profile;
