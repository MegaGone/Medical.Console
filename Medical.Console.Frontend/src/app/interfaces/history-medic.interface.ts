import { IUser } from './user.interface';

export interface ISearchPatientsAsync {
    data: Array<Partial<IUser>>;
}
