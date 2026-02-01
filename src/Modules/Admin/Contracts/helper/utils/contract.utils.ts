// utils.ts
export function monthToRoman(month: number): string {
  const map = [
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
    'VIII',
    'IX',
    'X',
    'XI',
    'XII',
  ];
  return map[month - 1];
}

export function formatContractNumber(
  nextNumber: number,
  month: number,
  yearShort: string,
): string {
  const nomorFormatted = String(nextNumber).padStart(3, '0');
  return `${nomorFormatted}/CG/${monthToRoman(month)}/${yearShort}`;
}

// contract-type.normalizer.ts
export function normalizeContractType(raw: string): string {
  return raw.toUpperCase().replace(/&/g, '').replace(/\s+/g, '_');
}
