// Domain/Repositories/approval-external.repository.ts
import { CollateralByKedinasanNonMOU } from "../Entities/collateral-kedinasan-non-mou-external.entity";
export const COLLATERAL_KEDINASAN_NON_MOU_EXTERNAL_REPOSITORY = 'COLLATERAL_KEDINASAN_NON_MOU_EXTERNAL_REPOSITORY';

export interface ICollateralByKedinasanNonMouRepository {
  findById(id: number): Promise< CollateralByKedinasanNonMOU  | null>;
  findByPengajuanLuarId(pengajuanLuarId: number): Promise< CollateralByKedinasanNonMOU []>;
  findAll(): Promise< CollateralByKedinasanNonMOU  []>;
  save(address:  CollateralByKedinasanNonMOU  ): Promise< CollateralByKedinasanNonMOU  >;
  update(
    id: number,
    address: Partial< CollateralByKedinasanNonMOU  >,
  ): Promise< CollateralByKedinasanNonMOU  >;
  delete(id: number): Promise<void>;
}
