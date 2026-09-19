export declare class AuthService {
    login(email: string, password: string, ipAddress?: string, userAgent?: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
            avatar: string | null;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string, refreshToken?: string, ipAddress?: string, userAgent?: string): Promise<void>;
    refreshAccessToken(refreshTokenStr: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
        resetToken?: undefined;
    } | {
        message: string;
        resetToken: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    registerStudent(data: any, ipAddress?: string, userAgent?: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
            avatar: string | null;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        role: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
        student: ({
            department: {
                code: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                description: string | null;
            };
            batch: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                year: number;
            };
        } & {
            id: string;
            userId: string;
            enrollmentNo: string;
            departmentId: string;
            batchId: string;
            semester: number | null;
            createdAt: Date;
            updatedAt: Date;
        }) | null;
        avatar: string | null;
        phone: string | null;
        lastLoginAt: Date | null;
        admin: {
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            designation: string | null;
        } | null;
    }>;
    impersonate(targetRole: string, impersonatorId: string, ipAddress?: string, userAgent?: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
            avatar: string | null;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    private generateAccessToken;
    private generateRefreshToken;
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.service.d.ts.map