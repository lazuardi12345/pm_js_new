import { ClientExternal } from "../Entities/client-external.entity";

export const CLIENT_EXTERNAL_REPOSITORY = 'CLIENT_EXTERNAL_REPOSITORY';

export interface IClientExternalRepository {
  findById(id: number): Promise<ClientExternal | null>;
  findByMarketingId(marketingId: number): Promise<ClientExternal[]>;
  findAll(): Promise<ClientExternal[]>;
  save(address: ClientExternal): Promise<ClientExternal>;
  update(
    id: number,
    address: Partial<ClientExternal>,
  ): Promise<ClientExternal>;
  delete(id: number): Promise<void>;
}
