export interface IPatient {
    id: number;
    role: number;
    email: string;
    lastName: string;
    createdAt: string;
    firstName: string;
    isEnabled: string;
    displayName: string;
}

export interface IFindPatientsPaginated {
    count: number;
    data: Array<IPatient>;
}

export interface ICreatePatientResponse {
    stored: boolean;
}

export interface IEditPatientResponse {
    updated: boolean;
}

export interface IDeletePatientResponse {
    deleted: boolean;
}
