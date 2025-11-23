import { REQUEST_TYPE } from '../Interface/RequestType.interface';

export function buildFileUrl(
  bucket: string,
  prefix: string,
  filename: string,
  isRepeatOrder: boolean,
): string {
  // Parse prefix: safeCustomerId/safeCustomerName atau safeCustomerId/safeCustomerName/ro-XXXXX
  const parts = prefix.split('/').filter((p) => p.length > 0);

  const safeCustomerId = parts[0];
  const safeCustomerName = parts[1];
  const roFolder = isRepeatOrder && parts[2] ? parts[2] : null;

  const baseUrl = process.env.BACKEND_URI;

  // Determine bucket type from bucket name
  let bucketType: string;
  switch (bucket) {
    case REQUEST_TYPE.INTERNAL:
      bucketType = 'customer-internal';
      break;
    case REQUEST_TYPE.EXTERNAL:
      bucketType = 'customer-external';
      break;
    default:
      bucketType = 'unknown';
  }

  // Build URL based on structure
  if (roFolder) {
    // Repeat Order: storage/{type}/{id}/{name}/{ro-folder}/{filename}
    return `${baseUrl}/storage/${bucketType}/${safeCustomerId}/${safeCustomerName}/${roFolder}/${filename}`;
  } else {
    // Regular: storage/{type}/{id}/{name}/{filename}
    return `${baseUrl}/storage/${bucketType}/${safeCustomerId}/${safeCustomerName}/${filename}`;
  }
}
