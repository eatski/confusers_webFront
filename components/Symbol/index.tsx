import React from "react";
import { SymbolType } from "../../model/types";
import styles from "./style.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faCrown, 
    faBook, 
    faHome, 
    faBeer, 
    faDog, 
    faSkull,
    faTree,
    faGem,
    IconDefinition 
} from '@fortawesome/free-solid-svg-icons'

export type SymbolSVGProps = {
    symbol: SymbolType
}

export const SymbolCell: React.FC<SymbolSVGProps> = ({symbol}) => {
    return <div className={styles.container}>
        <div className={styles.frame}>
            <SymbolSVG symbol={symbol}></SymbolSVG>
        </div>
    </div>
}

export const SymbolSVG: React.FC<SymbolSVGProps> = ({ symbol }) => {
    const icon = symbolToIcon[symbol];
    return <FontAwesomeIcon className={styles.icon} icon={icon}></FontAwesomeIcon>

}

const symbolToIcon : Record<SymbolType,IconDefinition> = {
    "Book":faBook,
    "Crown": faCrown,
    "Home": faHome,
    "Liquor": faBeer,
    "Quadrupedal": faDog,
    "Skull": faSkull,
    "Gem": faGem,
    "Tree": faTree
}



