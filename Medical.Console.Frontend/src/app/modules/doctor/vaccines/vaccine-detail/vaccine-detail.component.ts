import { Subject } from 'rxjs';
import { GENERIC_STATES } from 'app/data';
import { SnackbarService } from 'app/core/util';
import { VaccineService } from '../vaccine.service';
import { IVaccine, SelectItem } from 'app/interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-vaccine-detail',
    templateUrl: './vaccine-detail.component.html',
    styleUrls: ['./vaccine-detail.component.scss'],
})
export class VaccineDetailComponent implements OnInit, OnDestroy {
    public Form: FormGroup;
    public states: Array<SelectItem>;
    private _unsubscribe: Subject<boolean>;

    constructor(
        private readonly _fb: FormBuilder,
        private readonly _snackbar: SnackbarService,
        private readonly _service: VaccineService,
        @Inject(MAT_DIALOG_DATA) public data: IVaccine,
        private readonly dialogRef: MatDialogRef<VaccineDetailComponent>
    ) {
        this.states = [...GENERIC_STATES];
        this._unsubscribe = new Subject();
    }

    ngOnInit(): void {
        this._initForm();
    }

    ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private _initForm(): void {
        this.Form = this._fb.group({
            id: [this?.data?.id],
            doseSchedule: [this.data?.doseSchedule],
            manufacturer: [this?.data?.manufacturer],
            name: [this?.data?.name, [Validators.required]],
            description: [this?.data?.description, [Validators.required]],
            isEnabled: [+this?.data?.isEnabled || 0, [Validators.required]],
        });
    }

    public onCreateVaccine() {
        if (this.Form.invalid)
            return Object.values(this.Form.controls).forEach((c) =>
                c.markAsTouched()
            );

        this._service
            .create(this.Form.getRawValue())
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((res) => {
                const message: string = !res
                    ? 'Ha ocurrido un error al crear la vacunación.'
                    : 'La vacunación se ha creado exitósamente.';

                this._snackbar.open(message);
                if (res) this.onCancel();
            });
    }

    public onEditVaccine() {
        if (this.Form.invalid)
            return Object.values(this.Form.controls).forEach((c) =>
                c.markAsTouched()
            );

        this._service
            .update(this.Form.getRawValue())
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((res) => {
                const message: string = !res
                    ? 'Ha ocurrido un error al actualizar la vacunación.'
                    : 'La vacunación se ha actualizado exitósamente.';

                this._snackbar.open(message);
                if (res) this.onCancel();
            });
    }

    public onCancel() {
        this.dialogRef.close();
    }
}
