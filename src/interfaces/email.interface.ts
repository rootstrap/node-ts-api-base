export interface ISgOptions {
    auth: AuthSg
}

export interface AuthSg {
    api_user?: string
    api_key: string
}

export interface IEmail {
    from: string,
    to: string,
    subject: string,
    text: string,
    html?: string,
}
