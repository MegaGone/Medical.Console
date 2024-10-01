import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import {
    compactNavigation,
    defaultNavigation,
    futuristicNavigation,
    horizontalNavigation,
} from 'app/mock-api/common/navigation/data';
import { StorageService } from 'app/core/util';
import { AuthService } from 'app/core/auth/auth.service';

@Injectable({
    providedIn: 'root',
})
export class NavigationMockApi {
    private readonly _compactNavigation: FuseNavigationItem[] =
        compactNavigation;
    private _defaultNavigation: FuseNavigationItem[];
    private readonly _futuristicNavigation: FuseNavigationItem[] =
        futuristicNavigation;
    private readonly _horizontalNavigation: FuseNavigationItem[] =
        horizontalNavigation;

    /**
     * Constructor
     */
    constructor(
        private _fuseMockApiService: FuseMockApiService,
        private readonly _storage: StorageService,
        private readonly _auth: AuthService
    ) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Navigation - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService.onGet('api/common/navigation').reply(() => {
            this._defaultNavigation = JSON.parse(
                this._storage.find('navigation')
            );

            if (!this._defaultNavigation || !this._defaultNavigation?.length)
                this._auth.signOut();

            return [
                200,
                {
                    compact: cloneDeep(this._compactNavigation),
                    default: cloneDeep(this._defaultNavigation),
                    futuristic: cloneDeep(this._futuristicNavigation),
                    horizontal: cloneDeep(this._horizontalNavigation),
                },
            ];
        });
    }
}
