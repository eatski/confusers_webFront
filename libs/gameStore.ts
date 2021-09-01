export type StoreLogic<
    State,
    Command,
    Result
> = {
    initial: State,
    script: (prev:State,command:Command) => Result
    reducer: (prev: State, result:Result) => State
}

export type CommandRecord<Command,Result> =  {command:Command,result:Result}

export interface RecordRepository<R extends CommandRecord<unknown,unknown>> {
    add: (record:R) => Promise<void>;
    listen: (listener:(record:R)=> void) => () => void
}

export const createStore = <
    State,
    Command,
    Result,
>(
    {script,reducer,initial}: StoreLogic<State,Command,Result>,
    listener:(command:Command | null,result:Result | null,state:State) => void,
    repository: RecordRepository<CommandRecord<Command,Result>>
) => {
    let state : State = initial;
    const dispatch = async (command:Command) => {
        const result = script(state,command);
        await repository.add({result,command});
    }
    const removeListener = repository.listen(({result,command}) => {
        state = reducer(state,result);
        listener(command,result,state);
    })
    listener(null,null,state);
    return {
        dispatch,
        removeListener
    }
}

