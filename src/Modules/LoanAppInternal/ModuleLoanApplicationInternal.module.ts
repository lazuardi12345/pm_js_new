// Presentation/ModuleLoanApplicationInternal.module.ts
import { Module } from '@nestjs/common';
import { AddressInternalModule } from './Modules/address-internal.module';
import { ApprovalInternalModule } from './Modules/approval-internal.module';
import { ClientInternalModule } from './Modules/client-internal.module';
import { CollateralInternalModule } from './Modules/collateral-internal.module';
import { JobInternalModule } from './Modules/job-internal.module';
import { FamilyInternalModule } from './Modules/family-internal.module';
import { LoanApplicationInternalModule } from './Modules/loanApp-internal.module';
import { RelativeInternalModule } from './Modules/relative-internal.module';
import { AddressInternalController } from './Presentation/Controllers/address.controller';
import { ApprovalInternalController } from './Presentation/Controllers/approval.controller';
import { ClientInternalController } from './Presentation/Controllers/client-internal.controller';
import { CollateralInternalController } from './Presentation/Controllers/collateral-internal.controller';
import { FamilyInternalController } from './Presentation/Controllers/family-internal.controller';
import { JobInternalController } from './Presentation/Controllers/job-internal.controller';
import { LoanApplicationInternalController } from './Presentation/Controllers/loanApp-internal.controller';
import { RelativeInternalController } from './Presentation/Controllers/relative-internal.controller';
import { ClientInternalProfileModule } from './Modules/client-internal-profile.module';
import { ClientInternalProfileController } from './Presentation/Controllers/client-internal-profile.controller';

@Module({
  imports: [
    AddressInternalModule,
    ApprovalInternalModule,
    ClientInternalModule,
    ClientInternalProfileModule,
    CollateralInternalModule,
    JobInternalModule,
    FamilyInternalModule,
    LoanApplicationInternalModule,
    RelativeInternalModule,
    // kalau nanti ada module lain (RepeatOrderInternalModule, LoanInternalModule, dll) tinggal ditambahin sini
  ],
  controllers: [
    AddressInternalController,
    ApprovalInternalController,
    ClientInternalController,
    ClientInternalProfileController,
    CollateralInternalController,
    FamilyInternalController,
    JobInternalController,
    LoanApplicationInternalController,
    RelativeInternalController,
  ],
  exports: [
    AddressInternalModule,
    ApprovalInternalModule,
    ClientInternalModule,
    ClientInternalProfileModule,
    CollateralInternalModule,
    JobInternalModule,
    FamilyInternalModule,
    LoanApplicationInternalModule,
  ],
})
export class ModuleLoanApplicationInternal {}
