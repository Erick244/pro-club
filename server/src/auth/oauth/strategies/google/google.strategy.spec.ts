import { ConfigService } from "@nestjs/config";
import { OAuthDto } from "../../models/dtos/oauth.dto";
import { GoogleStrategy } from "../google.strategy";

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

        const dto: OAuthDto = {
            name: profile.name.givenName,
            email: profile.emails[0].value,
            provider: "Google",
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
