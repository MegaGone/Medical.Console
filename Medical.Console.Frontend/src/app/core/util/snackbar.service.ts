import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root',
})
export class SnackbarService {
    constructor(private readonly _snackBar: MatSnackBar) {}

    public open(message: string, isSuccess = true, action = 'OK'): void {
        const options: MatSnackBarConfig = {
            verticalPosition: 'top',
            duration: 4000,
            horizontalPosition: 'center',
        };

        if (!isSuccess) {
            options.panelClass = ['snackbar-error'];
        }

        this._snackBar.open(message, action, options);
    }

    public openSnackBar(
        message: string,
        options: MatSnackBarConfig = {
            verticalPosition: 'top',
            duration: 3000,
            horizontalPosition: 'center',
        },
        action: string = 'OK'
    ): void {
        this._snackBar.open(message, action, options);
    }
}
