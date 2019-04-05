import {ElementRef, Renderer} from '@angular/core';
import {Platform} from 'ionic-angular';
import {File} from '@ionic-native/file';
import {CacheSrcService} from './../providers/cache-src.service';

export declare class CacheSrcDirective {
    private _elemRef;
    private _renderer;
    private _platform;
    private _cacheSrv;
    private _file;
    src: string;
    preImage: string;
    nativeDir: string;
    private _elem;
    constructor(_elemRef: ElementRef, _renderer: Renderer, _platform: Platform, _cacheSrv: CacheSrcService,_file:File);
    ngOnInit(): void;
    ngOnDestroy(): void;
    private readonly _canPlay;
    private readonly _isMediaElem;
    private _preload(enable);
    private _render(path?);
}
