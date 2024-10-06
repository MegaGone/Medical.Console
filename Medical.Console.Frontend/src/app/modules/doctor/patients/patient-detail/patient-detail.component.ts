import { Subject } from 'rxjs';
import { SnackbarService } from 'app/core/util';
import { GENERIC_STATES, ROLES } from 'app/data';
import { IPatient, SelectItem } from 'app/interfaces';
import { PatientsService } from '../patients.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-patient-detail',
    templateUrl: './patient-detail.component.html',
    styleUrls: ['./patient-detail.component.scss'],
})
export class PatientDetailComponent implements OnInit, OnDestroy {
    public Form: FormGroup;
    public roles: Array<SelectItem>;
    public states: Array<SelectItem>;
    private _unsubscribe: Subject<boolean>;

    constructor(
        private readonly _fb: FormBuilder,
        private readonly _service: PatientsService,
        private readonly _snackbar: SnackbarService,
        @Inject(MAT_DIALOG_DATA) public data: IPatient,
        private readonly dialogRef: MatDialogRef<PatientDetailComponent>
    ) {
        this.roles = [...ROLES];
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
            password: [null, [Validators.required]],
            email: [this?.data?.email, [Validators.required]],
            lastName: [this?.data?.lastName, [Validators.required]],
            firstName: [this?.data?.firstName, [Validators.required]],
            displayName: [this?.data?.displayName, [Validators.required]],
            isEnabled: [+this?.data?.isEnabled || 0, [Validators.required]],
        });

        if (this.data) {
            this.Form.controls?.password?.clearValidators();
        }
    }

    public onCreatePatient() {
        if (this.Form.invalid)
            return Object.values(this.Form.controls).forEach((c) =>
                c.markAsTouched()
            );

        this._service
            .createPatient(this.Form.getRawValue())
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((res) => {
                const message: string = !res
                    ? 'Ha ocurrido un error al crear el paciente.'
                    : 'El paciente se ha creado exitósamente.';

                this._snackbar.open(message);
                if (res) this.onCancel();
            });
    }

    public onEditPatient() {
        if (this.Form.invalid)
            return Object.values(this.Form.controls).forEach((c) =>
                c.markAsTouched()
            );

        const { password, ...user } = this.Form.getRawValue();

        this._service
            .updatePatient(user)
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((res) => {
                const message: string = !res
                    ? 'Ha ocurrido un error al actualizar el paciente.'
                    : 'El paciente se ha actualizado exitósamente.';

                this._snackbar.open(message);
                if (res) this.onCancel();
            });
    }

    public onKeyDown(event: KeyboardEvent) {
        if (event.code === 'Space') event.preventDefault();
    }

    public onCancel() {
        this.dialogRef.close();
    }
}
