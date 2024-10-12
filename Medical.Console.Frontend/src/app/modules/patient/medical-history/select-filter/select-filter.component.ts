import {
    Input,
    OnInit,
    Output,
    Component,
    ViewChild,
    OnDestroy,
    ElementRef,
    EventEmitter,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'select-filter',
    templateUrl: './select-filter.component.html',
    styleUrls: ['./select-filter.component.scss'],
})
export class SelectFilterComponent implements OnInit, OnDestroy {
    @ViewChild('searchSelectInput', { read: ElementRef, static: true })
    public searchSelectInput: ElementRef;

    @Input()
    public placeholderLabel: string;

    @Output()
    public searchValueOutput: EventEmitter<string>;

    private _unsubscribe: Subject<boolean>;
    public readonly searchInputFormControl: FormControl;

    constructor() {
        this.placeholderLabel = 'Buscar';
        this._unsubscribe = new Subject();
        this.searchInputFormControl = new FormControl('');
        this.searchValueOutput = new EventEmitter<string>();
    }

    ngOnInit(): void {
        this._onListenInput();
    }

    ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public handleKeyDown(event: KeyboardEvent): void {
        event.stopPropagation();
    }

    public onClearFilter(): void {
        this.searchInputFormControl.setValue('');
        this.searchSelectInput.nativeElement.focus();
    }

    private _onListenInput(): void {
        this.searchInputFormControl.valueChanges
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((value) => this.searchValueOutput.emit(value));
    }
}
