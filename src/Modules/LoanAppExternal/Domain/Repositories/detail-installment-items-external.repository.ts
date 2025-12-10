// Domain/Repositories/approval-external.repository.ts
import { DetailInstallmentItemsExternal } from '../Entities/detail-installment-items-external.entity';

export const DETAIL_INSTALLMENT_ITEMS_EXTERNAL_REPOSITORY =
  'DETAIL_INSTALLMENT_ITEMS_EXTERNAL_REPOSITORY';

export interface IDetailInstallmentItemsExternalRepository {
  findById(id: number): Promise<DetailInstallmentItemsExternal | null>;
  findByOtherExistId(
    otherExistLoanId: number,
  ): Promise<DetailInstallmentItemsExternal[]>;
  findAll(): Promise<DetailInstallmentItemsExternal[]>;
  save(
    detailInstallments: DetailInstallmentItemsExternal,
  ): Promise<DetailInstallmentItemsExternal>;
  update(
    id: number,
    detailInstallments: Partial<DetailInstallmentItemsExternal>,
  ): Promise<DetailInstallmentItemsExternal>;
  delete(id: number): Promise<void>;
}
