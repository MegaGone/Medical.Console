import { NgModule } from '@angular/core';

import { VaccinesComponent } from './vaccines.component';
import { VaccinesRoutingModule } from './vaccines-routing.module';
import { VaccineLogComponent } from './vaccine-log/vaccine-log.component';
import { VaccineDetailComponent } from './vaccine-detail/vaccine-detail.component';

import { SnackbarService } from 'app/core/util';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { SharedModule } from 'app/shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
    declarations: [
        VaccinesComponent,
        VaccineLogComponent,
        VaccineDetailComponent,
    ],
    imports: [
        VaccinesRoutingModule,
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
export class VaccinesModule {}
