import { RoleTypes } from 'src/utils/constants';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from './permission.entity';

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    // enum: RoleTypes,
  })
  name: RoleTypes;

  @Column()
  description: string;

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Permission[];

  @CreateDateColumn()
  createdAt: Date;
}
