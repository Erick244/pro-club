import { Injectable, NotFoundException } from "@nestjs/common";

type Code = {
    value: string;
    expiresAt: number;
};

@Injectable()
export class CodeService {
    private codes: Map<string, Code> = new Map();
    private readonly CODE_EXPIRATION_TIME = 1000 * 60 * 5; // 5 minutes

    constructor() {
        setInterval(() => {
            this.clearExpiredCodes();
        }, this.CODE_EXPIRATION_TIME);
    }

    private clearExpiredCodes() {
        this.codes.forEach((code, email) => {
            if (this.invalidCode(code)) {
                this.codes.delete(email);
            }
        });
    }

    private invalidCode(code: Code) {
        return !code || code.expiresAt < Date.now();
    }

    newCode(length: number, email: string): string {
        const MAX_DIGIT = 10;
        let code = "";

        while (code.length != length) {
            const digit = Math.round(Math.random() * MAX_DIGIT);

            code += digit.toString();
        }

        const expiresAt = Date.now() + this.CODE_EXPIRATION_TIME;
        this.codes.set(email, { value: code, expiresAt });

        return code;
    }

    getCode(email: string) {
        const code = this.codes.get(email);

        if (this.invalidCode(code)) {
            throw new NotFoundException(
                "The email confirmation code is expired. Try send new code.",
            );
        }

        return code.value;
    }
}
