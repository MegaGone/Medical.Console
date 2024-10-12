import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    IUser,
    IMedicHistory,
    ISearchPatientsAsync,
    IMedicHistoriesPaginated,
} from 'app/interfaces';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
const API_URL = environment.API_URL;

@Injectable({
    providedIn: 'root',
})
export class MedicalHistoryService {
    private _medicHistories: BehaviorSubject<IMedicHistory[]>;

    constructor(private readonly _http: HttpClient) {
        this._medicHistories = new BehaviorSubject([]);
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
}
