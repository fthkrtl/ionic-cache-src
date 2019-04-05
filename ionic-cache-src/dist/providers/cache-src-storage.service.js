import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Rx';
import { CacheConstants } from './../constants/CacheConstants';
import { CacheSrcFileService } from './cache-src-file.service';
var CACHE_SOURCE = CacheConstants.STORAGE_KEY;
var CacheSrcStorageService = (function () {
    function CacheSrcStorageService(_storage, _fileSrv) {
        this._storage = _storage;
        this._fileSrv = _fileSrv;
    }
    CacheSrcStorageService.prototype.setCacheItem = function (item) {
        item.group = CACHE_SOURCE;
        return Observable.fromPromise(this._storage.set(item.url, item));
    };
    CacheSrcStorageService.prototype.getCacheItem = function (url) {
        return Observable.fromPromise(this._storage.get(url))
            .flatMap(function (item) {
            if (item)
                delete item.group;
            return Observable.of(item);
        });
    };
    CacheSrcStorageService.prototype.removeCacheItem = function (url) {
        var _this = this;
        return this.getCacheItem(url)
            .flatMap(function (item) {
            if (!item)
                return Observable.of(item);
            return Observable.fromPromise(_this._storage.remove(url))
                .flatMap(function () {
                if (item)
                    item.status = CacheConstants.ITEM_STATUS.DELETED;
                return Observable.of(item);
            });
        });
    };
    CacheSrcStorageService.prototype.clear = function () {
        var _this = this;
        var cacheItems = [];
        return Observable.fromPromise(this._storage.forEach(function (item) {
            if (item.group) {
                item.status = CacheConstants.ITEM_STATUS.DELETED;
                cacheItems.push(item);
            }
            ;
        }))
            .flatMap(function () { return Observable.forkJoin(cacheItems.map(function (item) { return Observable.fromPromise(_this._storage.remove(item.url)); })); })
            .flatMap(function () { return Observable.of(cacheItems); });
    };
    // ************ PENDING *************
    CacheSrcStorageService.prototype._setCacheList = function (cacheList) {
        return Observable.fromPromise(this._storage.set(CACHE_SOURCE, cacheList));
    };
    CacheSrcStorageService.prototype._getCacheList = function () {
        return Observable.fromPromise(this._storage.get(CACHE_SOURCE))
            .flatMap(function (data) { return Observable.of(data || []); });
    };
    CacheSrcStorageService.prototype._removeCacheByIdList = function (ids) {
        var _this = this;
        return this._getCacheList()
            .flatMap(function (cacheList) {
            var exceptionIds = cacheList.map(function (item) { return item.key; }).except(ids);
            exceptionIds.forEach(function (exId) {
                var index = cacheList.findIndex(function (item) { return item.key === exId; });
                if (index > -1)
                    cacheList.splice(index, 1);
            });
            return _this._setCacheList(cacheList);
        });
    };
    CacheSrcStorageService.prototype.sync = function () {
        var _this = this;
        var cacheIds;
        return this._getCacheList()
            .flatMap(function (cacheList) {
            // if localStorage is empty, remove fylesystem files
            if (!cacheList || !cacheList.length) {
                return _this._fileSrv.removeRecursively();
            }
            // else, get just localStorage IDs
            cacheIds = cacheList.map(function (item) { return item.key; });
            return _this._fileSrv.listDir();
        })
            .flatMap(function (entries) {
            var entriesIds = entries.map(function (entry) { return entry.name; });
            var exceptionIds;
            if (cacheIds && entriesIds && cacheIds.length && entriesIds.length) {
                if (cacheIds.length > entriesIds.length) {
                    exceptionIds = cacheIds.except(entriesIds);
                    return _this._removeCacheByIdList(exceptionIds);
                }
                else {
                    exceptionIds = entriesIds.except(cacheIds);
                    return _this._fileSrv.removeFilesByIdList(exceptionIds);
                }
            }
        });
    };
    CacheSrcStorageService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    CacheSrcStorageService.ctorParameters = function () { return [
        { type: Storage, },
        { type: CacheSrcFileService, },
    ]; };
    return CacheSrcStorageService;
}());
export { CacheSrcStorageService };
//# sourceMappingURL=cache-src-storage.service.js.map