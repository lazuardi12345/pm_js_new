// Func_ParseURL.help.ts
import { EncKey } from './Func_EncKey.help';

/**
 * Parse file URL atau customer ID untuk detect RO path
 */
export function parseFileUrl(
  input: string,
  encKey: EncKey, // ← Pass encKey instance
): {
  customerId: string;
  customerName: string;
  isRepeatOrder: boolean;
  roFolder?: string;
} {
  // Check if input is URL
  if (input.includes('http://') || input.includes('https://')) {
    return parseUrlPath(input, encKey); // ← Pass encKey
  }

  return {
    customerId: input,
    customerName: '',
    isRepeatOrder: false,
  };
}

// Func_ParseURL.help.ts

/**
 * Parse full URL untuk extract path info
 */
export function parseUrlPath(
  url: string,
  encKey: EncKey,
): {
  customerId: string;
  customerName: string;
  isRepeatOrder: boolean;
  roFolder?: string;
  originalFilename?: string; // ← NEW
} {
  const storageMatch = url.match(
    /\/storage\/([^/]+)\/([^/]+)(?:\/([^/]+))?(?:\/([^/]+))?/,
  );

  if (!storageMatch) {
    throw new Error('Invalid storage URL format');
  }

  const bucket = storageMatch[1];
  const encryptedPrefix = storageMatch[2];
  const segment2 = storageMatch[3];
  const segment3 = storageMatch[4];

  const isRO = segment2?.startsWith('ro-');
  const roFolder = isRO ? segment2 : undefined;

  const originalFilename = isRO ? segment3 : segment2;

  console.log('🔍 RO Detection:', { isRO, roFolder });
  const dotIndex = encryptedPrefix.indexOf('.');

  if (dotIndex === -1) {
    throw new Error('Invalid encrypted prefix format (no length prefix found)');
  }

  const lengthStr = encryptedPrefix.substring(0, dotIndex);
  const idLength = parseInt(lengthStr, 10);

  if (isNaN(idLength)) {
    throw new Error('Invalid length prefix');
  }
  const combinedEncrypted = encryptedPrefix.substring(dotIndex + 1);
  const encId = combinedEncrypted.substring(0, idLength);
  const encName = combinedEncrypted.substring(idLength);

  console.log('🔍 Parsed with length prefix:', {
    lengthPrefix: idLength,
    encId,
    encName,
  });

  let plainCustomerId: string;
  let plainCustomerName: string;

  try {
    plainCustomerId = encKey.decryptString({
      encrypted: Buffer.from(encId, 'base64url'),
    });

    plainCustomerName = encKey.decryptString({
      encrypted: Buffer.from(encName, 'base64url'),
    });

    console.log('🔍 Decrypted:', { plainCustomerId, plainCustomerName });
  } catch (error) {
    console.error('## Decryption failed:', error);
    throw new Error('Failed to decrypt customer info from URL');
  }

  return {
    customerId: plainCustomerId,
    customerName: plainCustomerName,
    isRepeatOrder: isRO,
    roFolder: roFolder,
    originalFilename: originalFilename, // ← NEW
  };
}
