import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "VaccineData" })
export class Vaccine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", nullable: false, length: "150" })
  name!: string;

  @Column({ type: "text", nullable: false })
  description!: string;

  @Column({ type: "varchar", nullable: false, length: "150" })
  manufacturer!: string;

  @Column({ type: "varchar", nullable: true, length: "50" })
  doseSchedule?: string;

  @Column({ type: "bit", default: 1 })
  isEnabled: number;

  @CreateDateColumn({ default: () => "CURRENT_TIMESTAMP" })
  createdAt?: Date;

  @UpdateDateColumn({ default: () => "CURRENT_TIMESTAMP" })
  updatedAt?: Date;
}
