import { GamePlatform } from "../enums/game-platform.enum";

export interface Game {
    id: number;
    name: string;
    distributor: string;
    platforms: GamePlatform[];
    capeImageUrl: string;
}
