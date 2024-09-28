import {
    OnInit,
    Component,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    OnDestroy,
    ViewChild,
    AfterViewInit,
    ChangeDetectorRef,
} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { UsersService } from '../users.service';
import { IUser } from 'app/interfaces';
import { merge, Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { ROLE_ENUM } from 'app/enum';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { UserDetailComponent } from '../user-detail/user-detail.component';

@Component({
    selector: 'user-log',
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    templateUrl: './user-log.component.html',
    styleUrls: ['./user-log.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserLogComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(MatSort) public sort: MatSort;
    @ViewChild(MatPaginator) public paginator: MatPaginator;

    public users: IUser[];
    public loading: boolean;
    public users$: Observable<IUser[]>;

    private _unsubscribe: Subject<boolean>;

    public page: number;
    public count: number;
    public pages: number;
    public pageSize: number;
    public pageSizeOptions: number[];

    constructor(
        public readonly _dialog: MatDialog,
        private readonly _service: UsersService,
        private readonly _changeDetectorRef: ChangeDetectorRef
    ) {
        this.users = [];
        this.loading = false;
        this._unsubscribe = new Subject();

        this.page = 1;
        this.pages = 0;
        this.count = 0;
        this.pageSize = 10;
        this.pageSizeOptions = [10, 15, 25];
    }

    ngOnInit(): void {
        this._findUsers();
        this._onListenDialog();
    }

    ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    ngAfterViewInit(): void {
        if (this.sort && this.paginator) {
            this.sort.sort({
                start: 'asc',
                id: 'displayName',
                disableClear: true,
            });

            this._changeDetectorRef.markForCheck();

            merge(this.sort.sortChange, this.paginator.page)
                .pipe(
                    switchMap(() => {
                        this.loading = true;
                        this.pageSize = this.paginator.pageSize;

                        return this._service.findUsersPaginated(
                            this.paginator.pageIndex + 1,
                            this.paginator.pageSize
                        );
                    }),
                    map(() => (this.loading = false))
                )
                .pipe(takeUntil(this._unsubscribe))
                .subscribe();
        }
    }

    private _findUsers(page: number = 1, pageSize: number = 10): void {
        this.loading = true;
        this._service
            .findUsersPaginated(page, pageSize)
            .pipe(takeUntil(this._unsubscribe))
            .subscribe(
                (res) => {
                    this.users = res?.data;
                    this.count = res?.count;
                },
                () => {},
                () => {
                    this.loading = false;
                }
            );

        this.users$ = this._service.users$;
    }

    private _onListenDialog(): void {
        this._service.dialog$
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((res) => {
                console.log('RES -------------->', res);
                this._findUsers(
                    this.paginator.pageIndex + 1,
                    this.paginator.pageSize
                );
            });
    }

    public deleteUser(id: number): void {
        this._service
            .deleteUser(id)
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((res) => {
                if (res) {
                    this._findUsers(
                        this.paginator.pageIndex + 1,
                        this.paginator.pageSize
                    );
                }
            });
    }

    public openDialog(user: IUser) {
        const dialogRef = this._dialog.open(UserDetailComponent, {
            width: '500px',
            data: user,
        });
        dialogRef
            .afterClosed()
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((result) => {
                this._findUsers(
                    this.paginator.pageIndex + 1,
                    this.paginator.pageSize
                );
            });
    }

    public translateRole(role: number): string {
        switch (role) {
            case ROLE_ENUM.ADMIN:
                return 'Administrador';
            case ROLE_ENUM.DOCTOR:
                return 'Médico';
            case ROLE_ENUM.PATIENT:
                return 'Paciente';
        }
    }
}
