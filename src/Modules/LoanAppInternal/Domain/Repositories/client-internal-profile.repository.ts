import { ClientInternalProfile } from '../Entities/client-internal-profile.entity';

export const CLIENT_INTERNAL_PROFILE_REPOSITORY = Symbol(
  'CLIENT_INTERNAL_PROFILE_REPOSITORY',
);

export interface IClientInternalProfileRepository {
  findById(id: number): Promise<ClientInternalProfile | null>;
  // findByMarketingId(marketingId: number): Promise<ClientInternalProfile[]>;
  findAll(): Promise<ClientInternalProfile[]>;
  save(address: ClientInternalProfile): Promise<ClientInternalProfile>;
  update(
    id: number,
    address: Partial<ClientInternalProfile>,
  ): Promise<ClientInternalProfile>;
  delete(id: number): Promise<void>;
}
