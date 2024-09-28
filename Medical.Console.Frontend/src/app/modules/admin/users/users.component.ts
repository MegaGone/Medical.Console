import { Subject } from 'rxjs';
import { UsersService } from './users.service';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
    private _unsubscribe: Subject<boolean>;

    constructor(
        private readonly _dialog: MatDialog,
        private readonly _service: UsersService
    ) {}

    ngOnInit(): void {
        this._unsubscribe = new Subject();
    }

    ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public createUser(): void {
        const dialogRef = this._dialog.open(UserDetailComponent, {
            width: '500px',
        });

        dialogRef
            .afterClosed()
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((res) => this._service.dialogOpened());
    }
}
