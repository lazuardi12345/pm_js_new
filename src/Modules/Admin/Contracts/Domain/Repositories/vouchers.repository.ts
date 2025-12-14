//! MODULE CONTRACTS
import { Vouchers } from '../Entities/vouchers.entity';

export const VOUCHER_REPOSITORY = 'VOUCHER_REPOSITORY';

export interface IVouchersRepository {
  findById(id: number): Promise<Vouchers | null>;
  //   findByNasabahId(nasabahId: number): Promise<Vouchers[]>;
  findAll(): Promise<Vouchers[]>;
  save(Vouchers: Vouchers): Promise<Vouchers>;
  update(id: number, address: Partial<Vouchers>): Promise<Vouchers>;
  delete(id: number): Promise<void>;
}
