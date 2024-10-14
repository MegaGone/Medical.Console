import { Subject } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import {
    IMedicHistory,
    IMedicine,
    IUser,
    IUserMedicine,
    IUserVaccine,
    IVaccine,
} from 'app/interfaces';
import { MedicalHistoryService } from '../medical-history.service';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from 'app/core/util';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-history-detail',
    templateUrl: './history-detail.component.html',
    styleUrls: ['./history-detail.component.scss'],
})
export class HistoryDetailComponent implements OnInit, OnDestroy {
    public doctor: User;
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

    public Form: FormGroup;
    public selectedVaccines: number[];
    public selectedMedicines: number[];

    public maxLengthNotes: number;
    public maxLengthDiagnosis: number;
    public maxLengthTreatment: number;

    public isNewHistory: boolean;
    public loadingHistory: boolean;
    public history: Partial<IMedicHistory>;

    constructor(
        private readonly _router: Router,
        private readonly _fb: FormBuilder,
        private readonly _session: UserService,
        private readonly _route: ActivatedRoute,
        private readonly _snackbar: SnackbarService,
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

        this.selectedVaccines = [];
        this.selectedMedicines = [];

        this.maxLengthNotes = 150;
        this.maxLengthDiagnosis = 300;
        this.maxLengthTreatment = 300;

        this.isNewHistory = true;
        this.loadingHistory = false;
    }

    ngOnInit(): void {
        this._onGetParam();

        this._getSession();
        this._initForm();
        this._onFilterPatients();
        this._onFilterVaccines();
        this._onFilterMedicines();
    }

    ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private _initForm(): void {
        this.Form = this._fb.group({
            vaccineIds: [],
            medicineIds: [],
            notes: ['', [Validators.required]],
            userId: ['', [Validators.required]],
            diagnosis: ['', [Validators.required]],
            treatment: ['', [Validators.required]],
            doctorId: [this.doctor?.id || null, [Validators.required]],
        });
    }

    private _getSession(): void {
        this._session.user$
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((user: User) => {
                this.doctor = user;
                this._changeDetectorRef.markForCheck();
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
                    const mergedMedicines = [
                        ...this.medicaments,
                        ...data,
                    ].filter(
                        (value, index, self) =>
                            index === self.findIndex((m) => m.id === value.id)
                    );
                    this.medicaments = mergedMedicines;
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
                    const mergedVaccines = [...this.vaccines, ...data].filter(
                        (value, index, self) =>
                            index === self.findIndex((m) => m.id === value.id)
                    );

                    this.vaccines = mergedVaccines;
                },
                (err) => {
                    this.vaccines = [];
                },
                () => {
                    this.isLoadingVaccines = false;
                }
            );
    }

    private _onGetParam(): void {
        const identificator: string = this._route.snapshot.paramMap.get('id');

        if (!identificator) this._router.navigate(['../']);
        if (identificator === 'nueva-cita') return;

        this.isNewHistory = false;
        this._onGetMedicHistory(+identificator);
    }

    private _onGetMedicHistory(id: number): void {
        this.loadingHistory = true;

        this._service
            .findOne(id)
            .pipe(takeUntil(this._unsubscribe))
            .subscribe(
                (res) => {
                    if (!res) {
                        this._router.navigate(['/paciente/historial']);
                        return;
                    }

                    this.history = res;
                    this._onSetData();
                },
                (err) => {
                    this._router.navigate(['/paciente/historial']);
                },
                () => {
                    this.loadingHistory = false;
                }
            );
    }

    private _onSetData(): void {
        this.Form.patchValue({
            notes: this.history?.notes,
            diagnosis: this.history?.diagnosis,
            treatment: this.history?.treatment,
            userId: this.history?.patient?.displayName,
        });

        const { medicines, vaccines } = this.history;

        this._handleUserVaccine(vaccines);
        this._handleUserMedicine(medicines);

        Object.keys(this.Form.controls).forEach((key) => {
            this.Form.get(key)?.disable({ onlySelf: true, emitEvent: false });
        });
    }

    private _handleUserMedicine(medicines: Array<IUserMedicine>): void {
        if (!medicines || !medicines?.length) return;

        const sanitized: Array<Partial<IMedicine>> = medicines?.map(
            (m: IUserMedicine) => {
                return {
                    ...m?.medicine,
                };
            }
        );

        this.medicaments = sanitized;
        this.selectedMedicines = sanitized?.map((m) => m?.id);

        this.Form.patchValue({
            medicineIds: this.selectedMedicines,
        });
    }

    private _handleUserVaccine(vaccines: Array<IUserVaccine>): void {
        if (!vaccines || !vaccines?.length) return;

        const sanitized: Array<Partial<IVaccine>> = vaccines?.map(
            (v: IUserVaccine) => {
                return {
                    ...v?.vaccine,
                };
            }
        );

        this.vaccines = sanitized;
        this.selectedVaccines = sanitized?.map((v) => v?.id);

        this.Form.patchValue({
            vaccineIds: this.selectedVaccines,
        });
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

    public onSelectionChange(selectedIds: number[]): void {
        this.selectedMedicines = selectedIds;
    }

    public onVaccineChange(selectedIds: number[]): void {
        this.selectedVaccines = selectedIds;
    }

    public onRegister() {
        if (this.Form.invalid)
            return Object.values(this.Form.controls).forEach((c) =>
                c.markAsTouched()
            );

        this._service
            .create(this.Form.getRawValue())
            .pipe(takeUntil(this._unsubscribe))
            .subscribe(
                (res) => {
                    const message: string = !res
                        ? 'Ha ocurrido un error al crear el historial médico.'
                        : 'El historial médico se ha creado exitósamente.';

                    this._snackbar.open(message);
                },
                (err) => {
                    this._snackbar.open(
                        'Ha ocurrido un error al crear el historial médico.'
                    );
                },
                () => {
                    setTimeout(() => {
                        this._router.navigate(['/paciente/historial']);
                    }, 1000);
                }
            );
    }
}
