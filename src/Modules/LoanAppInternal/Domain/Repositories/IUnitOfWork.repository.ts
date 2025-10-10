import { IClientInternalRepository } from "./client-internal.repository";
import { IAddressInternalRepository } from "./address-internal.repository";
import { ICollateralInternalRepository } from "./collateral-internal.repository";
import { IFamilyInternalRepository } from "./family-internal.repository";
import { IJobInternalRepository } from "./job-internal.repository";
import { ILoanApplicationInternalRepository } from "./loanApp-internal.repository";
import { IRelativesInternalRepository } from "./relatives-internal.repository";
import { IApprovalInternalRepository } from "./approval-internal.repository";

export interface IUnitOfWork {
  clientRepo: IClientInternalRepository;
  addressRepo: IAddressInternalRepository;
  approvalRepo: IApprovalInternalRepository
  collateralRepo: ICollateralInternalRepository;
  familyRepo: IFamilyInternalRepository;
  jobRepo: IJobInternalRepository;
  loanAppRepo: ILoanApplicationInternalRepository;
  relativeRepo: IRelativesInternalRepository;

  start<T>(work: () => Promise<T>): Promise<T>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

export const UNIT_OF_WORK = Symbol("UNIT_OF_WORK");
