import { Medicine } from "./entities";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MedicineService } from "./medicine.service";
import { MedicineController } from "./medicine.controller";

@Module({
  providers: [MedicineService],
  controllers: [MedicineController],
  imports: [TypeOrmModule.forFeature([Medicine])],
})
export class MedicineModule {}
