import JSONdb from 'simple-json-db';
export declare const jsonDB: JSONdb<any>;
export declare const log: (...args: any[]) => void;
export declare const retryRequest: <T>(promise: () => Promise<T>, retryTimes?: number, retryInterval?: number) => Promise<T>;
//# sourceMappingURL=tools.d.ts.map