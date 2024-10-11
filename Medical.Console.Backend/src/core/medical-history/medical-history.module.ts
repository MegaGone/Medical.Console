import { Module } from "@nestjs/common";
import { MedicalHistory } from "./entities";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MedicalHistoryService } from "./medical-history.service";
import { MedicalHistoryController } from "./medical-history.controller";

@Module({
  providers: [MedicalHistoryService],
  controllers: [MedicalHistoryController],
  imports: [TypeOrmModule.forFeature([MedicalHistory])],
})
export class MedicalHistoryModule {}
