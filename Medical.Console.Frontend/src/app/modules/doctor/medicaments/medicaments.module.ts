import { NgModule } from '@angular/core';

import { MedicamentsRoutingModule } from './medicaments-routing.module';
import { MedicamentsComponent } from './medicaments.component';

import { SharedModule } from 'app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MedicamentLogComponent } from './medicament-log/medicament-log.component';
import { MedicamentDetailComponent } from './medicament-detail/medicament-detail.component';
import { SnackbarService } from 'app/core/util';

@NgModule({
    declarations: [
        MedicamentsComponent,
        MedicamentLogComponent,
        MedicamentDetailComponent,
    ],
    imports: [
        MedicamentsRoutingModule,
        SharedModule,
        MatIconModule,
        MatMenuModule,
        MatSortModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatRippleModule,
        MatDialogModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatProgressBarModule,
        MatSlideToggleModule,
        MatSlideToggleModule,
    ],
    providers: [SnackbarService],
})
export class MedicamentsModule {}
