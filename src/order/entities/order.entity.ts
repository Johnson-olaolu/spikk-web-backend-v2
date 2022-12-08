import User from 'src/user/entities/user.entity';
import { OrderStatuses } from 'src/utils/constants';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './orderItem.entity';

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => User)
  public user: User;

  @Column()
  public estimatedAmount: number;

  @Column({
    nullable: true,
  })
  public actualAmount: number;

  @Column()
  public transactionReference: string;

  @Column()
  public status: OrderStatuses;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  public items: OrderItem[];

  @Column()
  public extraInfo: string;

  @Column()
  public pickupAddress: string;

  @Column()
  public deliveryAddress: string;

  @Column()
  public deliveryPrice: number;

  public totalPrice: number;

  @Column({
    nullable: true,
  })
  public picker: string;

  @Column({
    nullable: true,
  })
  public rating: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
