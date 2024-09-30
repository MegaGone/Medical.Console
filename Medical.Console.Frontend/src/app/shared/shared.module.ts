import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SnackbarService } from 'app/core/util';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        MatSnackBarModule,
        ReactiveFormsModule,
    ],
    exports: [
        FormsModule,
        CommonModule,
        MatSnackBarModule,
        ReactiveFormsModule,
    ],
    providers: [SnackbarService],
})
export class SharedModule {}
