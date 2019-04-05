import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { CacheConstants } from './../constants/CacheConstants';
var DIRECTORY = CacheConstants.DIRECTORY;
var CacheSrcFileService = (function () {
    function CacheSrcFileService(_platform, _file, _transfer) {
        this._platform = _platform;
        this._file = _file;
        this._transfer = _transfer;
        this._fileTransfer = this._transfer.create();
        this._fileTransfer.onProgress(function (progress) {
            //console.log((progress.loaded / progress.total) * 100);
            if (progress.loaded === progress.total) {
                console.log('Finished');
            }
        });
    }
    Object.defineProperty(CacheSrcFileService.prototype, "nativeDir", {
        get: function () {
            var nativeDir = this._platform.is('ios') ? this._file.documentsDirectory : this._file.dataDirectory;
            return this._normalizePath(nativeDir);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CacheSrcFileService.prototype, "cacheSrcDir", {
        get: function () {
            return this._normalizePath(this.nativeDir + DIRECTORY);
        },
        enumerable: true,
        configurable: true
    });
    CacheSrcFileService.prototype._normalizeUrlIos = function (url) {
      //console.log(url);
      return (url).replace(/(cdvfile|file):\/\//g, '');
    };
    CacheSrcFileService.prototype.download = function (url, targetId) {
        var _this = this;
        return Observable.fromPromise(this._fileTransfer.download(url, this.cacheSrcDir + targetId))
            .flatMap(function (entry) {
            if (!entry)
                return Observable.of('');
            var path = entry.toURL();
            if (_this._platform.is('ios'))
                path = _this._normalizeUrlIos(path);
            return Observable.of(path);
        });
        // .catch(error => {
        //     console.log(error);
        //     return;
        // });
    };
    CacheSrcFileService.prototype.getFilePath = function (id) {
        var _this = this;
        return Observable.fromPromise(this._file.resolveDirectoryUrl(this.cacheSrcDir))
            .flatMap(function (directory) {
            return Observable.fromPromise(_this._file.getFile(directory, id, {}));
        })
            .flatMap(function (file) {
            return Observable.of(file ? file.toURL() : undefined);
        });
    };
    CacheSrcFileService.prototype.listDir = function () {
        return Observable.fromPromise(this._file.listDir(this.nativeDir, DIRECTORY))
            .flatMap(function (entries) {
            return Observable.of(entries);
        });
    };
    CacheSrcFileService.prototype.removeFilesByIdList = function (ids) {
        var _this = this;
        var promises = ids.map(function (id) {
            return _this._file.removeFile(_this.cacheSrcDir, id);
        });
        return Promise.all(promises);
    };
    CacheSrcFileService.prototype.removeRecursively = function () {
        return this._file.removeRecursively(this.nativeDir, DIRECTORY)
            .then(function (removedData) {
            return [];
        })
            .catch(function (error) {
            return [];
        });
    };
    CacheSrcFileService.prototype._normalizePath = function (path) {
        // TODO: check WVWebView ios file:// and cdvfile://
        if (!path)
            return '';
        return path.endsWith('/') ? path : (path + '/');
    };
    CacheSrcFileService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    CacheSrcFileService.ctorParameters = function () { return [
        { type: Platform, },
        { type: File, },
        { type: FileTransfer, },
    ]; };
    return CacheSrcFileService;
}());
export { CacheSrcFileService };
//# sourceMappingURL=cache-src-file.service.js.map
