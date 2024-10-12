import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISearchPatientsAsync, IUser } from 'app/interfaces';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
const API_URL = environment.API_URL;

@Injectable({
    providedIn: 'root',
})
export class MedicalHistoryService {
    constructor(private readonly _http: HttpClient) {}

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
}
