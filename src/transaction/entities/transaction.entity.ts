import { Wallet } from 'src/wallet/entities/wallet.entity';
import { WalletTransaction } from 'src/wallet/entities/walletTransaction.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @OneToOne(() => Wallet)
  @JoinColumn()
  public wallet: Wallet;

  @OneToOne(() => WalletTransaction)
  @JoinColumn()
  public walletTransactions: WalletTransaction;

  @Column({
    nullable: true,
  })
  public transactionReference: string;

  @Column()
  public paymentReference: string;

  @Column({
    nullable: true,
  })
  public merchantName: string;

  @Column()
  public enabledPaymentMethod: string;

  @Column({
    nullable: true,
  })
  public product: string;

  @Column({
    nullable: true,
  })
  public paidOn: Date;

  @Column({
    nullable: true,
  })
  public paymentDescription: string;

  @Column({
    nullable: true,
  })
  public metaData: string;

  @Column({
    nullable: true,
  })
  public paymentSourceInformation: string;

  @Column({
    nullable: false,
  })
  public amountPaid: number;

  @Column({
    nullable: false,
  })
  public totalPayable: number;

  @Column({
    nullable: false,
  })
  public cardDetails: number;

  @Column({
    nullable: false,
  })
  public paymentMethod: string;

  @Column({
    nullable: false,
  })
  public currency: string;

  @Column({
    nullable: false,
  })
  public settlementAmount: string;

  @Column({
    nullable: false,
  })
  public paymentStatus: string;

  @Column({
    nullable: false,
  })
  public customer: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
