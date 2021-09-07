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
    sync: (listener:(records:R[])=> void) => () => void
}

export type Store<
    Command,
> = {
    dispatch: (command:Command) => Promise<void>
    removeListener: () => void
}

export const createStore = <
    State,
    Command,
    Result,
>(
    {script,reducer,initial}: StoreLogic<State,Command,Result>,
    listener:(records:CommandRecord<Command,Result>[],state:State) => void,
    repository: RecordRepository<CommandRecord<Command,Result>>
) : Store<Command>=> {
    let state : State = initial;
    const dispatch = async (command:Command) => {
        const result = script(state,command);
        await repository.add({result,command});
    }
    const removeListener = repository.sync((records) => {
        state = records.reduce((acc,{result}) => reducer(acc,result),state)
        listener(records,state);
    })
    return {
        dispatch,
        removeListener
    }
}

