import { RepeatOrderEntity } from '../../Entities/int/DraftRepeatOrder.entity';

export const DRAFT_REPEAT_ORDER_INTERNAL_REPOSITORY = Symbol(
  'CREATE_DRAFT_REPEAT_ORDER_REPOSITORY',
);

export interface IDraftRepeatOrderInternalRepository {
  create(data: Partial<RepeatOrderEntity>): Promise<RepeatOrderEntity>;
  findStatus(
    nik: string,
  ): Promise<{ draft_id: string; isNeedCheck: boolean } | null>;
  findById(id: string): Promise<RepeatOrderEntity | null>;
  findByMarketingId(marketingId: number): Promise<RepeatOrderEntity[]>;
  updateDraftById(
    id: string,
    updateData: Partial<RepeatOrderEntity>,
  ): Promise<{ entity: RepeatOrderEntity | null; isUpdated: boolean }>;
  triggerIsNeedCheckBeingTrue(
    draft_id?: string,
    nominal_pinjaman?: number,
  ): Promise<void>;
  softDelete(id: string): Promise<boolean>;
}
