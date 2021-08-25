export const saveYourId = (yourId: string) => {
    window.localStorage.setItem("playerId",yourId);
}

export const getYourId = ():string | null => {
    return window.localStorage.getItem("playerId");
}