import { Component, OnInit } from '@angular/core';
import { MedicalHistoryService } from './medical-history.service';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IUser } from 'app/interfaces';
import { MatSelectChange } from '@angular/material/select';

@Component({
    selector: 'app-medical-history',
    templateUrl: './medical-history.component.html',
    styleUrls: ['./medical-history.component.scss'],
})
export class MedicalHistoryComponent implements OnInit {
    public isLoadingPatients: boolean;
    public patients: Array<Partial<IUser>>;
    public selectedPatient: Partial<IUser>;

    private _search: Subject<string>;
    private _unsubscribe: Subject<boolean>;

    constructor(private readonly _service: MedicalHistoryService) {
        this._search = new Subject();
        this._unsubscribe = new Subject();

        this.patients = [];
        this.isLoadingPatients = false;
    }

    ngOnInit(): void {
        this._onFilterPatients();
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
                },
                (err) => {
                    this.patients = [];
                },
                () => {
                    this.isLoadingPatients = false;
                }
            );
    }

    public onFilterPatients(value: string): void {
        if (!value) return;

        this.isLoadingPatients = true;
        this._search.next(value);
    }

    public onPatientSelected(event: MatSelectChange): void {
        const displayName: string = event.value;
        const patient: Partial<IUser> = this.patients.find(
            (p) => p?.displayName === displayName
        );

        this.selectedPatient = patient;
        this._service.patientSelected(this.selectedPatient);
    }
}
