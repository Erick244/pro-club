import { ConfigService } from "@nestjs/config";
import { OAuthDto } from "../../models/dtos/oauth.dto";
import { DiscordStrategy } from "./discord.strategy";

describe("DiscordStrategy", () => {
    let strategy: DiscordStrategy;

    const configService = {
        get: jest.fn().mockReturnValue("env-value"),
    } as unknown as ConfigService;

    beforeEach(() => {
        strategy = new DiscordStrategy(configService);
    });

    it("should be defined", () => {
        expect(strategy).toBeDefined();
    });

    it("should validate passport discord oauth", async () => {
        const profile = {
            global_name: "test",
            email: "test@test.com",
        };

        const dto: OAuthDto = {
            name: profile.global_name,
            email: profile.email,
            provider: "Discord",
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
