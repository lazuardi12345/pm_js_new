import { USERTYPE, TYPE, USERSTATUS } from 'src/Shared/Enums/Users/Users.enum';

export class UsersEntity {
  constructor(
    public readonly nama: string,
    public readonly email: string,
    public passwordHash: string,
    public readonly usertype: USERTYPE = USERTYPE.MARKETING,
    public readonly type: TYPE = TYPE.INTERNAL,
    public readonly marketingCode?: string,
    public readonly spvId?: number | null,
    public readonly isActive: USERSTATUS = USERSTATUS.ACTIVE,
    public readonly id?: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date | null,
  ) {
    this.ensureValidRole();
    this.ensureValidType();
    this.ensureSupervisorForMarketing();
  }

  // ===== Business Rules =====

  private ensureValidRole(): void {
    if (!Object.values(USERTYPE).includes(this.usertype)) {
      throw new Error(`Role ${this.usertype} tidak valid.`);
    }
  }

  private ensureValidType(): void {
    if (!Object.values(TYPE).includes(this.type)) {
      throw new Error(`Type ${this.type} tidak valid.`);
    }
  }

  //! Rule khusus: Marketing harus punya SPV
  private ensureSupervisorForMarketing(): void {
    if (this.usertype === USERTYPE.MARKETING && !this.spvId) {
      throw new Error('Marketing wajib memiliki Supervisor (spvId).');
    }
  }

  public isActiveUser(): boolean {
    return this.isActive === USERSTATUS.ACTIVE;
  }

  public isSupervisor(): boolean {
    return this.usertype === USERTYPE.SPV;
  }

  public isMarketing(): boolean {
    return this.usertype === USERTYPE.MARKETING;
  }

  //! Cek apakah user punya supervisor → hanya berlaku untuk Marketing
  public hasSupervisor(): boolean {
    return this.usertype === USERTYPE.MARKETING && !!this.spvId;
  }

  public updatePassword(newHashedPassword: string): void {
    if (!newHashedPassword || newHashedPassword.length === 0) {
      throw new Error('Password hash tidak boleh kosong.');
    }
    this.passwordHash = newHashedPassword;
  }

  public getPassword(): string {
    return this.passwordHash;
  }
}
