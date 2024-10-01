import { Injectable } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation';

@Injectable({
    providedIn: 'root',
})
export class NavigationUtilService {
    constructor() {}

    public static main() {
        const navigation: Array<FuseNavigationItem> = JSON.parse(
            this._get('navigation')
        );

        if (!navigation || !navigation?.length) return '/sign-in';

        return navigation[0]?.children[0]?.link;
    }

    private static _get(key: string): string | null {
        try {
            const storedData = localStorage.getItem(key);

            if (!storedData) return null;

            const parsedData = JSON.parse(storedData);
            const currentTime = new Date().getTime();

            if (currentTime > parsedData.expiration) {
                localStorage.removeItem(key);
                return null;
            }

            return decodeURIComponent(escape(atob(parsedData.value)));
        } catch (error) {
            return null;
        }
    }
}
