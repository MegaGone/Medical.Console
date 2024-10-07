import {
    OnInit,
    Component,
    ViewChild,
    ChangeDetectorRef,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    AfterViewInit,
    OnDestroy,
} from '@angular/core';
import { IMedicine } from 'app/interfaces';
import { SnackbarService } from 'app/core/util';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { MedicamentsService } from '../medicaments.service';
import { MedicamentDetailComponent } from '../medicament-detail/medicament-detail.component';

@Component({
    selector: 'medicament-log',
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    templateUrl: './medicament-log.component.html',
    styleUrls: ['./medicament-log.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicamentLogComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild(MatSort) public sort: MatSort;
    @ViewChild(MatPaginator) public paginator: MatPaginator;

    public loading: boolean;
    public medicaments: IMedicine[];
    public medicaments$: Observable<IMedicine[]>;

    public page: number;
    public count: number;
    public pages: number;
    public pageSize: number;
    public pageSizeOptions: number[];

    private _unsubscribe: Subject<boolean>;

    constructor(
        public readonly _dialog: MatDialog,
        private readonly _snackbar: SnackbarService,
        private readonly _service: MedicamentsService,
        private readonly _changeDetectorRef: ChangeDetectorRef
    ) {
        this.loading = false;
        this.medicaments = [];
        this._unsubscribe = new Subject();

        this.page = 1;
        this.pages = 0;
        this.count = 0;
        this.pageSize = 10;
        this.pageSizeOptions = [10, 15, 25];
    }

    ngOnInit(): void {
        this._findMedicaments();
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

    private _findMedicaments(page: number = 1, pageSize: number = 10): void {
        this.loading = true;
        this._service
            .findPaginated(page, pageSize)
            .pipe(takeUntil(this._unsubscribe))
            .subscribe(
                (res) => {
                    this.medicaments = res?.data;
                    this.count = res?.count;
                },
                () => {
                    this._snackbar.open(
                        'Ha ocurrido un error al obtener los pacientes.'
                    );
                },
                () => {
                    this.loading = false;
                }
            );

        this.medicaments$ = this._service.medicines$;
    }

    private _onListenDialog(): void {
        this._service.dialog$
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((res) => {
                this._findMedicaments(
                    this.paginator.pageIndex + 1,
                    this.paginator.pageSize
                );
            });
    }

    public deleteMedicament(id: number): void {
        this._service
            .delete(id)
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((res) => {
                const message: string = !res
                    ? 'Ha ocurrido un error al inhabilitar el medicamento.'
                    : 'Se ha inhabilitado el medicamento de manera exitósa.';

                this._snackbar.open(message);

                if (res) {
                    this._findMedicaments(
                        this.paginator.pageIndex + 1,
                        this.paginator.pageSize
                    );
                }
            });
    }

    public editMedicament(medicament: IMedicine) {
        const dialogRef = this._dialog.open(MedicamentDetailComponent, {
            width: '500px',
            data: medicament,
        });

        dialogRef
            .afterClosed()
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((result) => {
                this._findMedicaments(
                    this.paginator.pageIndex + 1,
                    this.paginator.pageSize
                );
            });
    }
}
