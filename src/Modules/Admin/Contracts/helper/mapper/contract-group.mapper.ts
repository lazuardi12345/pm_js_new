// contract-sequence.mapper.ts
import { InternalCompanyList } from 'src/Shared/Enums/Admins/Contract/loan-agreement.enum';
import { ContractSequenceCategory } from './contract-sequence-category.mapper';

export function resolveSequenceKey(
  normalizedType: string,
  perusahaan?: InternalCompanyList,
): string {
  // INTERNAL (per perusahaan)
  if (normalizedType.includes('INTERNAL')) {
    if (!perusahaan) {
      throw new Error('Perusahaan wajib untuk INTERNAL');
    }
    return `${ContractSequenceCategory.INTERNAL}_${perusahaan.toLowerCase()}`;
  }

  // KEDINASAN
  if (normalizedType.includes('KEDINASAN')) {
    return ContractSequenceCategory.KEDINASAN;
  }

  // SF
  if (normalizedType.includes('SF')) {
    return ContractSequenceCategory.SF;
  }

  // UMKM
  if (normalizedType.includes('UMKM')) {
    return ContractSequenceCategory.UMKM;
  }

  // BPD - LEBIH FLEXIBLE
  if (normalizedType.includes('BPD') || normalizedType.includes('BADAN')) {
    return ContractSequenceCategory.BPD;
  }

  // DEFAULT → PT LUAR
  return ContractSequenceCategory.PT_LUAR;
}
