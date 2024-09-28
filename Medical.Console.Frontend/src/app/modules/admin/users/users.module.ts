import { NgModule } from '@angular/core';

import { UsersComponent } from './users.component';
import { UsersRoutingModule } from './users-routing.module';
import { UserLogComponent } from './user-log/user-log.component';

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

@NgModule({
    declarations: [UsersComponent, UserLogComponent],
    imports: [
        SharedModule,
        UsersRoutingModule,
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
export class UsersModule {}
