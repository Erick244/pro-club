import { InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GithubStrategy } from "./github.strategy";

describe("GithubStrategy", () => {
    let strategy: GithubStrategy;
    const configService = {
        get: jest.fn().mockReturnValue("env-value"),
    } as unknown as ConfigService;

    beforeEach(() => {
        strategy = new GithubStrategy(configService);
    });

    it("should be defined", () => {
        expect(strategy).toBeDefined();
    });

    it("should validate passport github oauth", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue([{ email: "test@example.com" }]),
        });

        const profile = { username: "test" };
        const accessToken = "accessToken";
        const refreshToken = "refreshToken";
        const done = jest.fn();

        await strategy.validate(accessToken, refreshToken, profile, done);

        expect(done).toHaveBeenCalledWith(null, {
            email: "test@example.com",
            name: profile.username,
            provider: "Github",
        });
    });

    it("should throw InternalServerErrorException on fetch to github api error", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
        });

        const profile = { username: "test" };
        const accessToken = "accessToken";
        const refreshToken = "refreshToken";
        const done = jest.fn();

        await strategy.validate(accessToken, refreshToken, profile, done);

        expect(done).toHaveBeenCalledWith(
            new InternalServerErrorException("Error on get Github Emails"),
            null,
        );
    });
});
