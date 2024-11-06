export async function throwDefaultError(resp: Response) {
    const error = await resp.json();
    throw new Error(error.message);
}
