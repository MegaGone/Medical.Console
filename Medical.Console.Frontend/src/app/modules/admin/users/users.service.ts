import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { IFindUsersPaginated, IUser } from 'app/interfaces';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
const API_URL = environment.API_URL;

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    private _users: BehaviorSubject<IUser[]>;

    constructor(private readonly _http: HttpClient) {
        this._users = new BehaviorSubject([]);
    }

    get users$(): Observable<IUser[]> {
        return this._users.asObservable();
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
}
