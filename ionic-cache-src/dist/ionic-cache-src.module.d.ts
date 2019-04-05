export declare class IonicCacheSrcModule {
}
declare global  {
    interface Array<T> {
        contains(value: any): boolean;
        intersect(arr: Array<T>): Array<T>;
        except(arr: Array<T>): Array<T>;
    }
}
export {};
