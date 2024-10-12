import { Subject } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { User } from 'app/core/user/user.types';
import { IUser } from 'app/interfaces';
import { MedicalHistoryService } from '../medical-history.service';

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

    private _search: Subject<string>;
    private _unsubscribe: Subject<boolean>;

    constructor(
        private readonly _session: UserService,
        private readonly _service: MedicalHistoryService,
        private readonly _changeDetectorRef: ChangeDetectorRef
    ) {
        this.currentDate = new Date();
        this._unsubscribe = new Subject();

        this.patients = [];
        this._search = new Subject();
        this.isLoadingPatients = false;
    }

    ngOnInit(): void {
        this._getSession();
        this._onFilterPatients();
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

    public onFilterPatients(value: string): void {
        if (!value) return;

        this.isLoadingPatients = true;
        this._search.next(value);
    }

    // TODO:
    // 1. CREAR ENDPOINTS PARA BUSCAR MEDICNAS Y MEDICAMENTOS POR NOMBRE DE MANERA ASYNC.
    // 2. ALMACENAR LOS ID'S SELECCIONADOS EN UN ARRAY PROVISIONAL Y MOSTRARLOS EN EL HTML.
    // 3. ALMACENAR CITA
    // 4. REDIREACCIONAR A VISTA
    // 5. SI SE CREA BIEN, REDIRECCIONAR CON EL USUARIO RECIEN CREADA LA CITA.
}
