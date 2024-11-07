"use client";

import { Muted } from "@/components/typography/Muted";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { SubmitButton } from "@/components/utils/forms/buttons/SubmitButton";
import {
    ImageCardSelect,
    ImageCardSelectOption,
    ImageCardSelectOptions,
    ImageCardSelectSearch,
} from "@/components/utils/forms/selects/ImageCardSelect";
import { formMessages } from "@/messages/form.messages";
import { Game } from "@/models/entities/game.entity";
import { GamePlatform } from "@/models/enums/game-platform.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const messages = formMessages["ProfileGamesForm"];
const profileGamesFormSchema = z.object({
    games: z
        .array(
            z.object({
                name: z.string(),
                distributor: z.string(),
                platforms: z.array(z.nativeEnum(GamePlatform)),
                capeImageUrl: z.string(),
            })
        )
        .refine((games) => games.length > 0, messages.games),
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

    function removeGameByName(gameName: string) {
        const updatedGames = form
            .getValues("games")
            .filter((g) => g.name !== gameName);

        form.setValue("games", updatedGames);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col space-y-5 items-center"
            >
                <FormField
                    control={form.control}
                    name="games"
                    render={(field) => (
                        <FormItem>
                            <FormControl>
                                <ImageCardSelect>
                                    <ImageCardSelectSearch
                                        onSearch={console.log}
                                        placeholder="Search by games"
                                    />
                                    <ImageCardSelectOptions>
                                        {gamesSelectTempData.map((game, i) => {
                                            const currentGames =
                                                form.getValues("games");

                                            const isSelected =
                                                currentGames.some(
                                                    (g) => g.name === game.name
                                                );

                                            return (
                                                <ImageCardSelectOption
                                                    key={i}
                                                    capeImageUrl={
                                                        game.capeImageUrl
                                                    }
                                                    name={game.name}
                                                    selected={isSelected}
                                                    onImageCardSelect={() => {
                                                        if (isSelected) {
                                                            removeGameByName(
                                                                game.name
                                                            );
                                                        } else {
                                                            form.setValue(
                                                                "games",
                                                                [
                                                                    ...currentGames,
                                                                    game,
                                                                ]
                                                            );
                                                        }
                                                    }}
                                                />
                                            );
                                        })}
                                    </ImageCardSelectOptions>
                                    <Muted className="text-primary text-center">
                                        {form.getValues("games").length}
                                    </Muted>
                                </ImageCardSelect>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <SubmitButton>Finish</SubmitButton>
            </form>
        </Form>
    );
}

const gamesSelectTempData: Game[] = [
    {
        id: 1,
        name: "Valorant",
        distributor: "Riot Games",
        platforms: [GamePlatform.PC, GamePlatform.Console],
        capeImageUrl:
            "https://fastly.picsum.photos/id/817/100/150.jpg?hmac=95KqP-J4-91R9N_iTHLBOpytNH3IPKoOIuVtkbr0Cqk",
    },
    {
        id: 2,
        name: "Counter-Strike 2",
        distributor: "Valve",
        platforms: [GamePlatform.PC],
        capeImageUrl:
            "https://fastly.picsum.photos/id/517/100/150.jpg?hmac=j8S7uR5hdOd1Cth4qplFAqEecCb0QWngnyD_0LvYogU",
    },
    {
        id: 3,
        name: "League of Legends",
        distributor: "Riot Games",
        platforms: [GamePlatform.PC, GamePlatform.Mobile],
        capeImageUrl:
            "https://fastly.picsum.photos/id/500/100/150.jpg?hmac=3XIuSuaiNiu6xjn4TcFEdSV62GfluxB69sYiIJvqbyQ",
    },
    {
        id: 4,
        name: "Call of Duty",
        distributor: "Activision",
        platforms: [GamePlatform.PC, GamePlatform.Mobile],
        capeImageUrl:
            "https://fastly.picsum.photos/id/957/100/150.jpg?hmac=1rYziBEU6G8EapRCWh5QKdr9VvS3UzWHsOVXFHX93xQ",
    },
    {
        id: 5,
        name: "Fotnite",
        distributor: "Epic Games",
        platforms: [GamePlatform.PC, GamePlatform.Mobile, GamePlatform.Console],
        capeImageUrl:
            "https://fastly.picsum.photos/id/721/100/150.jpg?hmac=d-gXIqgypukJWzyReLkQt00quWB74gp3EA30ZYOT2pI",
    },
];
