import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { MedicalHistoryService } from './medical-history.service';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IUser } from 'app/interfaces';
import { MatSelectChange } from '@angular/material/select';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';

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

    constructor(
        private readonly _session: UserService,
        private readonly _cdr: ChangeDetectorRef,
        private readonly _service: MedicalHistoryService
    ) {
        this._search = new Subject();
        this._unsubscribe = new Subject();

        this.patients = [];
        this.canManage = false;
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
}
