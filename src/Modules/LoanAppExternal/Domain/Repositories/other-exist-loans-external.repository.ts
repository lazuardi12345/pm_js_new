// Domain/Repositories/approval-external.repository.ts
import { OtherExistLoansExternal } from "../Entities/other-exist-loans-external.entity";

export const OTHER_EXIST_LOANS_EXTERNAL_REPOSITORY = ' OTHER_EXIST_LOANS_EXTERNAL_REPOSITORY';

export interface IOtherExistLoansExternalRepository {
  findById(id: number): Promise<OtherExistLoansExternal | null>;
  findByNasabahId(nasabahId: number): Promise<OtherExistLoansExternal[]>;
  findAll(): Promise<OtherExistLoansExternal[]>;
  save(address: OtherExistLoansExternal): Promise<OtherExistLoansExternal>;
  update(
    id: number,
    address: Partial<OtherExistLoansExternal>,
  ): Promise<OtherExistLoansExternal>;
  delete(id: number): Promise<void>;
}
