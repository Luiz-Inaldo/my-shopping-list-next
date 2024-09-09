export interface User {
    email: string,
    password: string
}

export interface RegisterProps extends User {
    username: string;
    confirm_password: string;
}