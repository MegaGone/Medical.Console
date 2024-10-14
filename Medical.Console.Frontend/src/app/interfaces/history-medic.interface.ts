import { IUser } from './user.interface';
import { IVaccine } from './vaccine.interface';
import { IMedicine } from './medicament.interface';

export interface ISearchPatientsAsync {
    data: Array<Partial<IUser>>;
}

export interface ISearchMedicinesAsync {
    data: Array<Partial<IMedicine>>;
}

export interface ISearchVaccinesAsync {
    data: Array<Partial<IVaccine>>;
}

export interface IUserVaccine {
    id: number;
    vaccine: Partial<IVaccine>;
}

export interface IUserMedicine {
    id: number;
    medicine: Partial<IMedicine>;
}

export interface IMedicHistory {
    id: number;
    notes: string;
    userId: number;
    visitedAt: Date;
    createdAt: Date;
    doctorId: number;
    isEnabled: string;
    diagnosis: string;
    treatment: string;
    identificator: string;
    doctor: Partial<IUser>;
    patient: Partial<IUser>;
    vaccineIds: Array<number>;
    medicineIds: Array<number>;
    vaccines?: Array<IUserVaccine>;
    medicines?: Array<IUserMedicine>;
}

export interface IMedicHistoriesPaginated {
    count: number;
    data: Array<IMedicHistory>;
}

export interface ICreateMedicHistoryResponse {
    stored: boolean;
}

export interface IDisableMedicHistoryResponse {
    disabled: boolean;
}

export interface IFindMedicHistoryResponse {
    data: Partial<IMedicHistory>;
}
