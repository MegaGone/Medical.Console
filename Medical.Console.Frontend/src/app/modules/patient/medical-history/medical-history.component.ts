import { Component, OnInit } from '@angular/core';
import { MedicalHistoryService } from './medical-history.service';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IUser } from 'app/interfaces';

@Component({
    selector: 'app-medical-history',
    templateUrl: './medical-history.component.html',
    styleUrls: ['./medical-history.component.scss'],
})
export class MedicalHistoryComponent implements OnInit {
    public patients: Array<Partial<IUser>>;

    private _search: Subject<string>;
    private _unsubscribe: Subject<boolean>;

    constructor(private readonly _service: MedicalHistoryService) {
        this._search = new Subject();
        this._unsubscribe = new Subject();

        this.patients = [
            {
                displayName: 'demo',
            },
        ];
    }

    ngOnInit(): void {
        this._onFilterPatients();
    }

    public onFilterPatients(value: string): void {
        if (!value) return;

        this._search.next(value);
    }

    private _onFilterPatients(): void {
        this._search
            .pipe(
                debounceTime(500),
                switchMap((input) => this._service.searchAsync(input)),
                takeUntil(this._unsubscribe)
            )
            .subscribe(
                (data) => {
                    this.patients = data;
                    console.log(this.patients);
                },
                (err) => {
                    this.patients = [];
                }
            );
    }
}
