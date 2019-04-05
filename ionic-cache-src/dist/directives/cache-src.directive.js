import {Directive, ElementRef, Input, Renderer} from '@angular/core';
import {Platform} from 'ionic-angular';
import {File} from '@ionic-native/file';
import {CacheConstants} from './../constants/CacheConstants';
import {CacheSrcService} from './../providers/cache-src.service';
var DIRECTORY = CacheConstants.DIRECTORY;
var CacheSrcDirective = (function () {
    // TODO:
    // preImage for div like elements
    // getCacheItem verify if is in filesystem
    // browser cache only images in localStorage
    // animate, to allow transition between preImage and real image
    // expire for each object -> interval for each
    // clearExpired (manually)
    // clear -> clear all storage and files
    function CacheSrcDirective(_elemRef, _renderer, _platform, _cacheSrv, _file) {
        this._elemRef = _elemRef;
        this._renderer = _renderer;
        this._platform = _platform;
        this._cacheSrv = _cacheSrv;
        this._file = _file
    }
    CacheSrcDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._elem = this._elemRef.nativeElement;
        if (this.src) {
            this._preload(true);
            if (!this._platform.is('cordova')) {
                this._preload(false);
                this._render(this.src);
            }
            else {
              var nativeDir = this._platform.is('ios') ? this._file.documentsDirectory : this._file.dataDirectory;
              var path = nativeDir + DIRECTORY;
                this._cacheSrv.cache(this.src)
                    .subscribe(function (item) {
                    if (item.status !== CacheConstants.ITEM_STATUS.PENDING) {
                        _this._preload(false);
                        _this._render(path + '/' +  item.key);
                    }
                });
            }
        }
    };
    CacheSrcDirective.prototype.ngOnDestroy = function () {
        if (this._canPlay) {
            var elem = this._elem;
            elem.pause();
        }
    };
    Object.defineProperty(CacheSrcDirective.prototype, "_canPlay", {
        get: function () {
            var _this = this;
            return ['VIDEO', 'AUDIO'].some(function (node) { return node === _this._elem.nodeName; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CacheSrcDirective.prototype, "_isMediaElem", {
        get: function () {
            var _this = this;
            return ['IMG', 'VIDEO', 'AUDIO'].some(function (node) { return node === _this._elem.nodeName; });
        },
        enumerable: true,
        configurable: true
    });
    CacheSrcDirective.prototype._preload = function (enable) {
        if (this._isMediaElem) {
            var isVideo = (this._elem.nodeName === 'VIDEO');
            var attr = isVideo ? 'poster' : 'src';
            var image = this.preImage || (isVideo ? CacheConstants.PLACEHOLDER.VIDEO : CacheConstants.PLACEHOLDER.IMAGE);
          if (this._platform.is('cordova')) {
            this._renderer.setElementAttribute(this._elem, attr, window.Ionic.WebView.convertFileSrc(image));

          }
          else{
            this._renderer.setElementAttribute(this._elem, attr, image);

          }

        }
    };
    CacheSrcDirective.prototype._render = function (path) {
        var _this = this;
        if (path) {
            if (this._isMediaElem) {
              if (this._platform.is('cordova')) {
                this._renderer.setElementAttribute(this._elem, 'src', window.Ionic.WebView.convertFileSrc(path));
              }
              else{
                this._renderer.setElementAttribute(this._elem, 'src', path);
              }
            }
            else {
                var rules_1 = {
                    'background': "url(" + path + ") no-repeat center",
                    'background-size': 'cover',
                    'width': '100%',
                    'min-height': '35px'
                };
                Object.keys(rules_1).forEach(function (key) {
                    _this._renderer.setElementStyle(_this._elem, key, rules_1[key]);
                });
            }
        }
    };
    CacheSrcDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[cacheSrc]'
                },] },
    ];
    /** @nocollapse */
    CacheSrcDirective.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: Renderer, },
        { type: Platform, },
        { type: CacheSrcService,},
        { type: File,},
    ]; };
    CacheSrcDirective.propDecorators = {
        'src': [{ type: Input, args: ['cacheSrc',] },],
        'preImage': [{ type: Input },],
    };
    return CacheSrcDirective;
}());
export { CacheSrcDirective };
//# sourceMappingURL=cache-src.directive.js.map
