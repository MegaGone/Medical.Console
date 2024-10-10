import { Subject } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { User } from 'app/core/user/user.types';

@Component({
    selector: 'app-history-detail',
    templateUrl: './history-detail.component.html',
    styleUrls: ['./history-detail.component.scss'],
})
export class HistoryDetailComponent implements OnInit, OnDestroy {
    public user: User;
    public currentDate: Date;

    private _unsubscribe: Subject<boolean>;

    constructor(
        private readonly _session: UserService,
        private readonly _changeDetectorRef: ChangeDetectorRef
    ) {
        this.currentDate = new Date();
        this._unsubscribe = new Subject();
    }

    ngOnInit(): void {
        this._getSession();
    }

    ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private _getSession() {
        this._session.user$
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((user: User) => {
                this.user = user;
                this._changeDetectorRef.markForCheck();

                console.log(this.user);
            });
    }
}
