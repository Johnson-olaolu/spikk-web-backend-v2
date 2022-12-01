import {
  MonnifyTransactionStatuses,
  TransactionTypes,
} from 'src/utils/constants';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { WalletTransaction } from 'src/wallet/entities/walletTransaction.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => Wallet, {
    onDelete: 'CASCADE',
  })
  public wallet: Wallet;

  @OneToOne(() => WalletTransaction, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public walletTransactions: WalletTransaction;

  @Column()
  public transactionType: TransactionTypes;

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
  public amount: number;

  @Column({
    nullable: true,
  })
  public amountPaid: number;

  @Column({
    nullable: true,
  })
  public totalPayable: number;

  @Column({
    nullable: true,
  })
  public cardDetails: string;

  @Column({
    nullable: true,
  })
  public accountDetails: string;

  @Column({
    nullable: true,
  })
  public accountPayments: string;

  @Column({
    nullable: true,
  })
  public paymentMethod: string;

  @Column({
    nullable: false,
  })
  public currency: string;

  @Column({
    nullable: true,
  })
  public settlementAmount: string;

  @Column({
    nullable: true,
  })
  public paymentStatus: MonnifyTransactionStatuses;

  @Column({
    nullable: true,
  })
  public customer: string;

  @Column({
    nullable: true,
  })
  public destinationAccountName: string;

  @Column({
    nullable: true,
  })
  public destinationBankName: string;

  @Column({
    nullable: true,
  })
  public destinationAccountNumber: string;

  @Column({
    nullable: true,
  })
  public destinationBankCode: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
