import { TransactionStatus, TransactionTypes } from 'src/utils/constants';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wallet } from './wallet.entity';

@Entity()
export class WalletTransaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public transactionType: TransactionTypes;

  @Column()
  public transactionStatus: TransactionStatus;

  @Column()
  public amount: number;

  @Column()
  public currency: string;

  @Column()
  public description: string;

  @Column()
  public prevBalance: number;

  @Column()
  public currBalance: number;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  public wallet: Wallet;

  @Column()
  public transactionReference: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
