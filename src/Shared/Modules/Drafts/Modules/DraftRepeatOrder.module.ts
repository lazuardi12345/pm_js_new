import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DRAFT_REPEAT_ORDER_INTERNAL_REPOSITORY } from '../Domain/Repositories/int/DraftRepeatOrder.repository';
import { DraftRepeatOrderExternalRepositoryImpl } from '../Infrastructure/Repositories/RepeatOrderExternal/RepeatOrder.repository.impl';
import { DraftRepeatOrderInternalRepositoryImpl } from '../Infrastructure/Repositories/RepeatOrderInternal/RepeatOrder.repository.impl';
import { CreateDraftRepeatOrderController } from '../Presentations/Controllers/DraftsRepeatOrder.controller';
import { CreateDraftRepeatOrderIntUseCase } from '../Applications/Services/LoanAppInternal/CreateDraftRepeatOrder_Marketing.usecase';
import {
  RepeatOrder,
  RepeatOrderIntSchema,
} from '../Infrastructure/Schemas/LoanAppInternal/RepeatOrder_Marketing.schema';
import { DRAFT_REPEAT_ORDER_EXTERNAL_REPOSITORY } from '../Domain/Repositories/ext/DraftRepeatOrder.repository';
import { CreateDraftRepeatOrderExtUseCase } from '../Applications/Services/LoanAppExternal/CreateDraftRepeatOrder_Marketing.usecase';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: RepeatOrder.name, schema: RepeatOrderIntSchema }],
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
  controllers: [CreateDraftRepeatOrderController],
  exports: [
    CreateDraftRepeatOrderIntUseCase,
    DRAFT_REPEAT_ORDER_INTERNAL_REPOSITORY,
    CreateDraftRepeatOrderExtUseCase,
    DRAFT_REPEAT_ORDER_EXTERNAL_REPOSITORY,
  ],
})
export class DraftRepeatOrderModule {}
