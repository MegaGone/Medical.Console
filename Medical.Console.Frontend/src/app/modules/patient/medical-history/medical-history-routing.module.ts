import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicalHistoryComponent } from './medical-history.component';
import { HistoryDetailComponent } from './history-detail/history-detail.component';

const routes: Routes = [
    {
        path: '',
        component: MedicalHistoryComponent,
    },
    {
        path: ':id',
        component: HistoryDetailComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MedicalHistoryRoutingModule {}
