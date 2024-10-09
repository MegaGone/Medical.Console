import { fuseAnimations } from '@fuse/animations';
import {
    OnInit,
    Component,
    OnDestroy,
    ViewChild,
    AfterViewInit,
    ViewEncapsulation,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
} from '@angular/core';
import { IVaccine } from 'app/interfaces';
import { SnackbarService } from 'app/core/util';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, Subject } from 'rxjs';
import { VaccineService } from '../vaccine.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { VaccineDetailComponent } from '../vaccine-detail/vaccine-detail.component';

@Component({
    selector: 'vaccine-log',
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    templateUrl: './vaccine-log.component.html',
    styleUrls: ['./vaccine-log.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VaccineLogComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatSort) public sort: MatSort;
    @ViewChild(MatPaginator) public paginator: MatPaginator;

    public loading: boolean;
    public vaccines: IVaccine[];
    public vaccines$: Observable<IVaccine[]>;

    public page: number;
    public count: number;
    public pages: number;
    public pageSize: number;
    public pageSizeOptions: number[];

    private _unsubscribe: Subject<boolean>;

    constructor(
        public readonly _dialog: MatDialog,
        private readonly _service: VaccineService,
        private readonly _snackbar: SnackbarService,
        private readonly _changeDetectorRef: ChangeDetectorRef
    ) {
        this.vaccines = [];
        this.loading = false;
        this._unsubscribe = new Subject();

        this.page = 1;
        this.pages = 0;
        this.count = 0;
        this.pageSize = 10;
        this.pageSizeOptions = [10, 15, 25];
    }

    ngOnInit(): void {
        this._findVaccines();
        this._onListenDialog();
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

                        return this._service.findPaginated(
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

    ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private _findVaccines(page: number = 1, pageSize: number = 10): void {
        this.loading = true;
        this._service
            .findPaginated(page, pageSize)
            .pipe(takeUntil(this._unsubscribe))
            .subscribe(
                (res) => {
                    this.vaccines = res?.data;
                    this.count = res?.count;
                },
                () => {
                    this._snackbar.open(
                        'Ha ocurrido un error al obtener las vacunaciones.'
                    );
                },
                () => {
                    this.loading = false;
                }
            );

        this.vaccines$ = this._service.vaccines$;
    }

    private _onListenDialog(): void {
        this._service.dialog$
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((res) => {
                this._findVaccines(
                    this.paginator.pageIndex + 1,
                    this.paginator.pageSize
                );
            });
    }

    public deleteVaccine(id: number): void {
        this._service
            .delete(id)
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((res) => {
                const message: string = !res
                    ? 'Ha ocurrido un error al inhabilitar la vacunación.'
                    : 'Se ha inhabilitado la vacunación de manera exitósa.';

                this._snackbar.open(message);

                if (res) {
                    this._findVaccines(
                        this.paginator.pageIndex + 1,
                        this.paginator.pageSize
                    );
                }
            });
    }

    public editVaccine(medicament: IVaccine) {
        const dialogRef = this._dialog.open(VaccineDetailComponent, {
            width: '500px',
            data: medicament,
        });

        dialogRef
            .afterClosed()
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((result) => {
                this._findVaccines(
                    this.paginator.pageIndex + 1,
                    this.paginator.pageSize
                );
            });
    }
}
