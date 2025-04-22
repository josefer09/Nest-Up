export interface AuthUser {
    id: string;
    email: string;
    fullName: string;
    isActive: boolean;
    isVerified: boolean;
    roles: string[];
}