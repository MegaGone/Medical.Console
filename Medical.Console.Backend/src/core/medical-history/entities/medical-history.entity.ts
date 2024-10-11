import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "src/core/user/entities";
import { UserVaccineData } from "./medical-history-vaccine.entity";
import { UserMedicineData } from "./medical-history-medicine.entity";

@Entity({ name: "MedicalHistoryData" })
export class MedicalHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", nullable: false, length: "50" })
  identificator!: string;

  @Column({ type: "int", nullable: false })
  userId!: number;

  @Column({ type: "int", nullable: false })
  doctorId!: number;

  @Column({ type: "bit", default: 1 })
  isEnabled: number;

  @CreateDateColumn({ default: () => "CURRENT_TIMESTAMP" })
  visitedAt?: Date;

  @CreateDateColumn({ default: () => "CURRENT_TIMESTAMP" })
  createdAt?: Date;

  @Column({ type: "varchar", length: "300", nullable: false })
  diagnosis!: string;

  @Column({ type: "varchar", length: "300", nullable: false })
  treatment!: string;

  @Column({ type: "varchar", length: "150", nullable: false })
  notes!: string;

  // RELATIONS
  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: "userId" })
  patient!: User;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: "doctorId" })
  doctor!: User;

  @OneToMany(() => UserVaccineData, (vaccine) => vaccine.history, { nullable: true })
  vaccines?: Array<UserVaccineData>;

  @OneToMany(() => UserMedicineData, (medicine) => medicine.history, { nullable: true })
  medicines?: Array<UserMedicineData>;
}
