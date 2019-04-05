import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Rx';
import { CacheSrcFileService } from './cache-src-file.service';
import { CacheItem } from './../interfaces/CacheItem';
export declare class CacheSrcStorageService {
    private _storage;
    private _fileSrv;
    constructor(_storage: Storage, _fileSrv: CacheSrcFileService);
    setCacheItem(item: CacheItem): Observable<CacheItem>;
    getCacheItem(url: string): Observable<CacheItem>;
    removeCacheItem(url: string): Observable<CacheItem>;
    clear(): Observable<CacheItem[]>;
    private _setCacheList(cacheList);
    private _getCacheList();
    private _removeCacheByIdList(ids);
    sync(): Observable<any>;
}
