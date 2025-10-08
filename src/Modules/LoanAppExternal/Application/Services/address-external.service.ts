import { Injectable, Inject } from '@nestjs/common';
import {
  IAddressExternalRepository,
  ADDRESS_EXTERNAL_REPOSITORY,
} from '../../Domain/Repositories/address-external.repository';
import { AddressExternal } from '../../Domain/Entities/address-external.entity';
import { CreateAddressExternalDto } from '../DTOS/dto-Address/create-address.dto';
import { UpdateAddressExternalDto } from '../DTOS/dto-Address/update-address.dto';

@Injectable()
export class AddressExternalService {
  constructor(
    @Inject(ADDRESS_EXTERNAL_REPOSITORY)
    private readonly repo: IAddressExternalRepository,
  ) {}

  async create(dto: CreateAddressExternalDto): Promise<AddressExternal> {
    const now = new Date();

    const address = new AddressExternal(
    dto.nasabah_id,                   // nasabahId
    dto.alamat_ktp,                   // alamatKtp
    dto.rt_rw,                        // rtRw
    dto.kelurahan,                    // kelurahan
    dto.kecamatan,                    // kecamatan
    dto.kota,                         // kota
    dto.provinsi,                     // provinsi
    dto.status_rumah,                // statusRumah
    dto.domisili,                    // domisili
    dto.rumah_domisili,              // rumahDomisili
    undefined,                        // id
    dto.alamat_domisili,             // alamatDomisili
    dto.biaya_perbulan,              // biayaPerBulan
    dto.biaya_pertahun,              // biayaPerTahun
    dto.biaya_perbulan_domisili,     // biayaPerBulanDomisili
    dto.biaya_pertahun_domisili,     // biayaPerTahunDomisili
    dto.lama_tinggal,                // lamaTinggal
    dto.atas_nama_listrik,           // atasNamaListrik
    dto.hubungan,                    // hubungan
    dto.foto_meteran_listrik,        // fotoMeteranListrik
    dto.share_loc_link,              // shareLocLink
    dto.validasi_alamat,             // validasiAlamat
    dto.catatan,                     // catatan
    now,                             // createdAt
    now,                             // updatedAt
    null                             // deletedAt
    );
    return this.repo.save(address);
  }

  async update(id: number, dto: UpdateAddressExternalDto): Promise<AddressExternal> {
    return this.repo.update(id, dto);
  }

  async findById(id: number): Promise<AddressExternal | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<AddressExternal[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
