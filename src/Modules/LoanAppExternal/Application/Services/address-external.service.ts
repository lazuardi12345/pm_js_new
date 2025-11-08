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
  ) { }

  async create(dto: CreateAddressExternalDto): Promise<AddressExternal> {
    const now = new Date();

       const address = new AddressExternal(
      { id: dto.nasabah_id },
      dto.alamat_ktp,
      dto.rt_rw,
      dto.kelurahan,
      dto.kecamatan,
      dto.kota,
      dto.provinsi,
      dto.status_rumah,
      dto.domisili,
      dto.rumah_domisili,
      undefined,             // id
      now,                   // created_at
      null,                  // deleted_at
      dto.alamat_domisili,
      dto.biaya_perbulan,
      dto.biaya_pertahun,
      dto.biaya_perbulan_domisili,
      dto.biaya_pertahun_domisili,
      dto.lama_tinggal,
      dto.atas_nama_listrik,
      dto.hubungan,
      dto.foto_meteran_listrik,
      dto.share_loc_domisili,
      dto.share_loc_usaha,
      dto.share_loc_tempat_kerja,
      dto.validasi_alamat,
      dto.catatan,
      now,                   // updated_at
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
