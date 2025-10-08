// Domain/Repositories/approval-external.repository.ts
import { FinancialDependentsExternal } from "../Entities/financial-dependents-external.entity";

export const FINANCIAL_DEPENDENTS_EXTERNAL_REPOSITORY = 'FINANCIAL_DEPENDENTS_EXTERNAL_REPOSITORY';

export interface IFinancialDependentsExternalRepository {
  findById(id: number): Promise<FinancialDependentsExternal | null>;
  findByNasabahId(nasabahId: number): Promise<FinancialDependentsExternal[]>;
  findAll(): Promise<FinancialDependentsExternal[]>;
  save(address: FinancialDependentsExternal): Promise<FinancialDependentsExternal>;
  update(
    id: number,
    address: Partial<FinancialDependentsExternal>,
  ): Promise<FinancialDependentsExternal>;
  delete(id: number): Promise<void>;
}
