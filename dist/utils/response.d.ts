import { Response } from 'express';
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    errors?: any[];
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
}
export declare function sendSuccess<T>(res: Response, data: T, message?: string, statusCode?: number, meta?: ApiResponse['meta']): Response<any, Record<string, any>>;
export declare function sendError(res: Response, message: string, statusCode?: number, errors?: any[]): Response<any, Record<string, any>>;
export declare function sendCreated<T>(res: Response, data: T, message?: string): Response<any, Record<string, any>>;
export declare function sendPaginated<T>(res: Response, data: T, total: number, page: number, limit: number, message?: string): Response<any, Record<string, any>>;
//# sourceMappingURL=response.d.ts.map