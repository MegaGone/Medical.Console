import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IMedicine, SelectItem } from 'app/interfaces';
import { Subject } from 'rxjs';
import { MedicamentsService } from '../medicaments.service';
import { SnackbarService } from 'app/core/util';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GENERIC_STATES } from 'app/data';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-medicament-detail',
    templateUrl: './medicament-detail.component.html',
    styleUrls: ['./medicament-detail.component.scss'],
})
export class MedicamentDetailComponent implements OnInit, OnDestroy {
    public Form: FormGroup;
    public states: Array<SelectItem>;
    private _unsubscribe: Subject<boolean>;

    constructor(
        private readonly _fb: FormBuilder,
        private readonly _snackbar: SnackbarService,
        private readonly _service: MedicamentsService,
        @Inject(MAT_DIALOG_DATA) public data: IMedicine,
        private readonly dialogRef: MatDialogRef<MedicamentDetailComponent>
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
            dosage: [this.data?.dosage],
            sideEffects: [this?.data?.sideEffects],
            name: [this?.data?.name, [Validators.required]],
            description: [this?.data?.description, [Validators.required]],
            isEnabled: [+this?.data?.isEnabled || 0, [Validators.required]],
        });
    }

    public onCreateMedicament() {
        if (this.Form.invalid)
            return Object.values(this.Form.controls).forEach((c) =>
                c.markAsTouched()
            );

        this._service
            .create(this.Form.getRawValue())
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((res) => {
                const message: string = !res
                    ? 'Ha ocurrido un error al crear el medicamento.'
                    : 'El medicamento se ha creado exitósamente.';

                this._snackbar.open(message);
                if (res) this.onCancel();
            });
    }

    public onEditMedicament() {
        if (this.Form.invalid)
            return Object.values(this.Form.controls).forEach((c) =>
                c.markAsTouched()
            );

        this._service
            .update(this.Form.getRawValue())
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((res) => {
                const message: string = !res
                    ? 'Ha ocurrido un error al actualizar el medicamento.'
                    : 'El medicamento se ha actualizado exitósamente.';

                this._snackbar.open(message);
                if (res) this.onCancel();
            });
    }

    public onCancel() {
        this.dialogRef.close();
    }
}
