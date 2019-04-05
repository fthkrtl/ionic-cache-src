import { Observable } from 'rxjs/Rx';
import { CacheSrcStorageService } from './cache-src-storage.service';
import { CacheSrcFileService } from './cache-src-file.service';
import { CacheItem } from './../interfaces/CacheItem';
export declare class CacheSrcService {
    private _storageSrv;
    private _fileSrv;
    constructor(_storageSrv: CacheSrcStorageService, _fileSrv: CacheSrcFileService);
    cache(url: string): Observable<CacheItem>;
    cacheAll(urls: string[]): Observable<CacheItem[]>;
    find(url: string): Observable<CacheItem>;
    remove(url: string): Observable<CacheItem>;
    clear(): Observable<CacheItem[]>;
    private _isRemote(url);
    private _fetch(url);
    private _id();
}
