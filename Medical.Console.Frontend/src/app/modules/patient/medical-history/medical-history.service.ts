import { Injectable } from '@angular/core';
import {
    IUser,
    IVaccine,
    IMedicine,
    IMedicHistory,
    ISearchPatientsAsync,
    ISearchVaccinesAsync,
    ISearchMedicinesAsync,
    IMedicHistoriesPaginated,
    ICreateMedicHistoryResponse,
} from 'app/interfaces';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
const API_URL = environment.API_URL;

@Injectable({
    providedIn: 'root',
})
export class MedicalHistoryService {
    private _onSelectedPatient: Subject<Partial<IUser>>;
    private _medicHistories: BehaviorSubject<IMedicHistory[]>;

    constructor(private readonly _http: HttpClient) {
        this._onSelectedPatient = new Subject();
        this._medicHistories = new BehaviorSubject([]);
    }

    public patientSelected(patient: Partial<IUser>) {
        this._onSelectedPatient.next(patient);
    }

    public get patientSelected$(): Observable<Partial<IUser>> {
        return this._onSelectedPatient.asObservable();
    }

    public get medicHistories$(): Observable<IMedicHistory[]> {
        return this._medicHistories.asObservable();
    }

    public searchAsync(input: string): Observable<Array<Partial<IUser>>> {
        return this._http
            .get<ISearchPatientsAsync>(`${API_URL}patient/search`, {
                params: { input },
            })
            .pipe(
                map((res: ISearchPatientsAsync) => {
                    return !res || !res?.data ? [] : res?.data;
                }),
                catchError((error) => of([]))
            );
    }

    public searchMedicineAsync(
        input: string
    ): Observable<Array<Partial<IMedicine>>> {
        return this._http
            .get<ISearchMedicinesAsync>(`${API_URL}medicine/search`, {
                params: { input },
            })
            .pipe(
                map((res: ISearchMedicinesAsync) => {
                    return !res || !res?.data ? [] : res?.data;
                }),
                catchError((error) => of([]))
            );
    }

    public searchVaccineAsync(
        input: string
    ): Observable<Array<Partial<IVaccine>>> {
        return this._http
            .get<ISearchVaccinesAsync>(`${API_URL}vaccine/search`, {
                params: { input },
            })
            .pipe(
                map((res: ISearchVaccinesAsync) => {
                    return !res || !res?.data ? [] : res?.data;
                }),
                catchError((error) => of([]))
            );
    }

    public findPaginated(
        id: number,
        page: number = 1,
        pageSize: number = 10
    ): Observable<IMedicHistoriesPaginated> {
        const params = new HttpParams()
            .append('page', page)
            .append('pageSize', pageSize)
            .append('patientId', id);

        return this._http
            .get<IMedicHistoriesPaginated>(
                `${API_URL}medical-history/findPaginated`,
                {
                    params,
                }
            )
            .pipe(
                map((res) => {
                    this._medicHistories.next(res.data);
                    return res;
                }),
                catchError((err) => of(null))
            );
    }

    public create(history: Partial<IMedicHistory>): Observable<boolean> {
        return this._http
            .post<ICreateMedicHistoryResponse>(
                `${API_URL}medical-history/create`,
                history
            )
            .pipe(
                map((res) => res?.stored),
                catchError((err) => of(false))
            );
    }
}
