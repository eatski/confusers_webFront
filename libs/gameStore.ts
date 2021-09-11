export type StoreLogic<
    State,
    Command,
    Result
> = {
    initial: State,
    script: (prev:State,command:Command) => Result
    reducer: (prev: State, result:Result) => State
}

export type CommandRecordInput<Command,Result> =  {command:Command,result:Result}
export type CommandRecord<Command,Result> =  {command:Command,result:Result,id:string}

export interface RecordRepository<R,C> {
    add: (record:CommandRecordInput<R,C>) => {id:string,exec:() => Promise<void>};
    sync: (listener:(records:CommandRecord<R,C>[])=> void) => () => void
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
    repository: RecordRepository<Command,Result>
) : Store<Command>=> {
    let state : State = initial;
    let stacked : string[] = []
    const dispatch = async (command:Command) => {
        const result = script(state,command);
        const {id,exec} = repository.add({result,command})
        stacked = [...stacked,id];
        state = reducer(state,result);
        listener([{result,command,id}],state);
        return exec();
    }
    const removeListener = repository.sync((records) => {
        const notStacked = records.filter(record => !stacked.some(id => record.id === id))
        state = notStacked.reduce((acc,{result}) => reducer(acc,result),state);
        stacked = stacked.filter(id => !records.some(record => record.id === id));
        listener(records,state);
    })
    return {
        dispatch,
        removeListener
    }
}

