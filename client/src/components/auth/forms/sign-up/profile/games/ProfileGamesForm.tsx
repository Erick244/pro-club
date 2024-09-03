"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Game } from "@/models/entities/game.entity";
import { GamePlatform } from "@/models/enums/game-platform.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const profileGamesFormSchema = z.object({
    games: z.array(
        z.object({
            name: z.string(),
            distributor: z.string(),
            platforms: z.array(z.nativeEnum(GamePlatform)),
            capeImageUrl: z.string(),
        })
    ),
});

type ProfileGamesFormData = z.infer<typeof profileGamesFormSchema>;

export function ProfileGamesForm() {
    const form = useForm<ProfileGamesFormData>({
        resolver: zodResolver(profileGamesFormSchema),
        defaultValues: {
            games: [],
        },
    });

    function onSubmit(data: ProfileGamesFormData) {
        console.log(data);
    }

    function removeGame(gameName: string) {
        const updatedGames = form
            .getValues("games")
            .filter((g) => g.name !== gameName);

        form.setValue("games", updatedGames);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="games"
                    render={(field) => (
                        <FormControl>
                            <GamesSelect>
                                {gamesSelectTempData.map((game, i) => {
                                    const currentGames =
                                        form.getValues("games");

                                    const isSelected = currentGames.some(
                                        (value) => value.name === game.name
                                    );

                                    return (
                                        <GameSelectOption
                                            key={i}
                                            capeImageUrl={game.capeImageUrl}
                                            name={game.name}
                                            selected={isSelected}
                                            onGameSelect={() => {
                                                if (isSelected) {
                                                    removeGame(game.name);
                                                } else {
                                                    form.setValue("games", [
                                                        ...currentGames,
                                                        game,
                                                    ]);
                                                }
                                            }}
                                        />
                                    );
                                })}
                            </GamesSelect>
                        </FormControl>
                    )}
                />
            </form>
        </Form>
    );
}

const gamesSelectTempData: Game[] = [
    {
        id: 1,
        name: "Valorant",
        distributor: "Riot Games",
        platforms: [
            GamePlatform.Windows,
            GamePlatform.PlayStation,
            GamePlatform.Xbox,
        ],
        capeImageUrl:
            "https://fastly.picsum.photos/id/817/100/150.jpg?hmac=95KqP-J4-91R9N_iTHLBOpytNH3IPKoOIuVtkbr0Cqk",
    },
    {
        id: 2,
        name: "Counter-Strike 2",
        distributor: "Valve",
        platforms: [GamePlatform.Windows, GamePlatform.Linux, GamePlatform.Mac],
        capeImageUrl:
            "https://fastly.picsum.photos/id/517/100/150.jpg?hmac=j8S7uR5hdOd1Cth4qplFAqEecCb0QWngnyD_0LvYogU",
    },
    {
        id: 3,
        name: "League of Legends",
        distributor: "Riot Games",
        platforms: [
            GamePlatform.Windows,
            GamePlatform.Android,
            GamePlatform.iOS,
        ],
        capeImageUrl:
            "https://fastly.picsum.photos/id/500/100/150.jpg?hmac=3XIuSuaiNiu6xjn4TcFEdSV62GfluxB69sYiIJvqbyQ",
    },
    {
        id: 4,
        name: "Call of Duty",
        distributor: "Activision",
        platforms: [
            GamePlatform.Windows,
            GamePlatform.Linux,
            GamePlatform.Android,
            GamePlatform.iOS,
            GamePlatform.Xbox,
        ],
        capeImageUrl:
            "https://fastly.picsum.photos/id/957/100/150.jpg?hmac=1rYziBEU6G8EapRCWh5QKdr9VvS3UzWHsOVXFHX93xQ",
    },
    {
        id: 5,
        name: "Fotnite",
        distributor: "Epic Games",
        platforms: [
            GamePlatform.Windows,
            GamePlatform.Linux,
            GamePlatform.iOS,
            GamePlatform.Android,
            GamePlatform.PlayStation,
            GamePlatform.Xbox,
        ],
        capeImageUrl:
            "https://fastly.picsum.photos/id/721/100/150.jpg?hmac=d-gXIqgypukJWzyReLkQt00quWB74gp3EA30ZYOT2pI",
    },
];

interface GamesSelectProps {
    children: React.ReactNode;
}

function GamesSelect({ children }: GamesSelectProps) {
    return (
        <div className="space-y-5">
            <GameSelectSearch />

            <div className="overflow-y-scroll max-h-[400px] p-5 flex justify-between flex-wrap gap-5">
                {children}
            </div>
        </div>
    );
}

export function GameSelectSearch() {
    return (
        <div className="flex items-center gap-2">
            <Input
                className="bg-transparent border-2 border-primary"
                placeholder="Search by games..."
            />
            <Button size="icon">
                <SearchIcon className="text-foreground" />
            </Button>
        </div>
    );
}

interface GameSelectOptionProps {
    name: string;
    capeImageUrl: string;
    selected?: boolean;
    onGameSelect?: () => void;
}

export function GameSelectOption({
    capeImageUrl,
    name,
    selected = false,
    onGameSelect,
}: GameSelectOptionProps) {
    const [isSelected, setIsSelected] = useState<boolean>(selected);

    function handlerClick() {
        setIsSelected(!isSelected);

        if (onGameSelect) {
            onGameSelect();
        }
    }

    return (
        <div
            className="space-y-1 cursor-pointer select-none group"
            onClick={handlerClick}
        >
            <Image
                className={cn(
                    "rounded-lg w-[100px] h-[150px] border-2 transition-all group-hover:scale-105 group-active:scale-100",
                    selected
                        ? "border-primary shadow-lg shadow-primary"
                        : "border-foreground"
                )}
                src={capeImageUrl}
                width={100}
                height={150}
                alt="Game Cape Image"
            />
            <p className="text-xs text-center w-full max-w-[100px]">{name}</p>
        </div>
    );
}
