export enum RoleTypes {
  SuperAdmin = 'SuperAdmin',
  Admin = 'Admin',
  Spikker = 'Spikker',
}

export const permissions = [
  //ticket permissions
];

export const BCRYPT_HASH_ROUND = 8;

export enum MYSQL_ERROR_CODES {
  ER_DUP_ENTRY = 'ER_DUP_ENTRY',
}

export enum TransactionTypes {
  MONNIFY_DEBIT = ' MONNIFY_DEBIT',
  MONNIFY_CREDIT = 'MONNIFY_CREDIT',
  ESCROW_CREDIT = 'ESCROW_CREDIT',
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export enum TransactionStatus {
  INITIATED = 'INITIATED',
  CONFIRMED = 'CONFIRMED',
}

export enum MonnifyTransactionStatuses {
  PAID = 'PAID',
  OVERPAID = 'OVERPAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PENDING = 'PENDING',
  ABANDONED = 'ABANDONED',
  CANCELLED = 'CANCELED',
  FAILED = 'FAILED',
  REVERSED = 'REVERSED',
  EXPIRED = 'EXPIRED',
}

export enum OrderStatuses {
  INITIATED = 'INITIATED',
  PAID = 'PAID',
  ACCEPTED = 'ACCEPTED',
  PROCESSING = 'PROCESSING',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELED',
  FAILED = 'FAILED',
}
