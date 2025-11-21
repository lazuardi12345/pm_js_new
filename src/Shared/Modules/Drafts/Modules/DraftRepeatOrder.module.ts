import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DRAFT_REPEAT_ORDER_INTERNAL_REPOSITORY } from '../Domain/Repositories/int/DraftRepeatOrder.repository';
import { DraftRepeatOrderRepositoryImpl } from '../Infrastructure/Repositories/RepeatOrderInternal/RepeatOrder.repository.impl';
import { CreateDraftRepeatOrderController } from '../Presentations/Controllers/DraftsRepeatOrder.controller';
import { CreateDraftRepeatOrderUseCase } from '../Applications/Services/LoanAppInternal/CreateDraftRepeatOrder_Marketing.usecase';
import {
  RepeatOrder,
  RepeatOrderSchema,
} from '../Infrastructure/Schemas/LoanAppInternal/RepeatOrder_Marketing.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: RepeatOrder.name, schema: RepeatOrderSchema }],
      'mongoConnection',
    ),
  ],
  providers: [
    {
      provide: DRAFT_REPEAT_ORDER_INTERNAL_REPOSITORY,
      useClass: DraftRepeatOrderRepositoryImpl,
    },
    CreateDraftRepeatOrderUseCase,
  ],
  controllers: [CreateDraftRepeatOrderController],
  exports: [
    CreateDraftRepeatOrderUseCase,
    DRAFT_REPEAT_ORDER_INTERNAL_REPOSITORY,
  ],
})
export class DraftRepeatOrderModule {}
