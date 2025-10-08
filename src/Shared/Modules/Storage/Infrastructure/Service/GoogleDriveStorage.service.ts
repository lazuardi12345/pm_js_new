// // infrastructure/storage/google-drive-storage.service.ts
// import { IFileStorageService } from '../../domain/services/IFileStorage.service';
// import { google } from 'googleapis';

// export class GoogleDriveStorageService implements IFileStorageService {
//   private drive = google.drive({ version: 'v3', auth: process.env.GOOGLE_API_KEY });

//   async saveFiles(
//     customerId: number,
//     customerName: string,
//     files: Record<string, Express.Multer.File[] | undefined>,
//   ): Promise<Record<string, string[]>> {
//     const savedPaths: Record<string, string[]> = {};

//     for (const [field, fileList] of Object.entries(files)) {
//       if (!fileList) continue;

//       savedPaths[field] = [];

//       for (const file of fileList) {
//         const res = await this.drive.files.create({
//           requestBody: {
//             name: `${customerId}-${customerName}-${file.originalname}`,
//             parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
//           },
//           media: {
//             mimeType: file.mimetype,
//             body: Buffer.from(file.buffer),
//           },
//           fields: 'id',
//         });

//         savedPaths[field].push(`https://drive.google.com/uc?id=${res.data.id}`);
//       }
//     }

//     return savedPaths;
//   }
// }
