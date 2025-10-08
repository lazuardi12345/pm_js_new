import { UsersEntity } from '../Entities/users.entity';
import { USERTYPE, TYPE, USERSTATUS } from 'src/Shared/Enums/Users/Users.enum';

export class UserValidationService {
  /**
   * Cek apakah role user valid
   */
  static isRoleValid(user: UsersEntity): boolean {
    return Object.values(USERTYPE).includes(user.usertype);
  }

  /**
   * Cek apakah type user valid
   */
  static isTypeValid(user: UsersEntity): boolean {
    return Object.values(TYPE).includes(user.type);
  }

  /**
   * Cek apakah status aktif valid
   */
  static isStatusValid(user: UsersEntity): boolean {
    return Object.values(USERSTATUS).includes(user.isActive);
  }

  /**
   * Rule khusus: Marketing wajib punya SPV
   */
  static hasValidSupervisor(user: UsersEntity): boolean {
    if (user.isMarketing()) {
      return !!user.spvId;
    }
    return true; // selain marketing bebas
  }

  /**
   * Validasi semua aturan user sekaligus
   */
  static validateUser(user: UsersEntity): void {
    if (!this.isRoleValid(user)) {
      throw new Error(`Role ${user.usertype} tidak valid.`);
    }
    if (!this.isTypeValid(user)) {
      throw new Error(`Type ${user.type} tidak valid.`);
    }
    if (!this.isStatusValid(user)) {
      throw new Error(`Status user ${user.isActive} tidak valid.`);
    }
    if (!this.hasValidSupervisor(user)) {
      throw new Error('Marketing wajib memiliki Supervisor!');
    }
  }
}
