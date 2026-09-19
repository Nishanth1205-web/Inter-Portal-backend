import { Request, Response, NextFunction } from 'express';
import { Role } from '../types';
export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: Role;
        firstName: string;
        lastName: string;
    };
}
export declare function authenticate(req: AuthRequest, _res: Response, next: NextFunction): void;
export declare function authorize(...roles: Role[]): (req: AuthRequest, _res: Response, next: NextFunction) => void;
export declare function getStudentId(req: AuthRequest): Promise<string>;
//# sourceMappingURL=auth.d.ts.map