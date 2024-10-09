export interface IVaccine {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    isEnabled: string;
    description: string;
    manufacturer: string;
    doseSchedule: string;
}

export interface IFindVaccinesPaginated {
    count: number;
    data: Array<IVaccine>;
}

export interface ICreateVaccineResponse {
    stored: boolean;
}

export interface IEditVaccineResponse {
    updated: boolean;
}

export interface IDeleteVaccineResponse {
    disabled: boolean;
}
