//! MODULE CONTRACTS
import { RepaymentData } from '../Entities/repayment-data.entity';

export const REPAYMENT_DATA_REPOSITORY = 'LOAN_AGREEMENT_REPOSITORY';

export interface IRepaymentDataRepository {
  findById(id: number): Promise<RepaymentData | null>;
  //   findByNasabahId(nasabahId: number): Promise<RepaymentData[]>;
  findAll(): Promise<RepaymentData[]>;
  save(repaymentData: RepaymentData): Promise<RepaymentData>;
  update(id: number, address: Partial<RepaymentData>): Promise<RepaymentData>;
  delete(id: number): Promise<void>;
}
