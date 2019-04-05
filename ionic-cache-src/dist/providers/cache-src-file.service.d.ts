import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { File, Entry, RemoveResult } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
export declare class CacheSrcFileService {
    private _platform;
    private _file;
    private _transfer;
    private _fileTransfer;
    constructor(_platform: Platform, _file: File, _transfer: FileTransfer);
    readonly nativeDir: string;
    readonly cacheSrcDir: string;
    private _normalizeUrlIos(url);
    download(url: string, targetId: string): Observable<string>;
    getFilePath(id: string): Observable<string>;
    listDir(): Observable<Entry[]>;
    removeFilesByIdList(ids: string[]): Promise<RemoveResult[]>;
    removeRecursively(): Promise<any[]>;
    private _normalizePath(path);
}
