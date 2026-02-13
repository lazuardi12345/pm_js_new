import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('contract_sequences')
@Unique(['kelompok', 'bulan', 'tahun'])
export class ContractSequence_ORM_Entity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  kelompok: string;

  @Column()
  bulan: number;

  @Column()
  tahun: number;

  @Column({ name: 'last_number', default: 0 })
  lastNumber: number;
}
