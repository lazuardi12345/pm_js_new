import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CREATE_DRAFT_REPEAT_ORDER_REPOSITORY } from '../Domain/Repositories/int/DraftRepeatOrder.repository';
import { DraftRepeatOrderRepositoryImpl } from '../Infrastructure/Repositories/RepeatOrder/RepeatOrder.repository.impl';
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
      provide: CREATE_DRAFT_REPEAT_ORDER_REPOSITORY,
      useClass: DraftRepeatOrderRepositoryImpl,
    },
    CreateDraftRepeatOrderUseCase,
  ],
  controllers: [CreateDraftRepeatOrderController],
  exports: [
    CreateDraftRepeatOrderUseCase,
    CREATE_DRAFT_REPEAT_ORDER_REPOSITORY,
  ],
})
export class DraftRepeatOrderModule {}
