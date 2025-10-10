import { Injectable, Inject } from '@nestjs/common';
import {
  IAddressInternalRepository,
  ADDRESS_INTERNAL_REPOSITORY,
} from '../../Domain/Repositories/address-internal.repository';
import { AddressInternal } from '../../Domain/Entities/address-internal.entity';
import { CreateAddressDto } from '../DTOS/dto-Address/create-address.dto';
import { UpdateAddressDto } from '../DTOS/dto-Address/update-address.dto';

@Injectable()
export class AddressInternalService {
  constructor(
    @Inject(ADDRESS_INTERNAL_REPOSITORY)
    private readonly repo: IAddressInternalRepository,
  ) {}

  async create(dto: CreateAddressDto): Promise<AddressInternal> {
    const now = new Date();

    const address = new AddressInternal(
      {id: dto.nasabah_id },
      dto.alamat_ktp,
      dto.rt_rw,
      dto.kelurahan,
      dto.kecamatan,
      dto.kota,
      dto.provinsi,
      dto.status_rumah,
      dto.domisili,
      undefined,
      now,
      null,
      dto.status_rumah_ktp,
      dto.alamat_ktp,
      now,
    );
    return this.repo.save(address);
  }

  async update(id: number, dto: UpdateAddressDto): Promise<AddressInternal> {
    return this.repo.update(id, dto);
  }

  async findById(id: number): Promise<AddressInternal | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<AddressInternal[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
