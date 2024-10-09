import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VaccineService } from './vaccine.service';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { VaccineDetailComponent } from './vaccine-detail/vaccine-detail.component';

@Component({
    selector: 'app-vaccines',
    templateUrl: './vaccines.component.html',
    styleUrls: ['./vaccines.component.scss'],
})
export class VaccinesComponent implements OnInit, OnDestroy {
    private _unsubscribe: Subject<boolean>;

    constructor(
        private readonly _dialog: MatDialog,
        private readonly _service: VaccineService
    ) {
        this._unsubscribe = new Subject();
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public createVaccine(): void {
        const dialogRef = this._dialog.open(VaccineDetailComponent, {
            width: '500px',
        });

        dialogRef
            .afterClosed()
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((res) => this._service.dialogOpened());
    }
}
