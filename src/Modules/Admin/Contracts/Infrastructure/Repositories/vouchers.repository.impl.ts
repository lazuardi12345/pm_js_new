// Infrastructure/Repositories/repayment-data.repository.impl.ts
// ! MODULE CONTRACT
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vouchers } from '../../Domain/Entities/vouchers.entity';
import { Vouchers_ORM_Entity } from '../Entities/vouchers.orm-entity';
import { IVouchersRepository } from '../../Domain/Repositories/vouchers.repository';

@Injectable()
export class VouchersRepositoryImpl implements IVouchersRepository {
  constructor(
    @InjectRepository(Vouchers_ORM_Entity)
    private readonly ormRepository: Repository<Vouchers_ORM_Entity>,
  ) {}

  private toDomain(entity: Vouchers_ORM_Entity): Vouchers {
    return new Vouchers(
      entity.nama,
      entity.nik,
      entity.kode_voucher,
      entity.kadaluarsa,
      entity.type ?? undefined,
      entity.saldo ?? undefined,
      entity.is_claim,
      Number(entity.id),
      entity.created_at ?? undefined,
      entity.updated_at ?? undefined,
      entity.deleted_at ?? undefined,
    );
  }

  private toOrm(domain: Vouchers): Partial<Vouchers_ORM_Entity> {
    return {
      id: domain.id ?? undefined,
      nama: domain.nama,
      nik: domain.nik,
      kode_voucher: domain.kode_voucher,
      kadaluarsa: domain.kadaluarsa,
      type: domain.type,
      saldo: domain.saldo,
      is_claim: domain.is_claim,
      created_at: domain.created_at,
      updated_at: domain.updated_at,
      deleted_at: domain.deleted_at,
    };
  }

  private toOrmPartial(
    partial: Partial<Vouchers>,
  ): Partial<Vouchers_ORM_Entity> {
    const orm: Partial<Vouchers_ORM_Entity> = {};

    if (partial.nama !== undefined) orm.nama = partial.nama;
    if (partial.nik !== undefined) orm.nik = partial.nik;
    if (partial.kode_voucher !== undefined)
      orm.kode_voucher = partial.kode_voucher;
    if (partial.kadaluarsa !== undefined) orm.kadaluarsa = partial.kadaluarsa;
    if (partial.type !== undefined) orm.type = partial.type;
    if (partial.saldo !== undefined) orm.saldo = partial.saldo;
    if (partial.is_claim !== undefined) orm.is_claim = partial.is_claim;
    if (partial.created_at !== undefined) orm.created_at = partial.created_at;
    if (partial.updated_at !== undefined) orm.updated_at = partial.updated_at;
    if (partial.deleted_at !== undefined) orm.deleted_at = partial.deleted_at;

    return orm;
  }

  async findById(id: number): Promise<Vouchers | null> {
    const entity = await this.ormRepository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<Vouchers[]> {
    const entities = await this.ormRepository.find();
    return entities.map((e) => this.toDomain(e));
  }

  async save(data: Vouchers): Promise<Vouchers> {
    const ormEntity = this.toOrm(data);
    const saved = await this.ormRepository.save(ormEntity);
    return this.toDomain(saved as Vouchers_ORM_Entity);
  }

  async update(id: number, data: Partial<Vouchers>): Promise<Vouchers> {
    await this.ormRepository.update(id, this.toOrmPartial(data));
    const updated = await this.ormRepository.findOne({ where: { id } });
    if (!updated) throw new Error('Vouchers not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
}
