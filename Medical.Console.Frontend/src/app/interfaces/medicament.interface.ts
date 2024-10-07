export interface IMedicine {
    id: number;
    name: string;
    dosage: string;
    createdAt: Date;
    updatedAt: Date;
    isEnabled: string;
    description: string;
    sideEffects: string;
}

export interface IFindMedicinesPaginated {
    count: number;
    data: Array<IMedicine>;
}

export interface ICreateMedicineResponse {
    stored: boolean;
}

export interface IEditMedicineResponse {
    updated: boolean;
}

export interface IDeleteMedicineResponse {
    disabled: boolean;
}
