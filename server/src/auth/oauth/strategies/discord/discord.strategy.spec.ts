import { ConfigService } from "@nestjs/config";
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
        const accessToken = "access-token";
        const refreshToken = "refresh-token";
        const profile = {
            global_name: "test",
            email: "test@test.com",
        };
        const done = jest.fn();

        await strategy.validate(accessToken, refreshToken, profile, done);

        expect(done).toHaveBeenCalledWith(null, {
            name: profile.global_name,
            email: profile.email,
            provider: "Discord",
        });
    });
});
