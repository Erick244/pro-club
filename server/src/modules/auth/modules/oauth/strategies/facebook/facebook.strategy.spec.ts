import { ConfigService } from "@nestjs/config";
import { FacebookStrategy } from "./facebook.strategy";

describe("FacebookStrategy", () => {
    let strategy: FacebookStrategy;

    const configService = {
        get: jest.fn().mockReturnValue("env-value"),
    } as unknown as ConfigService;

    beforeEach(() => {
        strategy = new FacebookStrategy(configService);
    });

    it("should be defined", () => {
        expect(strategy).toBeDefined();
    });

    it("should validate passport facebook oauth", async () => {
        const accessToken = "access-token";
        const refreshToken = "refresh-token";
        const profile = {
            displayName: "test",
            emails: [
                {
                    value: "test@test.com",
                },
            ],
        };
        const done = jest.fn();

        await strategy.validate(accessToken, refreshToken, profile, done);

        expect(done).toHaveBeenCalledWith(null, {
            name: profile.displayName,
            email: profile.emails[0].value,
            provider: "Facebook",
        });
    });
});
