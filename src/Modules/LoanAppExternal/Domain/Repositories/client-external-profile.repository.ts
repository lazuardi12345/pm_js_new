import { ClientExternalProfile } from '../Entities/client-external-profile.entity';

export const CLIENT_EXTERNAL_PROFILE_REPOSITORY = Symbol(
  'CLIENT_EXTERNAL_PROFILE_REPOSITORY',
);

export interface IClientExternalProfileRepository {
  findById(id: number): Promise<ClientExternalProfile | null>;
  // findByMarketingId(marketingId: number): Promise<ClientExternalProfile[]>;
  findAll(): Promise<ClientExternalProfile[]>;
  save(address: ClientExternalProfile): Promise<ClientExternalProfile>;
  update(
    id: number,
    address: Partial<ClientExternalProfile>,
  ): Promise<ClientExternalProfile>;
  delete(id: number): Promise<void>;
}
