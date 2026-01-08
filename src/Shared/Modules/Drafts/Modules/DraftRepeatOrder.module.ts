import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DRAFT_REPEAT_ORDER_INTERNAL_REPOSITORY } from '../Domain/Repositories/int/DraftRepeatOrder.repository';
import { DraftRepeatOrderExternalRepositoryImpl } from '../Infrastructure/Repositories/RepeatOrderExternal/RepeatOrder.repository.impl';
import { DraftRepeatOrderInternalRepositoryImpl } from '../Infrastructure/Repositories/RepeatOrderInternal/RepeatOrder.repository.impl';
import { CreateDraftRepeatOrderController } from '../Presentations/Controllers/DraftsRepeatOrder.controller';
import { CreateDraftRepeatOrderIntUseCase } from '../Applications/Services/LoanAppInternal/CreateDraftRepeatOrder_Marketing.usecase';
import {
  RepeatOrderInternal,
  RepeatOrderIntSchema,
} from '../Infrastructure/Schemas/LoanAppInternal/RepeatOrder_Marketing.schema';
import { DRAFT_REPEAT_ORDER_EXTERNAL_REPOSITORY } from '../Domain/Repositories/ext/DraftRepeatOrder.repository';
import { CreateDraftRepeatOrderExtUseCase } from '../Applications/Services/LoanAppExternal/CreateDraftRepeatOrder_Marketing.usecase';
import {
  RepeatOrderExternal,
  RepeatOrderExtSchema,
} from '../Infrastructure/Schemas/LoanAppExternal/RepeatOrder_Marketing.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: RepeatOrderInternal.name, schema: RepeatOrderIntSchema },
        { name: RepeatOrderExternal.name, schema: RepeatOrderExtSchema },
      ],
      'mongoConnection',
    ),
  ],
  providers: [
    {
      provide: DRAFT_REPEAT_ORDER_INTERNAL_REPOSITORY,
      useClass: DraftRepeatOrderInternalRepositoryImpl,
    },
    CreateDraftRepeatOrderIntUseCase,
    {
      provide: DRAFT_REPEAT_ORDER_EXTERNAL_REPOSITORY,
      useClass: DraftRepeatOrderExternalRepositoryImpl,
    },
    CreateDraftRepeatOrderExtUseCase,
  ],
  exports: [
    CreateDraftRepeatOrderIntUseCase,
    DRAFT_REPEAT_ORDER_INTERNAL_REPOSITORY,
    CreateDraftRepeatOrderExtUseCase,
    DRAFT_REPEAT_ORDER_EXTERNAL_REPOSITORY,
  ],
})
export class DraftRepeatOrderModule {}
