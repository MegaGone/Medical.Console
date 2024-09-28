import { GENERIC_STATES, ROLES } from 'app/data';
import { IUser, SelectItem } from 'app/interfaces';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../users.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit, OnDestroy {
    public Form: FormGroup;
    public roles: Array<SelectItem>;
    public states: Array<SelectItem>;

    private _unsubscribe: Subject<boolean>;

    constructor(
        private readonly _fb: FormBuilder,
        private readonly _service: UsersService,
        @Inject(MAT_DIALOG_DATA) public data: IUser,
        private readonly dialogRef: MatDialogRef<UserDetailComponent>
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
            role: [this?.data?.role, [Validators.required]],
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

    public onKeyDown(event: KeyboardEvent) {
        if (event.code === 'Space') event.preventDefault();
    }

    public onCancel() {
        this.dialogRef.close();
    }

    public onCreateUser() {
        if (this.Form.invalid)
            return Object.values(this.Form.controls).forEach((c) =>
                c.markAsTouched()
            );

        this._service
            .createUser(this.Form.getRawValue())
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((res) => {
                if (res) this.onCancel();
            });
    }

    public onEditUser() {
        if (this.Form.invalid)
            return Object.values(this.Form.controls).forEach((c) =>
                c.markAsTouched()
            );

        const { password, ...user } = this.Form.getRawValue();

        this._service
            .updateUser(user)
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((res) => {
                if (res) this.onCancel();
            });
    }
}
