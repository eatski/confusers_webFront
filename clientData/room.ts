export const getRoomId = ():string => {
    const id = new URLSearchParams(window.location.search).get("room");
    if(!id){
        throw new Error("No Room Id");
    }
    return id;
}