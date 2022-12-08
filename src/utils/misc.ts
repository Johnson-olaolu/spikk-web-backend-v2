import * as moment from 'moment';
import * as uniqid from 'uniqid';

export function generateReference(userName?: string) {
  const presentDate = moment().format('YYYYMMDD');
  const paymentReference = uniqid(
    `${(userName || 'SPIKK').toUpperCase()}-`,
    `-${presentDate}`,
  );
  return paymentReference;
}
