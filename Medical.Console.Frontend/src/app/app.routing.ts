import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { NavigationUtilService } from './core/util';

const main: string = NavigationUtilService.main();

// @formatter:off
// tslint:disable:max-line-length
export const appRoutes: Route[] = [
    { path: '', pathMatch: 'full', redirectTo: `${main}` },
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'forgot-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/forgot-password/forgot-password.module'
                    ).then((m) => m.AuthForgotPasswordModule),
            },
            {
                path: 'sign-in',
                loadChildren: () =>
                    import('app/modules/auth/sign-in/sign-in.module').then(
                        (m) => m.AuthSignInModule
                    ),
            },
        ],
    },
    {
        path: 'administrador',
        canActivate: [AuthGuard],
        component: LayoutComponent,
        canActivateChild: [AuthGuard],
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'usuarios',
                loadChildren: () =>
                    import('app/modules/admin/users/users.module').then(
                        (m) => m.UsersModule
                    ),
            },
            {
                path: 'medicamentos',
                loadChildren: () =>
                    import(
                        'app/modules/doctor/medicaments/medicaments.module'
                    ).then((m) => m.MedicamentsModule),
            },
            {
                path: 'vacunaciones',
                loadChildren: () =>
                    import('app/modules/doctor/vaccines/vaccines.module').then(
                        (m) => m.VaccinesModule
                    ),
            },
        ],
    },
    {
        path: 'doctor',
        canActivate: [AuthGuard],
        component: LayoutComponent,
        canActivateChild: [AuthGuard],
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'pacientes',
                loadChildren: () =>
                    import('app/modules/doctor/patients/patients.module').then(
                        (m) => m.PatientsModule
                    ),
            },
            {
                path: 'medicamentos',
                loadChildren: () =>
                    import(
                        'app/modules/doctor/medicaments/medicaments.module'
                    ).then((m) => m.MedicamentsModule),
            },
            {
                path: 'vacunaciones',
                loadChildren: () =>
                    import('app/modules/doctor/vaccines/vaccines.module').then(
                        (m) => m.VaccinesModule
                    ),
            },
        ],
    },
    {
        path: 'paciente',
        canActivate: [AuthGuard],
        component: LayoutComponent,
        canActivateChild: [AuthGuard],
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'historial',
                loadChildren: () =>
                    import(
                        'app/modules/patient/medical-history/medical-history.module'
                    ).then((m) => m.MedicalHistoryModule),
            },
        ],
    },
    { path: '**', pathMatch: 'full', redirectTo: `${main}` },
];
