import { BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

export class WalletTransaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;
}
