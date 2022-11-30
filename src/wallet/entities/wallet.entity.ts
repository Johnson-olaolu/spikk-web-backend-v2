import User from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WalletTransaction } from './walletTransaction.entity';

@Entity()
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @OneToOne(() => User, (user) => user.wallet, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public user: User;

  @Column({
    nullable: true,
  })
  public virtualAcctNo: string;

  @Column({
    nullable: true,
  })
  public virtualAcctBankName: string;

  @Column({
    nullable: true,
  })
  public virtualAcctNAme: string;

  @Column({
    default: 0,
  })
  public balance: number;

  @Column({
    default: 0,
  })
  public ledgerBalance: number;

  @OneToMany(
    () => WalletTransaction,
    (walletTransaction) => walletTransaction.wallet,
  )
  public transactions: WalletTransaction[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
