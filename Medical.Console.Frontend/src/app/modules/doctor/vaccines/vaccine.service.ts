import { Injectable } from '@angular/core';
import {
    IVaccine,
    IEditVaccineResponse,
    ICreateVaccineResponse,
    IDeleteVaccineResponse,
    IFindVaccinesPaginated,
} from 'app/interfaces';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
const API_URL = environment.API_URL;

@Injectable({
    providedIn: 'root',
})
export class VaccineService {
    private _dialog: Subject<void>;
    private _vaccines: BehaviorSubject<IVaccine[]>;

    constructor(private readonly _http: HttpClient) {
        this._dialog = new Subject();
        this._vaccines = new BehaviorSubject([]);
    }

    public dialogOpened() {
        this._dialog.next();
    }

    public get vaccines$(): Observable<IVaccine[]> {
        return this._vaccines.asObservable();
    }

    public get dialog$() {
        return this._dialog.asObservable();
    }

    public findPaginated(
        page: number = 1,
        pageSize: number = 10
    ): Observable<IFindVaccinesPaginated> {
        const params = new HttpParams()
            .append('page', page)
            .append('pageSize', pageSize);

        return this._http
            .get<IFindVaccinesPaginated>(`${API_URL}vaccine/findPaginated`, {
                params,
            })
            .pipe(
                map((res) => {
                    this._vaccines.next(res.data);
                    return res;
                }),
                catchError((err) => of(null))
            );
    }

    public create(patient: Partial<IVaccine>): Observable<boolean> {
        return this._http
            .post<ICreateVaccineResponse>(`${API_URL}vaccine/create`, patient)
            .pipe(
                map((res) => res?.stored),
                catchError((err) => of(false))
            );
    }

    public update(patient: Partial<IVaccine>): Observable<boolean> {
        return this._http
            .put<IEditVaccineResponse>(`${API_URL}vaccine/update`, patient)
            .pipe(
                map((res) => res?.updated),
                catchError((err) => of(false))
            );
    }

    public delete(id: number): Observable<boolean> {
        return this._http
            .delete<IDeleteVaccineResponse>(`${API_URL}vaccine/delete/${id}`)
            .pipe(
                map((res) => res?.disabled),
                catchError((err) => of(false))
            );
    }
}
