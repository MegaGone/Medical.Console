import * as XLSX from 'xlsx';
import { Subject } from 'rxjs';
import { IMedicine } from 'app/interfaces';
import { takeUntil } from 'rxjs/operators';
import { SnackbarService } from 'app/core/util';
import { MatDialog } from '@angular/material/dialog';
import { MedicamentsService } from './medicaments.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { getHexadecimalDate, transformDate } from 'app/utils';
import { MedicamentDetailComponent } from './medicament-detail/medicament-detail.component';

@Component({
    selector: 'app-medicaments',
    templateUrl: './medicaments.component.html',
    styleUrls: ['./medicaments.component.scss'],
})
export class MedicamentsComponent implements OnInit, OnDestroy {
    private _unsubscribe: Subject<boolean>;
    public loadingExport: boolean;

    constructor(
        private readonly _dialog: MatDialog,
        private readonly _snackbar: SnackbarService,
        private readonly _service: MedicamentsService
    ) {
        this.loadingExport = false;
        this._unsubscribe = new Subject();
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public createMedicament(): void {
        const dialogRef = this._dialog.open(MedicamentDetailComponent, {
            width: '500px',
        });

        dialogRef
            .afterClosed()
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((res) => this._service.dialogOpened());
    }

    public async onExportData() {
        try {
            this.loadingExport = true;
            const medicines: Array<IMedicine> = await this._service.onExport(
                1,
                1000
            );

            if (!medicines || !medicines?.length) {
                return this._snackbar.open(
                    'No existen medicamentos para exportar.'
                );
            }

            const sanitized = medicines.map(
                ({ id, updatedAt, ...medicine }) => {
                    return {
                        Medicamento: medicine?.name,
                        Dósis: medicine?.dosage,
                        Descripción: medicine?.description,
                        Fecha: transformDate(medicine?.createdAt?.toString()),
                        Estado:
                            +medicine?.isEnabled == 0
                                ? 'Inhabilitado'
                                : 'Habilitado',
                        'Efectos secundarios': medicine?.sideEffects,
                    };
                }
            );

            const basename: string = getHexadecimalDate();
            const filename: string = `${basename}.xlsx`;

            const ws = XLSX.utils.aoa_to_sheet([]);
            const wb = XLSX.utils.book_new();
            XLSX.utils.sheet_add_json(ws, sanitized);

            XLSX.utils.book_append_sheet(wb, ws, basename);
            XLSX.writeFile(wb, filename);
        } catch (error) {
            return this._snackbar.open(
                'Ha ocurrido un error al exportar los medicamentos.'
            );
        } finally {
            this.loadingExport = false;
        }
    }
}
