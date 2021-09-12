import { useState } from "react"
import { CardView } from "../../components/Card"
import { CARDS } from "../../model/types"

const CardPlayground : React.FC = () => {
    const [state,setState] = useState<number | null>(null);
    return <div>
        {CARDS.map((card,index) => <CardView 
            id={index.toString()}
            body={card}
            key={index} 
            hidden={false}
            selected={state === index} 
            code={0} 
            select={() => setState(index)}>
        </CardView>)}
    </div>
}

export default CardPlayground