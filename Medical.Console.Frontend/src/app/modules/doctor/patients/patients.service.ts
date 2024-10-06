import { Injectable, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import {
    ICreatePatientResponse,
    IDeletePatientResponse,
    IEditPatientResponse,
    IFindPatientsPaginated,
    IPatient,
} from 'app/interfaces';
import { catchError, map } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
const API_URL = environment.API_URL;

@Injectable({
    providedIn: 'root',
})
export class PatientsService {
    @ViewChild(MatSort) public sort: MatSort;
    @ViewChild(MatPaginator) public paginator: MatPaginator;

    private _dialog: Subject<void>;
    private _patients: BehaviorSubject<IPatient[]>;

    constructor(private readonly _http: HttpClient) {
        this._dialog = new Subject();
        this._patients = new BehaviorSubject([]);
    }

    public dialogOpened() {
        this._dialog.next();
    }

    public get patients$(): Observable<IPatient[]> {
        return this._patients.asObservable();
    }

    public get dialog$() {
        return this._dialog.asObservable();
    }

    public findPatientsPaginated(
        page: number = 1,
        pageSize: number = 10
    ): Observable<IFindPatientsPaginated> {
        const params = new HttpParams()
            .append('page', page)
            .append('pageSize', pageSize);

        return this._http
            .get<IFindPatientsPaginated>(`${API_URL}patient/findPaginated`, {
                params,
            })
            .pipe(
                map((res) => {
                    this._patients.next(res.data);
                    return res;
                }),
                catchError((err) => of(null))
            );
    }

    public findPatient(id: number): Observable<IPatient> {
        return this._http
            .get<IPatient>(`${API_URL}patient/findById/${id}`)
            .pipe(
                map((res) => res),
                catchError((err) => of(null))
            );
    }

    public createPatient(patient: Partial<IPatient>): Observable<boolean> {
        return this._http
            .post<ICreatePatientResponse>(`${API_URL}patient/create`, patient)
            .pipe(
                map((res) => res?.stored),
                catchError((err) => of(false))
            );
    }

    public updatePatient(patient: Partial<IPatient>): Observable<boolean> {
        return this._http
            .put<IEditPatientResponse>(`${API_URL}patient/update`, patient)
            .pipe(
                map((res) => res?.updated),
                catchError((err) => of(false))
            );
    }

    public deletePatient(id: number): Observable<boolean> {
        return this._http
            .delete<IDeletePatientResponse>(`${API_URL}patient/delete/${id}`)
            .pipe(
                map((res) => res?.deleted),
                catchError((err) => of(false))
            );
    }
}
