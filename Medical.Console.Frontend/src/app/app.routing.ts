import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
// tslint:disable:max-line-length
export const appRoutes: Route[] = [
    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: 'administrador/usuarios' },

    // Redirect signed in user to the '/example'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {
        pathMatch: 'full',
        path: 'signed-in-redirect',
        redirectTo: 'administrador/usuarios',
    },

    // Auth routes for guests
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
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [],
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
                path: 'usuarios',
                loadChildren: () =>
                    import('app/modules/admin/users/users.module').then(
                        (m) => m.UsersModule
                    ),
            },
        ],
    },
];
