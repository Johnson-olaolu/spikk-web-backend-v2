import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class MonnifyService {
  constructor(private configService: ConfigService) {}

  private async generateMonnifyToken(): Promise<string> {
    try {
      const clientIDSecretInBase64 = Buffer.from(
        `${this.configService.get('MONNIFY_API_KEY')}:${this.configService.get(
          'MONNIFY_SECRET_KEY',
        )}`,
        'utf8',
      ).toString('base64');
      console.log({
        secretkey: this.configService.get('MONNIFY_API_KEY'),
        apikey: this.configService.get('MONNIFY_SECRET_KEY'),
        clientIDSecretInBase64,
        baseUrl: this.configService.get('MONNIFY_BASE_URL'),
      });
      const headers = {
        // Authorization: `Basic ${clientIDSecretInBase64}`,
        'content-type': 'application/json',
        Authorization: `Basic 
        TUtfVEVTVF9CVjBCRjJNWVlEOkQwSFVXSEdFTlVYQ01TUzcwWUxKQUM0RlEyOUJMWUY2`,
      };
      const response = await axios.post(
        `https://sandbox.monnify.com/api/v1/auth/login`,
        null,
        {
          timeout: 1000 * 60,
          headers,
        },
      );
      console.log(response);
      const { responseBody } = response.data;
      const { accessToken } = responseBody;
      return accessToken;
    } catch (error) {
      console.error(error);
    }
  }

  async initiateDebitTransaction(payload: {
    name: string;
    email: string;
    amount: number;
    paymentReference: string;
    redirectUrl: string;
    paymentDescription: string;
  }) {
    const transactionPayload = {
      amount: payload.amount,
      customerName: payload.name,
      customerEmail: payload.email,
      paymentReference: payload.paymentReference,
      paymentDescription: 'Trial transaction',
      currencyCode: 'NGN',
      contractCode: this.configService.get('MONNIFY_CONTRACT_CODE'),
      redirectUrl: payload.redirectUrl,
      paymentMethods: ['CARD', 'ACCOUNT_TRANSFER'],
    };
    const token = await this.generateMonnifyToken();

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.post(
      `${this.configService.get(
        'MONNIFY_BASE_URL',
      )}/api/v1/merchant/transactions/init-transaction`,
      transactionPayload,
      { headers },
    );
    const { responseBody } = response.data;

    return responseBody;
  }

  async confirmTransaction() {}
}
