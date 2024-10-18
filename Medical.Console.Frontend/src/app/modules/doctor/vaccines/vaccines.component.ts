import * as XLSX from 'xlsx';
import { Subject } from 'rxjs';
import { IVaccine } from 'app/interfaces';
import { takeUntil } from 'rxjs/operators';
import { SnackbarService } from 'app/core/util';
import { VaccineService } from './vaccine.service';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { getHexadecimalDate, transformDate } from 'app/utils';
import { VaccineDetailComponent } from './vaccine-detail/vaccine-detail.component';

@Component({
    selector: 'app-vaccines',
    templateUrl: './vaccines.component.html',
    styleUrls: ['./vaccines.component.scss'],
})
export class VaccinesComponent implements OnInit, OnDestroy {
    private _unsubscribe: Subject<boolean>;
    public loadingExport: boolean;

    constructor(
        private readonly _dialog: MatDialog,
        private readonly _service: VaccineService,
        private readonly _snackbar: SnackbarService
    ) {
        this.loadingExport = false;
        this._unsubscribe = new Subject();
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public createVaccine(): void {
        const dialogRef = this._dialog.open(VaccineDetailComponent, {
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

            const vaccines: Array<IVaccine> = await this._service.onExport(
                1,
                1000
            );

            if (!vaccines || !vaccines?.length) {
                return this._snackbar.open(
                    'No existen vacunaciones para exportar.'
                );
            }

            const sanitized = vaccines.map(({ id, updatedAt, ...vaccine }) => {
                return {
                    Vacuna: vaccine?.name,
                    Dósis: vaccine?.doseSchedule,
                    Descripción: vaccine?.description,
                    Manufactura: vaccine?.manufacturer,
                    Fecha: transformDate(vaccine?.createdAt?.toString()),
                    Estado:
                        +vaccine?.isEnabled == 0
                            ? 'Inhabilitado'
                            : 'Habilitado',
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
                'Ha ocurrido un error al exportar las vacunaciones.'
            );
        } finally {
            this.loadingExport = false;
        }
    }
}
