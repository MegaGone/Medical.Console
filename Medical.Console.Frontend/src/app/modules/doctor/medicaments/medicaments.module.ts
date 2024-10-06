import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicamentsRoutingModule } from './medicaments-routing.module';
import { MedicamentsComponent } from './medicaments.component';

@NgModule({
    declarations: [MedicamentsComponent],
    imports: [CommonModule, MedicamentsRoutingModule],
})
export class MedicamentsModule {}
