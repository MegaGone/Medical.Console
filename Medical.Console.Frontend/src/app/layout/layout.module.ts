import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LayoutComponent } from 'app/layout/layout.component';
import { EmptyLayoutModule } from 'app/layout/layouts/empty/empty.module';
import { ClassyLayoutModule } from 'app/layout/layouts/vertical/classy/classy.module';
import { CompactLayoutModule } from 'app/layout/layouts/vertical/compact/compact.module';

const layoutModules = [
    // Empty
    EmptyLayoutModule,

    // Vertical navigation
    ClassyLayoutModule,
    CompactLayoutModule,
];

@NgModule({
    declarations: [LayoutComponent],
    imports: [
        MatIconModule,
        MatTooltipModule,
        FuseDrawerModule,
        SharedModule,
        ...layoutModules,
    ],
    exports: [LayoutComponent, ...layoutModules],
})
export class LayoutModule {}
