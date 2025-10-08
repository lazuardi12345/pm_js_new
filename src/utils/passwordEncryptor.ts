// /**
//  * Caesar Cipher encrypt function
//  * @param text Text to encrypt
//  * @param shift Number of characters to shift
//  * @returns Encrypted string
//  */
// export function caesarEncrypt(text: string, shift: number): string {
//   return text
//     .split('')
//     .map((char) => shiftChar(char, shift))
//     .join('');
// }

// /**
//  * Caesar Cipher decrypt function
//  * @param text Encrypted text
//  * @param shift Shift used during encryption
//  * @returns Decrypted string
//  */
// export function caesarDecrypt(text: string, shift: number): string {
//   return text
//     .split('')
//     .map((char) => shiftChar(char, -shift))
//     .join('');
// }

// /**
//  * Shift a character by given number of positions
//  */
// function shiftChar(char: string, shift: number): string {
//   const isUpper = char >= 'A' && char <= 'Z';
//   const isLower = char >= 'a' && char <= 'z';

//   if (isUpper) {
//     const code = char.charCodeAt(0);
//     return String.fromCharCode(((code - 65 + shift + 26) % 26) + 65);
//   }

//   if (isLower) {
//     const code = char.charCodeAt(0);
//     return String.fromCharCode(((code - 97 + shift + 26) % 26) + 97);
//   }

//   // For numbers or special chars, leave as-is
//   return char;
// }
