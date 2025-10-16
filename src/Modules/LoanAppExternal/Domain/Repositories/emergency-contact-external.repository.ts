// Domain/Repositories/approval-external.repository.ts
import { EmergencyContactExternal } from "../Entities/emergency-contact-external.entity";

export const EMERGENCY_CONTACTS_EXTERNAL_REPOSITORY = 'EMERGENCY_CONTACTS_EXTERNAL_REPOSITORY';

export interface IEmergencyContactExternalRepository {
  findById(id: number): Promise<EmergencyContactExternal | null>;
  findByNasabahId(nasabahId: number): Promise<EmergencyContactExternal[]>;
  findAll(): Promise<EmergencyContactExternal[]>;
  save(address: EmergencyContactExternal): Promise<EmergencyContactExternal>;
  update(
    id: number,
    address: Partial<EmergencyContactExternal>,
  ): Promise<EmergencyContactExternal>;
  delete(id: number): Promise<void>;
}
