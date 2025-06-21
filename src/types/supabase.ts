export type TSupabaseUserInfo = {
    id: string,
    aud: string,
    role: string,
    email: string,
    email_confirmed_at: string,
    phone: string,
    confirmation_sent_at: string,
    confirmed_at: string,
    last_sign_in_at: string,
    app_metadata: Record<string, any>,
    user_metadata: {
        email: string,
        email_verified: false,
        name: string,
        profilePicture: string,
        sub: string,
    },
    identities: Array<Record<string, any>>,
    created_at: string,
    updated_at: string,
    is_anonymous: boolean
}

export type TSupabaseProfileInfo = {
    email: string;
    user_name: string;
    profile_img: string;
    user_role: string
}
