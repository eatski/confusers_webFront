
import styles from "./style.module.scss"
export const Cell : React.FC<{onClick?:()=> void}> = ({children,onClick}) => {
    return <div className={styles.container} onClick={onClick}>
        {children}
    </div>
}

const calcMulti = (value:string | undefined ,num:number) => `calc(${value} * ${num.toString()})`

export interface FloatingCellProps {
    x:number;
    y:number;
}

export const FloatingCell :  React.FC<FloatingCellProps> = ({children,x,y}) => {
    return <div style={{"top":calcMulti(styles.height,x),"left":calcMulti(styles.width,y)}} className={styles.floatingCellContainer}>
        {children}
    </div>
}