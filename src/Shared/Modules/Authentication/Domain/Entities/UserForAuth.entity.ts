import { USERSTATUS } from 'src/Shared/Enums/Users/Users.enum';

export class UserForAuth {
  constructor(
    public readonly id: number,
    public readonly nama: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly usertype: string,
    public readonly type: string,
    public readonly isActive: USERSTATUS,
    public readonly spvId?: number | null,
  ) {}

  toJSON() {
    return {
      id: this.id,
      nama: this.nama,
      email: this.email,
      usertype: this.usertype,
      type: this.type,
      spvId: this.spvId,
      is_active: this.isActive,
    };
  }
}
