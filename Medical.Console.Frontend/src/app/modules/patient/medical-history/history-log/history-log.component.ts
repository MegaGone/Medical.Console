import {
    OnInit,
    Component,
    OnDestroy,
    ViewChild,
    ChangeDetectorRef,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    AfterViewInit,
} from '@angular/core';
import { MedicalHistoryService } from '../medical-history.service';
import { merge, Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { IMedicHistory, IUser } from 'app/interfaces';
import { SnackbarService } from 'app/core/util';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'history-log',
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    templateUrl: './history-log.component.html',
    styleUrls: ['./history-log.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryLogComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatSort) public sort: MatSort;
    @ViewChild(MatPaginator) public paginator: MatPaginator;

    public loading: boolean;
    public optionSelected: boolean;
    public medicalHistories: IMedicHistory[];
    public medicalHistories$: Observable<IMedicHistory[]>;

    public page: number;
    public count: number;
    public pages: number;
    public pageSize: number;
    public pageSizeOptions: number[];

    public patientSelected: Partial<IUser>;
    private _unsubscribe: Subject<boolean>;

    constructor(
        private readonly _snackbar: SnackbarService,
        private readonly _service: MedicalHistoryService,
        private readonly _changeDetectorRef: ChangeDetectorRef
    ) {
        this.loading = false;
        this.medicalHistories = [];
        this.optionSelected = false;
        this._unsubscribe = new Subject();

        this.page = 1;
        this.pages = 0;
        this.count = 0;
        this.pageSize = 10;
        this.pageSizeOptions = [10, 15, 25];
    }

    ngOnInit(): void {
        this._onListenSelectedPatient();
    }

    ngAfterViewInit(): void {
        if (this.sort && this.paginator) {
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

    private _findMedicalHistories(
        id: number,
        page: number = 1,
        pageSize: number = 10
    ) {
        this.loading = true;
        this._service
            .findPaginated(id, page, pageSize)
            .pipe(takeUntil(this._unsubscribe))
            .subscribe(
                (res) => {
                    this.medicalHistories = res?.data;
                    this.count = res?.count;
                },
                () => {
                    this._snackbar.open(
                        'Ha ocurrido un error al obtener el historial médico.'
                    );
                },
                () => {
                    this.loading = false;
                    this._changeDetectorRef.markForCheck();
                }
            );

        this.medicalHistories$ = this._service.medicHistories$;
    }

    private _onListenSelectedPatient(): void {
        this._service.patientSelected$
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((patient) => {
                if (patient) {
                    this.optionSelected = true;
                    this.patientSelected = patient;
                    this._findMedicalHistories(patient.id);
                    this._changeDetectorRef.markForCheck();
                }
            });
    }

    public onDelete(id: number) {
        this._service
            .delete(id)
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((res) => {
                const message: string = !res
                    ? 'Ha ocurrido un error al ocultar el historial.'
                    : 'Se ha ocultado el historial de manera exitósa.';

                this._snackbar.open(message);
                if (res) {
                    this._findMedicalHistories(
                        this.patientSelected?.id,
                        this.paginator.pageIndex + 1,
                        this.paginator.pageSize
                    );
                }
            });
    }
}
