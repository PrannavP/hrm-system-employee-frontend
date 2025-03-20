export interface LoginForm{
    email: string;
    password: string;
}

export interface ErrorResponse {
    message?: string;
}

export interface User {
    emp_id: string;
    email: string;
    exp: number;
}