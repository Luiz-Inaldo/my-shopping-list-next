export interface ILoginUser {
    email: string,
    password: string
}

export interface IRegisterUser extends ILoginUser {
    username: string;
    confirm_password: string;
}