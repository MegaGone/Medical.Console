import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { takeUntil } from 'rxjs/operators';
import { PatientsService } from './patients.service';

@Component({
    selector: 'app-patients',
    templateUrl: './patients.component.html',
    styleUrls: ['./patients.component.scss'],
})
export class PatientsComponent implements OnInit, OnDestroy {
    private _unsubscribe: Subject<boolean>;

    constructor(
        private readonly _dialog: MatDialog,
        private readonly _service: PatientsService
    ) {
        this._unsubscribe = new Subject();
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public createPatient(): void {
        const dialogRef = this._dialog.open(PatientDetailComponent, {
            width: '500px',
        });

        dialogRef
            .afterClosed()
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((res) => this._service.dialogOpened());
    }
}
