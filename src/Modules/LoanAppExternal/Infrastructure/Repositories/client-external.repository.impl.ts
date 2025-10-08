import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientExternal } from '../../Domain/Entities/client-external.entity';
import { IClientExternalRepository } from '../../Domain/Repositories/client-external.repository';
import { ClientExternal_ORM_Entity } from '../Entities/client-external.orm-entity';
import { Users_ORM_Entity } from 'src/Modules/Users/Infrastructure/Entities/users.orm-entity';
import { promises } from 'dns';
import { CicilanLainEnum } from 'src/Shared/Enums/External/Other-Exist-Loans.enum';

@Injectable()
export class ClientExternalRepositoryImpl implements IClientExternalRepository {
  constructor(
    @InjectRepository(ClientExternal_ORM_Entity)
    private readonly ormRepository: Repository<ClientExternal_ORM_Entity>,
  ) {}

  // ===================== MAPPER =====================
  private toDomain(ormEntity: ClientExternal_ORM_Entity): ClientExternal {
    return new ClientExternal(
      ormEntity.marketing, // FK marketingId
      ormEntity.nama_lengkap,
      ormEntity.nik,
      ormEntity.no_kk,
      ormEntity.jenis_kelamin,
      ormEntity.tempat_lahir,
      ormEntity.tanggal_lahir,
      ormEntity.no_hp,
      ormEntity.status_nikah,
      ormEntity.email,
      ormEntity.foto_ktp,
      ormEntity.foto_kk,
      ormEntity.dokumen_pendukung,
      ormEntity.validasi_nasabah,
      ormEntity.catatan,
      ormEntity.id,
      ormEntity.created_at ?? new Date(),
      ormEntity.updated_at ?? new Date(),
      ormEntity.deleted_at ?? null,
    );
  }

  private toOrm(domainEntity: ClientExternal): Partial<ClientExternal_ORM_Entity> {
    return {
      id: domainEntity.id,
      marketing: { id: domainEntity.marketing.id } as Users_ORM_Entity,
      nama_lengkap: domainEntity.namaLengkap,
      nik: domainEntity.nik,
      no_kk: domainEntity.noKk,
      jenis_kelamin: domainEntity.jenisKelamin,
      tempat_lahir: domainEntity.tempatLahir,
      tanggal_lahir: domainEntity.tanggalLahir,
      no_hp: domainEntity.noHp,
      status_nikah: domainEntity.statusNikah,
      email: domainEntity.email,
      foto_ktp: domainEntity.fotoKtp,
      foto_kk: domainEntity.fotoKk,
      dokumen_pendukung: domainEntity.dokumenPendukung,
      validasi_nasabah: domainEntity.validasiNasabah,
      catatan: domainEntity.catatan,
      created_at: domainEntity.createdAt,
      updated_at: domainEntity.updatedAt,
      deleted_at: domainEntity.deletedAt,
    };
  }

  private toOrmPartial(partial: Partial<ClientExternal>): Partial<ClientExternal_ORM_Entity> {
    const ormData: Partial<ClientExternal_ORM_Entity> = {};

    if (partial.marketing) ormData.marketing! = { id: partial.marketing.id } as Users_ORM_Entity;
    if (partial.namaLengkap) ormData.nama_lengkap = partial.namaLengkap;
    if (partial.nik) ormData.nik = partial.nik;
    if (partial.noKk) ormData.no_kk = partial.noKk;
    if (partial.jenisKelamin) ormData.jenis_kelamin = partial.jenisKelamin;
    if (partial.tempatLahir) ormData.tempat_lahir = partial.tempatLahir;
    if (partial.tanggalLahir) ormData.tanggal_lahir = partial.tanggalLahir;
    if (partial.noHp) ormData.no_hp = partial.noHp;
    if (partial.statusNikah) ormData.status_nikah = partial.statusNikah;
    if (partial.email) ormData.email = partial.email;
    if (partial.fotoKtp) ormData.foto_ktp = partial.fotoKtp;
    if (partial.fotoKk) ormData.foto_kk = partial.fotoKk;
    if (partial.dokumenPendukung) ormData.dokumen_pendukung = partial.dokumenPendukung;
    if (partial.validasiNasabah !== undefined) ormData.validasi_nasabah = partial.validasiNasabah;
    if (partial.catatan) ormData.catatan = partial.catatan;
    if (partial.createdAt) ormData.created_at = partial.createdAt;
    if (partial.updatedAt) ormData.updated_at = partial.updatedAt;
    if (partial.deletedAt) ormData.deleted_at = partial.deletedAt;

    return ormData;
  }
  // ==================================================

  async findById(id: number): Promise<ClientExternal | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { id },
    });
    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async findByMarketingId(marketingId: number): Promise<ClientExternal[]> {
    const ormEntities = await this.ormRepository.find({
      where: { marketing: { id: marketingId } },
    });
    return ormEntities.map(this.toDomain);
  }

  async findAll(): Promise<ClientExternal[]> {
    const ormEntities = await this.ormRepository.find();
    return ormEntities.map(this.toDomain);
  }

  async save(client_external: ClientExternal): Promise<ClientExternal> {
    const savedOrm = await this.ormRepository.save(client_external);
    return savedOrm;
  }
  

  async update(
    id: number,
    client_externalData: Partial<ClientExternal>,
  ): Promise<ClientExternal> {
    await this.ormRepository.update(id, this.toOrmPartial(client_externalData));
    const updated = await this.ormRepository.findOne({
      where: {id},
      relations: ['marketing'],
    });
    if (!updated) throw new Error('Data not found');
      return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
}
