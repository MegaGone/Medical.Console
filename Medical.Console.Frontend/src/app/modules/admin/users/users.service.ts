import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import {
    ICreateUserResponse,
    IDeleteUserResponse,
    IEditUserResponse,
    IFindUsersPaginated,
    IUser,
} from 'app/interfaces';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
const API_URL = environment.API_URL;

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    private _dialog: Subject<void>;
    private _users: BehaviorSubject<IUser[]>;

    constructor(private readonly _http: HttpClient) {
        this._users = new BehaviorSubject([]);
        this._dialog = new Subject();
    }

    get users$(): Observable<IUser[]> {
        return this._users.asObservable();
    }

    dialogOpened() {
        this._dialog.next();
    }

    get dialog$() {
        return this._dialog.asObservable();
    }

    public findUsersPaginated(
        page: number = 1,
        pageSize: number = 10
    ): Observable<IFindUsersPaginated> {
        const params = new HttpParams()
            .append('page', page)
            .append('pageSize', pageSize);

        return this._http
            .get<IFindUsersPaginated>(`${API_URL}user/findPaginated`, {
                params,
            })
            .pipe(
                map((res) => {
                    this._users.next(res.data);
                    return res;
                }),
                catchError((err) => of(null))
            );
    }

    public createUser(user: Partial<IUser>): Observable<boolean> {
        return this._http
            .post<ICreateUserResponse>(`${API_URL}user/create`, user)
            .pipe(
                map((res) => res?.stored),
                catchError((err) => of(false))
            );
    }

    public updateUser(user: Partial<IUser>): Observable<boolean> {
        return this._http
            .put<IEditUserResponse>(`${API_URL}user/update`, user)
            .pipe(
                map((res) => res?.updated),
                catchError((err) => of(false))
            );
    }

    public deleteUser(id: number): Observable<boolean> {
        return this._http
            .delete<IDeleteUserResponse>(`${API_URL}user/delete/${id}`)
            .pipe(
                map((res) => res?.deleted),
                catchError((err) => of(false))
            );
    }
}
