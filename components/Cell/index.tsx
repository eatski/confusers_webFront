
import styles from "./style.module.scss"
export const Cell : React.FC = ({children}) => {
    return <div className={styles.container}>
        {children}
    </div>
}