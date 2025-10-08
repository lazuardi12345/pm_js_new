// // domain/entities/address-internal.entity.ts

// import {
//   StatusRumahEnum,
//   DomisiliEnum,
// } from 'src/Shared/Enums/Internal/Address.enum';
// export class AddressInternal {
//   constructor(
//     public readonly nasabahId: number,
//     public readonly alamatKtp: string,
//     public readonly rtRw: string,
//     public readonly kelurahan: string,
//     public readonly kecamatan: string,
//     public readonly kota: string,
//     public readonly provinsi: string,
//     public readonly statusRumah: StatusRumahEnum,
//     public readonly domisili: DomisiliEnum,
//     public readonly id?: number,
//     public readonly statusRumahKtp?: StatusRumahEnum,
//     public readonly alamatLengkap?: string,
//     public readonly createdAt?: Date,
//     public readonly updatedAt?: Date,
//     public readonly deletedAt?: Date | null,
//   ) {
//     this.ensureAlamatLengkap();
//   }

//   //! Business Rule: Alamat Lengkap harus diisi jika domisili tidak sesuai KTP
//   public ensureAlamatLengkap(): void {
//     if (
//       this.domisili === DomisiliEnum.TIDAK_SESUAI_KTP &&
//       !this.alamatLengkap
//     ) {
//       throw new Error(
//         'Alamat lengkap harus diisi karena domisili tidak sesuai KTP.',
//       );
//     }
//   }

//   //? BUSINESS LOGIC METHOD
//   public isKtpAddressMatch(): boolean {
//     return this.domisili === DomisiliEnum.SESUAI_KTP;
//   }

//   public isOwnedProperty(): boolean {
//     return this.statusRumah === StatusRumahEnum.PRIBADI;
//   }

//   public getFullAddress(): string {
//     return (
//       this.alamatLengkap ||
//       `${this.alamatKtp}, RT/RW ${this.rtRw}, ${this.kelurahan}, ${this.kecamatan}, ${this.kota}, ${this.provinsi}`
//     );
//   }
// }
