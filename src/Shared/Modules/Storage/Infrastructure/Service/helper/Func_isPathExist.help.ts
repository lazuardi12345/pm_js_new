// minio-utils.ts

import { Client } from 'minio';
export async function checkPathExists(
  minioClient: Client,
  bucket: string,
  prefix: string,
): Promise<boolean> {
  try {
    const objectsList = minioClient.listObjectsV2(bucket, prefix, false, '');
    for await (const obj of objectsList) {
      if (obj) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error(`Error checking path exists for ${bucket}/${prefix}:`, error);
    return false;
  }
}
