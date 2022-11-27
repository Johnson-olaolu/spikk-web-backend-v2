import User from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @OneToOne(() => User)
  @JoinColumn()
  public userId: User;

  @Column()
  public virtualAcctNo: string;

  @Column()
  public virtualAcctBankName: string;

  @Column()
  public virtualAcctNAme: string;

  @Column()
  public balance: number;

  @Column()
  public ledgerBalance: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
