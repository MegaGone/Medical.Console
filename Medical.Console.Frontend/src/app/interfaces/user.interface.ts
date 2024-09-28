export interface IUser {
    id: number;
    role: number;
    email: string;
    lastName: string;
    createdAt: string;
    firstName: string;
    isEnabled: string;
    displayName: string;
}

export interface IFindUsersPaginated {
    count: number;
    data: Array<IUser>;
}

export interface ICreateUserResponse {
    stored: boolean;
}

export interface IEditUserResponse {
    updated: boolean;
}

export interface IDeleteUserResponse {
    deleted: boolean;
}
