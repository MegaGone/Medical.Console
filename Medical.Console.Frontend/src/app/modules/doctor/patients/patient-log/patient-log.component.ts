import {
    OnInit,
    Component,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    OnDestroy,
    AfterViewInit,
    ViewChild,
    ChangeDetectorRef,
} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { merge, Observable, Subject } from 'rxjs';
import { PatientsService } from '../patients.service';
import { IPatient } from 'app/interfaces';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SnackbarService } from 'app/core/util';
import { MatDialog } from '@angular/material/dialog';
import { PatientDetailComponent } from '../patient-detail/patient-detail.component';

@Component({
    selector: 'patient-log',
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    templateUrl: './patient-log.component.html',
    styleUrls: ['./patient-log.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientLogComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatSort) public sort: MatSort;
    @ViewChild(MatPaginator) public paginator: MatPaginator;

    public loading: boolean;
    public patients: IPatient[];
    public patients$: Observable<IPatient[]>;

    public page: number;
    public count: number;
    public pages: number;
    public pageSize: number;
    public pageSizeOptions: number[];

    private _unsubscribe: Subject<boolean>;

    constructor(
        public readonly _dialog: MatDialog,
        private readonly _service: PatientsService,
        private readonly _snackbar: SnackbarService,
        private readonly _changeDetectorRef: ChangeDetectorRef
    ) {
        this.patients = [];
        this.loading = false;
        this._unsubscribe = new Subject();

        this.page = 1;
        this.pages = 0;
        this.count = 0;
        this.pageSize = 10;
        this.pageSizeOptions = [10, 15, 25];
    }

    ngOnInit(): void {
        this._findPatients();
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

                        return this._service.findPatientsPaginated(
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

    public deletePatient(id: number): void {
        this._service
            .deletePatient(id)
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((res) => {
                const message: string = !res
                    ? 'Ha ocurrido un error al inhabilitar el paciente.'
                    : 'Se ha inhabilitado el paciente de manera exitósa.';

                this._snackbar.open(message);

                if (res) {
                    this._findPatients(
                        this.paginator.pageIndex + 1,
                        this.paginator.pageSize
                    );
                }
            });
    }

    public editPatient(patient: IPatient) {
        const dialogRef = this._dialog.open(PatientDetailComponent, {
            width: '500px',
            data: patient,
        });

        dialogRef
            .afterClosed()
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((result) => {
                this._findPatients(
                    this.paginator.pageIndex + 1,
                    this.paginator.pageSize
                );
            });
    }

    private _findPatients(page: number = 1, pageSize: number = 10): void {
        this.loading = true;
        this._service
            .findPatientsPaginated(page, pageSize)
            .pipe(takeUntil(this._unsubscribe))
            .subscribe(
                (res) => {
                    this.patients = res?.data;
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

        this.patients$ = this._service.patients$;
    }

    private _onListenDialog(): void {
        this._service.dialog$
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((res) => {
                this._findPatients(
                    this.paginator.pageIndex + 1,
                    this.paginator.pageSize
                );
            });
    }
}
