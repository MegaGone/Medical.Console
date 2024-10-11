/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './core/user/user.module';
import { AuthModule } from './core/auth/auth.module';
import { SharedModule } from './core/shared/shared.module';
import { PatientModule } from './core/patient/patient.module';
import { MedicineModule } from './core/medicine/medicine.module';
import { VaccineModule } from './core/vaccine/vaccine.module';
import { MedicalHistoryModule } from './core/medical-history/medical-history.module';

import Config from './configuration/global.configuration';
import DBConfig from './configuration/database.configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [DBConfig, Config],
    }),
    TypeOrmModule.forRoot(DBConfig()),
    UserModule,
    AuthModule,
    SharedModule,
    PatientModule,
    MedicineModule,
    VaccineModule,
    MedicalHistoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
