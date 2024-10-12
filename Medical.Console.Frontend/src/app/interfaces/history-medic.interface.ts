import { IUser } from './user.interface';

export interface ISearchPatientsAsync {
    data: Array<Partial<IUser>>;
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
