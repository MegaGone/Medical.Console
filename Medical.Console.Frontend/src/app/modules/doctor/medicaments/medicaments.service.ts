import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import {
    IMedicine,
    IEditMedicineResponse,
    IDeleteMedicineResponse,
    ICreateMedicineResponse,
    IFindMedicinesPaginated,
} from 'app/interfaces';
const API_URL = environment.API_URL;

@Injectable({
    providedIn: 'root',
})
export class MedicamentsService {
    private _dialog: Subject<void>;
    private _medicines: BehaviorSubject<IMedicine[]>;

    constructor(private readonly _http: HttpClient) {
        this._dialog = new Subject();
        this._medicines = new BehaviorSubject([]);
    }

    public dialogOpened() {
        this._dialog.next();
    }

    public get medicines$(): Observable<IMedicine[]> {
        return this._medicines.asObservable();
    }

    public get dialog$() {
        return this._dialog.asObservable();
    }

    public findPaginated(
        page: number = 1,
        pageSize: number = 10
    ): Observable<IFindMedicinesPaginated> {
        const params = new HttpParams()
            .append('page', page)
            .append('pageSize', pageSize);

        return this._http
            .get<IFindMedicinesPaginated>(`${API_URL}medicine/findPaginated`, {
                params,
            })
            .pipe(
                map((res) => {
                    this._medicines.next(res.data);
                    return res;
                }),
                catchError((err) => of(null))
            );
    }

    public create(patient: Partial<IMedicine>): Observable<boolean> {
        return this._http
            .post<ICreateMedicineResponse>(`${API_URL}medicine/create`, patient)
            .pipe(
                map((res) => res?.stored),
                catchError((err) => of(false))
            );
    }

    public update(patient: Partial<IMedicine>): Observable<boolean> {
        return this._http
            .put<IEditMedicineResponse>(`${API_URL}medicine/update`, patient)
            .pipe(
                map((res) => res?.updated),
                catchError((err) => of(false))
            );
    }

    public delete(id: number): Observable<boolean> {
        return this._http
            .delete<IDeleteMedicineResponse>(`${API_URL}medicine/delete/${id}`)
            .pipe(
                map((res) => res?.disabled),
                catchError((err) => of(false))
            );
    }
}
