import { Subject } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { IMedicine, IUser, IVaccine } from 'app/interfaces';
import { MedicalHistoryService } from '../medical-history.service';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'app-history-detail',
    templateUrl: './history-detail.component.html',
    styleUrls: ['./history-detail.component.scss'],
})
export class HistoryDetailComponent implements OnInit, OnDestroy {
    public user: User;
    public currentDate: Date;

    public isLoadingPatients: boolean;
    public patients: Array<Partial<IUser>>;
    public selectedPatient: Partial<IUser>;

    public isLoadingMedicines: boolean;
    public medicaments: Array<Partial<IMedicine>>;

    public isLoadingVaccines: boolean;
    public vaccines: Array<Partial<IVaccine>>;

    private _search: Subject<string>;
    private _unsubscribe: Subject<boolean>;
    private _vaccineSearch: Subject<string>;
    private _medicineSearch: Subject<string>;

    constructor(
        private readonly _session: UserService,
        private readonly _service: MedicalHistoryService,
        private readonly _changeDetectorRef: ChangeDetectorRef
    ) {
        this.currentDate = new Date();
        this._unsubscribe = new Subject();

        this.patients = [];
        this.isLoadingPatients = false;

        this.medicaments = [];
        this.isLoadingMedicines = false;

        this.vaccines = [];
        this.isLoadingVaccines = false;

        this._search = new Subject();
        this._vaccineSearch = new Subject();
        this._medicineSearch = new Subject();
    }

    ngOnInit(): void {
        this._getSession();
        this._onFilterPatients();
        this._onFilterVaccines();
        this._onFilterMedicines();
    }

    ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private _getSession() {
        this._session.user$
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((user: User) => {
                this.user = user;
                this._changeDetectorRef.markForCheck();

                console.log(this.user);
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

    private _onFilterMedicines(): void {
        this._medicineSearch
            .pipe(
                debounceTime(500),
                switchMap((input) => this._service.searchMedicineAsync(input)),
                takeUntil(this._unsubscribe)
            )
            .subscribe(
                (data) => {
                    this.medicaments = data;
                },
                (err) => {
                    this.medicaments = [];
                },
                () => {
                    this.isLoadingMedicines = false;
                }
            );
    }

    private _onFilterVaccines(): void {
        this._vaccineSearch
            .pipe(
                debounceTime(500),
                switchMap((input) => this._service.searchVaccineAsync(input)),
                takeUntil(this._unsubscribe)
            )
            .subscribe(
                (data) => {
                    this.vaccines = data;
                },
                (err) => {
                    this.vaccines = [];
                },
                () => {
                    this.isLoadingVaccines = false;
                }
            );
    }

    public onFilterPatients(value: string): void {
        if (!value) return;

        this.isLoadingPatients = true;
        this._search.next(value);
    }

    public onFilterMedicines(value: string): void {
        if (!value) return;

        this.isLoadingMedicines = true;
        this._medicineSearch.next(value);
    }

    public onFilterVaccines(value: string): void {
        if (!value) return;

        this.isLoadingVaccines = true;
        this._vaccineSearch.next(value);
    }

    // TODO:
    // 1. CREAR ENDPOINTS PARA BUSCAR MEDICNAS Y MEDICAMENTOS POR NOMBRE DE MANERA ASYNC.
    // 2. ALMACENAR LOS ID'S SELECCIONADOS EN UN ARRAY PROVISIONAL Y MOSTRARLOS EN EL HTML.
    // 3. ALMACENAR CITA
    // 4. REDIREACCIONAR A VISTA
    // 5. SI SE CREA BIEN, REDIRECCIONAR CON EL USUARIO RECIEN CREADA LA CITA.
}
