import { ConfigService } from "@nestjs/config";
import { OAuthDto } from "../../models/dtos/oauth.dto";
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
        const profile = {
            displayName: "test",
            emails: [
                {
                    value: "test@test.com",
                },
            ],
        };

        const dto: OAuthDto = {
            name: profile.displayName,
            email: profile.emails[0].value,
            provider: "Facebook",
        };

        const accessToken = "access-token";
        const refreshToken = "refresh-token";
        const done = jest.fn();

        jest.spyOn(done, "call").mockImplementation((err, result) => {
            expect(err).toBeNull();
            expect(result).toEqual(dto);
        });

        await strategy.validate(accessToken, refreshToken, profile, done);

        expect(done).toHaveBeenCalledWith(null, dto);
    });
});
