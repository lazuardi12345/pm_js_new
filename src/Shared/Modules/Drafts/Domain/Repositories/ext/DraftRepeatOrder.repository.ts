import { RepeatOrderExternalEntity } from '../../Entities/ext/DraftRepeatOrder.entity';

export const DRAFT_REPEAT_ORDER_EXTERNAL_REPOSITORY = Symbol(
  'DRAFT_REPEAT_ORDER_EXTERNAL_REPOSITORY',
);

export interface IDraftRepeatOrderExternalRepository {
  create(
    data: Partial<RepeatOrderExternalEntity>,
  ): Promise<RepeatOrderExternalEntity>;
  findStatus(
    nik: string,
  ): Promise<{ draft_id: string; isNeedCheck: boolean } | null>;
  findById(id: string): Promise<RepeatOrderExternalEntity | null>;
  findByMarketingId(marketingId: number): Promise<RepeatOrderExternalEntity[]>;
  updateDraftById(
    id: string,
    updateData: Partial<RepeatOrderExternalEntity>,
  ): Promise<{ entity: RepeatOrderExternalEntity | null; isUpdated: boolean }>;
  triggerIsNeedCheckBeingTrue(
    draft_id?: string,
    nominal_pinjaman?: number,
  ): Promise<void>;
  softDelete(id: string): Promise<boolean>;
}
