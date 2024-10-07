import { NgModule } from '@angular/core';

import { PatientsComponent } from './patients.component';
import { PatientLogComponent } from './patient-log/patient-log.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';

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
import { PatientsRoutingModule } from './patients-routing.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
    declarations: [
        PatientsComponent,
        PatientDetailComponent,
        PatientLogComponent,
    ],
    imports: [
        PatientsRoutingModule,
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
})
export class PatientsModule {}
