import { Module } from "@nestjs/common";
import { VaccineService } from "./vaccine.service";
import { VaccineController } from "./vaccine.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Vaccine } from "./entities";

@Module({
  providers: [VaccineService],
  controllers: [VaccineController],
  imports: [TypeOrmModule.forFeature([Vaccine])],
})
export class VaccineModule {}
