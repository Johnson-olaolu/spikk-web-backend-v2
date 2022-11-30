import { MonnifyTransactionStatuses } from 'src/utils/constants';

export interface IInitiateCreditResponse {
  transactionReference: string;
  paymentReference: string;
  merchantName: string;
  apiKey: string;
  enabledPaymentMethod: string[];
  checkoutUrl: string;
}

export interface IConfirmPaymentResponse {
  transactionReference: string;
  paymentReference: string;
  amountPaid: string;
  totalPayable: string;
  settlementAmount: string;
  paidOn: Date;
  paymentStatus: MonnifyTransactionStatuses;
  paymentDescription: string;
  currency: string;
  paymentMethod: string;
  product: {
    type: string;
    reference: string;
  };
  cardDetails: {
    cardType: string;
    last4: string;
    expMonth: string;
    expYear: string;
    bin: string;
    bankCode: string;
    bankName: string;
    reusable: boolean;
    countryCode: string;
    cardToken: string;
    supportsTokenization: boolean;
    maskedPan: string;
  };
  accountDetails: any;
  accountPayments: any[];
  customer: { email: string; name: string };
  metaData: Record<string, unknown>;
}
