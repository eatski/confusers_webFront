export const getRoomId = ():string | null => {
    return new URLSearchParams(window.location.search).get("room");
}