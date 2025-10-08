import { ClientInternal } from '../Entities/client-internal.entity';

export const CLIENT_INTERNAL_REPOSITORY = Symbol('CLIENT_INTERNAL_REPOSITORY');

export interface IClientInternalRepository {
  findById(id: number): Promise<ClientInternal | null>;
  findByMarketingId(marketingId: number): Promise<ClientInternal[]>;
  findAll(): Promise<ClientInternal[]>;
  save(address: ClientInternal): Promise<ClientInternal>;
  update(
    id: number,
    address: Partial<ClientInternal>,
  ): Promise<ClientInternal>;
  delete(id: number): Promise<void>;
}
