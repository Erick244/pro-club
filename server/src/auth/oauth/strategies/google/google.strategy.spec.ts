import { ConfigService } from "@nestjs/config";
import { GoogleStrategy } from "./google.strategy";

describe("GoogleStrategy", () => {
    let strategy: GoogleStrategy;
    const configService = {
        get: jest.fn().mockReturnValue("env-value"),
    } as unknown as ConfigService;

    beforeEach(() => {
        strategy = new GoogleStrategy(configService);
    });

    it("should be defined", () => {
        expect(strategy).toBeDefined();
    });

    it("should validate passport google oauth", async () => {
        const accessToken = "access-token";
        const refreshToken = "refresh-token";
        const profile = {
            name: {
                givenName: "Test",
            },
            emails: [
                {
                    value: "test@test.com",
                },
            ],
        };
        const done = jest.fn();

        await strategy.validate(accessToken, refreshToken, profile, done);

        expect(done).toHaveBeenCalledWith(null, {
            name: profile.name.givenName,
            email: profile.emails[0].value,
            provider: "Google",
        });
    });
});
