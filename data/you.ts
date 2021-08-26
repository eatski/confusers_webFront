export interface YourIdDao {
    save(yourId: string) : void,
    get(): string | null,
    delete(): void
}

export class YourIdDaoImpl implements YourIdDao{
    constructor(private roomId: string){}
    save(yourId: string): void {
        window.localStorage.setItem(`${this.roomId}-playerId`,yourId);
    }
    get(): string | null {
        return window.localStorage.getItem(`${this.roomId}-playerId`);
    }
    delete(): void {
        window.localStorage.removeItem(`${this.roomId}-playerId`);
    }

}