import { Medicine } from "src/core/medicine/entities";
import { MedicalHistory } from "./medical-history.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "UserMedicineData " })
export class UserMedicineData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  medicalHistoryId!: number;

  @Column({ type: "int", nullable: false })
  medicineId!: number;

  @ManyToOne(() => MedicalHistory, (history) => history.id)
  @JoinColumn({ name: "medicalHistoryId" })
  history!: MedicalHistory;

  @ManyToOne(() => Medicine, (medicine) => medicine.id)
  @JoinColumn({ name: "medicineId" })
  medicine!: Medicine;
}
