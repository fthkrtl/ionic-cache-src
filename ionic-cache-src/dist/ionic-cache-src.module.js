import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CacheSrcDirective } from './directives/cache-src.directive';
import { CacheSrcService } from './providers/cache-src.service';
import { CacheSrcFileService } from './providers/cache-src-file.service';
import { CacheSrcStorageService } from './providers/cache-src-storage.service';
var IonicCacheSrcModule = (function () {
    function IonicCacheSrcModule() {
    }
    // static forRoot(): ModuleWithProviders {
    //     return {
    //         ngModule: IonicCacheSrcModule,
    //         providers: [
    //             CacheSrcFileService,
    //             CacheSrcStorageService
    //         ]
    //     };
    // }
    IonicCacheSrcModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        IonicModule
                    ],
                    declarations: [
                        CacheSrcDirective
                    ],
                    providers: [
                        CacheSrcService,
                        CacheSrcFileService,
                        CacheSrcStorageService
                    ],
                    exports: [
                        CacheSrcDirective
                    ]
                },] },
    ];
    /** @nocollapse */
    IonicCacheSrcModule.ctorParameters = function () { return []; };
    return IonicCacheSrcModule;
}());
export { IonicCacheSrcModule };
Array.prototype.contains = function (value) {
    if (typeof value !== 'object')
        return this.indexOf(value) > -1;
    return !!this.find(function (item) {
        return JSON.stringify(item) === JSON.stringify(value);
    });
};
Array.prototype.intersect = function (arr) {
    return this.filter(function (i) { return arr.contains(i); });
};
Array.prototype.except = function (arr) {
    return this.filter(function (i) { return !arr.contains(i); });
};
//# sourceMappingURL=ionic-cache-src.module.js.map