import { ApprovalExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/approval-external.orm-entity';
import { ClientExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/client-external.orm-entity';
import { ApprovalInternal_ORM_Entity } from 'src/Modules/LoanAppInternal/Infrastructure/Entities/approval-internal.orm-entity';
import { ClientInternal_ORM_Entity } from 'src/Modules/LoanAppInternal/Infrastructure/Entities/client-internal.orm-entity';
// import { Notification } from 'src/Shared/Modules/Notifications/entities/notification.entity';
// import { RepeatOrders } from 'src/Shared/Modules/RepeatOrders/entities/repeat-orders.entity';
import { USERTYPE, TYPE, USERSTATUS} from 'src/Shared/Enums/Users/Users.enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('users')
export class Users_ORM_Entity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nama: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: USERTYPE,
    default: USERTYPE.MARKETING,
  })
  usertype: USERTYPE;

  @Column({
    type: 'enum',
    enum: TYPE,
  })
  type: TYPE;

  @Column({ nullable: true })
  marketing_code?: string;

  @Column({ nullable: true })
  spv_id: number | null;

  @Column({
    type: 'tinyint',
    default: USERSTATUS.ACTIVE,
  })
  is_active: USERSTATUS;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date | null;

  // * USERS RELATIONSHIPS TO ANOTHER ENTITIES
  @ManyToOne(() => Users_ORM_Entity, { nullable: true })
  @JoinColumn({ name: 'spv_id', foreignKeyConstraintName: 'FK_SpvID_at_UsersTableFieldRole' }) // ngarah ke kolom di database
  spv: Users_ORM_Entity;

  @OneToMany(() => ClientInternal_ORM_Entity, (clientInternal) => clientInternal.marketing)
  clientInternals: ClientInternal_ORM_Entity[];
  @OneToMany(() => ClientExternal_ORM_Entity, (clientExternal) => clientExternal.marketing)
  clientExternals: ClientExternal_ORM_Entity[];
  @OneToMany(
    () => ApprovalInternal_ORM_Entity,
    (approvalInternal) => approvalInternal.user,
  )
  approvalInternals: ApprovalInternal_ORM_Entity[];
  
  @OneToMany(
    () => ApprovalExternal_ORM_Entity,
    (approvalExternals) => approvalExternals.user,
  )
  approvalExternals: ApprovalExternal_ORM_Entity[];
//   @OneToMany(() => RepeatOrders, (repeatOrders) => repeatOrders.marketing)
//   repeatOrders: RepeatOrders[];
//   @OneToMany(() => Notification, (notifications) => notifications.user)
  // notifications: Notification[];

  // @BeforeInsert()
  // setSub() {
  //   this.sub = this.id; // akan diisi setelah ID ter-generate
  // }
}
