import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MedicalHistoryService } from "./medical-history.service";
import { MedicalHistoryController } from "./medical-history.controller";
import { MedicalHistory, UserMedicineData, UserVaccineData } from "./entities";

@Module({
  providers: [MedicalHistoryService],
  controllers: [MedicalHistoryController],
  imports: [TypeOrmModule.forFeature([MedicalHistory, UserVaccineData, UserMedicineData])],
})
export class MedicalHistoryModule {}
