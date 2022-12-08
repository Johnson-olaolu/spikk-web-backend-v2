import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  public order: Order;

  @Column()
  public name: string;

  @Column({
    nullable: true,
  })
  public image: string;

  @Column({
    nullable: true,
  })
  public description: string;

  @Column()
  public lowerPriceEstimate: number;

  @Column()
  public higherPriceEstimate: number;

  @Column({
    nullable: true,
  })
  public actualPrice: string;
}
