import { Vaccine } from "src/core/vaccine/entities";
import { MedicalHistory } from "./medical-history.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "UserVaccineData" })
export class UserVaccineData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  medicalHistoryId!: number;

  @Column({ type: "int", nullable: false })
  vaccineId!: number;

  @ManyToOne(() => MedicalHistory, (history) => history.id)
  @JoinColumn({ name: "medicalHistoryId" })
  history!: MedicalHistory;

  @ManyToOne(() => Vaccine, (vaccine) => vaccine.id)
  @JoinColumn({ name: "vaccineId" })
  vaccine!: Vaccine;
}
