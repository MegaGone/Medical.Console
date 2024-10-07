import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MedicamentsService } from './medicaments.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MedicamentDetailComponent } from './medicament-detail/medicament-detail.component';

@Component({
    selector: 'app-medicaments',
    templateUrl: './medicaments.component.html',
    styleUrls: ['./medicaments.component.scss'],
})
export class MedicamentsComponent implements OnInit, OnDestroy {
    private _unsubscribe: Subject<boolean>;

    constructor(
        private readonly _dialog: MatDialog,
        private readonly _service: MedicamentsService
    ) {
        this._unsubscribe = new Subject();
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public createMedicament(): void {
        const dialogRef = this._dialog.open(MedicamentDetailComponent, {
            width: '500px',
        });

        dialogRef
            .afterClosed()
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((res) => this._service.dialogOpened());
    }
}
