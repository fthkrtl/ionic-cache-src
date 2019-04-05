import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {CacheConstants} from './../constants/CacheConstants';
import {CacheSrcStorageService} from './cache-src-storage.service';
import {CacheSrcFileService} from './cache-src-file.service';

var STATUS = CacheConstants.ITEM_STATUS;
var PREFIX = 'cache';
var CacheSrcService = (function () {
    function CacheSrcService(_storageSrv, _fileSrv) {
        this._storageSrv = _storageSrv;
        this._fileSrv = _fileSrv;
    }
    CacheSrcService.prototype.cache = function (url) {
        var _this = this;
        if (!url)
            Observable.throw('Error: Must provide an url resource.');
        if (!this._isRemote(url)) {
            return Observable.of({ url: url, path: url, status: STATUS.COMPLETE });
        }
        // TODO: item exists, is in filesystem and status: complete
        return this._storageSrv.getCacheItem(url)
            .flatMap(function (item) {
            if (item)
                return Observable.of(item);
            return _this._fetch(url);
        });
    };
    CacheSrcService.prototype.cacheAll = function (urls) {
        var _this = this;
        if (!urls || !urls.length)
            Observable.throw('Error: Must provide a list of url resources.');
        var obs = urls.map(function (url) { return _this.cache(url); });
        return Observable.forkJoin(obs);
    };
    CacheSrcService.prototype.find = function (url) {
        if (!url)
            Observable.throw('Error: Must provide an url resource.');
        return this._storageSrv.getCacheItem(url);
    };
    CacheSrcService.prototype.remove = function (url) {
        if (!url)
            Observable.throw('Error: Must provide an url resource.');
        // TODO: remove from filesystem
        return this._storageSrv.removeCacheItem(url);
    };
    CacheSrcService.prototype.clear = function () {
        // TODO: remove from filesystem
        return this._storageSrv.clear();
    };
    CacheSrcService.prototype._isRemote = function (url) {
        return ['http://', 'https://', 'ftp://'].some(function (i) { return url.includes(i); });
    };
    CacheSrcService.prototype._fetch = function (url) {
        var _this = this;
        var ext = url.split(/\#|\?/)[0].split('.').pop().trim();
        var key = this._id()+'.'+ext;
        var item = { key: key, url: url, status: STATUS.PENDING };
        return this._storageSrv.setCacheItem(item)
            .flatMap(function () {
            return _this._fileSrv.download(url, key);
        })
            .flatMap(function (path) {
            if (!path)
                return;
            item = Object.assign({}, item, { path: path, status: STATUS.COMPLETE });
            return _this._storageSrv.setCacheItem(item)
                .flatMap(function () {
                return Observable.of(item);
            });
        });
        // .catch(error => {
        //     console.log(error);
        //     return '';
        // });
    };
    CacheSrcService.prototype._id = function () {
        return (Math.random().toString(36) + '00000000000000000').slice(2, 10) + Date.now();
    };
    CacheSrcService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    CacheSrcService.ctorParameters = function () { return [
        { type: CacheSrcStorageService, },
        { type: CacheSrcFileService, },
    ]; };
    return CacheSrcService;
}());
export { CacheSrcService };
//# sourceMappingURL=cache-src.service.js.map
