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
  Debit = 'Debit',
  Credit = 'Credit',
}

export enum TransactionStatus {}
