export const recur = <
    Args extends Array<any>,
    Return,
    Fn extends ((next:(...args:Args) => Return,...args:Args) => Return) = ((next:(...args:Args) => Return,...args:Args) => Return) //一回Fnを変数として置かなければ、推論が上手く効かない 謎
>(fn:Fn,...init:Args):Return => {
    const next : (...args:Args) => Return = (...args) => fn(next,...args)
    return fn(next,...init)
}