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
}

export interface IMedicHistoriesPaginated {
    count: number;
    data: Array<IMedicHistory>;
}
