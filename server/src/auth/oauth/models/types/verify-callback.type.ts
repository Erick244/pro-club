export type VerifyCallback = (
    err?: Error | null | unknown,
    user?: Express.User | false,
    info?: object,
) => void;
