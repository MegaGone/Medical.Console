import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import * as XLSX from 'xlsx';
import { MedicalHistoryService } from './medical-history.service';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IMedicHistory, IUser } from 'app/interfaces';
import { MatSelectChange } from '@angular/material/select';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { SnackbarService } from 'app/core/util';
import { getHexadecimalDate, transformDate } from 'app/utils';

@Component({
    selector: 'app-medical-history',
    templateUrl: './medical-history.component.html',
    styleUrls: ['./medical-history.component.scss'],
})
export class MedicalHistoryComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    public isLoadingPatients: boolean;
    public patients: Array<Partial<IUser>>;
    public selectedPatient: Partial<IUser>;

    private _search: Subject<string>;
    private _unsubscribe: Subject<boolean>;

    public canManage: boolean;
    public user: User;

    public loadingExport: boolean;

    constructor(
        private readonly _session: UserService,
        private readonly _cdr: ChangeDetectorRef,
        private readonly _snackbar: SnackbarService,
        private readonly _service: MedicalHistoryService
    ) {
        this._search = new Subject();
        this._unsubscribe = new Subject();

        this.patients = [];
        this.canManage = false;
        this.loadingExport = false;
        this.isLoadingPatients = false;
    }

    ngOnInit(): void {
        this._getSession();
        this._onFilterPatients();
    }

    ngAfterViewInit(): void {
        this._onGetRecords();
        this._cdr.detectChanges();
    }

    ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private _getSession(): void {
        this._session.user$
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((user: User) => {
                this.user = user;
                this.canManage = user?.role != 3;
            });
    }

    private _onFilterPatients(): void {
        this._search
            .pipe(
                debounceTime(500),
                switchMap((input) => this._service.searchAsync(input)),
                takeUntil(this._unsubscribe)
            )
            .subscribe(
                (data) => {
                    this.patients = data;
                },
                (err) => {
                    this.patients = [];
                },
                () => {
                    this.isLoadingPatients = false;
                }
            );
    }

    private _onGetRecords(): void {
        if (this.user?.role != 3) return;

        this.selectedPatient = {
            id: +this.user?.id,
            email: this.user?.email,
            displayName: this.user?.name,
        };

        this._service.patientSelected(this.selectedPatient);
    }

    public onFilterPatients(value: string): void {
        if (!value) return;

        this.isLoadingPatients = true;
        this._search.next(value);
    }

    public onPatientSelected(event: MatSelectChange): void {
        const displayName: string = event.value;
        const patient: Partial<IUser> = this.patients.find(
            (p) => p?.displayName === displayName
        );

        this.selectedPatient = patient;
        this._service.patientSelected(this.selectedPatient);
    }

    public async onExportData() {
        try {
            if (!this.selectedPatient && !this.selectedPatient?.id) return;

            this.loadingExport = true;
            const history: Array<IMedicHistory> = await this._service.onExport(
                this.selectedPatient.id
            );

            const sanitized = history.map(({ id, ...h }) => {
                return {
                    'Número de cita': h?.identificator,
                    Tratamiento: h?.treatment,
                    'Fecha de visita': transformDate(h?.visitedAt?.toString()),
                    Diagnóstico: h?.diagnosis,
                    'Notas adicionales': h?.notes,
                    'Médico encargado': h?.doctor?.displayName,
                };
            });

            const basename: string = getHexadecimalDate();
            const filename: string = `${basename}.xlsx`;

            const ws = XLSX.utils.aoa_to_sheet([]);
            const wb = XLSX.utils.book_new();
            XLSX.utils.sheet_add_json(ws, sanitized);

            XLSX.utils.book_append_sheet(wb, ws, basename);
            XLSX.writeFile(wb, filename);
        } catch (error) {
            return this._snackbar.open(
                'Ha ocurrido un error al exportar el historial médico.'
            );
        } finally {
            this.loadingExport = false;
        }
    }
}
