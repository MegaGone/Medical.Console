import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "MedicineData" })
export class Medicine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", nullable: false, length: "150" })
  name!: string;

  @Column({ type: "text", nullable: false })
  description!: string;

  @Column({ type: "varchar", nullable: true, length: "50" })
  dosage?: string;

  @Column({ type: "text", nullable: true })
  sideEffects?: string;

  @Column({ type: "bit", default: 1 })
  isEnabled: number;

  @CreateDateColumn({ default: () => "CURRENT_TIMESTAMP" })
  createdAt?: Date;

  @UpdateDateColumn({ default: () => "CURRENT_TIMESTAMP" })
  updatedAt?: Date;
}
