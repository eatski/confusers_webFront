import { useState } from "react"
import { CardView } from "../../components/Card"
import { createCards } from "../../model/logic";

const CardPlayground : React.FC = () => {
    const [state,setState] = useState<string | null>(null);
    return <div>
        {createCards().map((card) => <CardView 
            id={card.id}
            body={card.body}
            key={card.id} 
            hidden={false}
            selected={state === card.id} 
            code={0} 
            select={() => setState(card.id)}>
        </CardView>)}
    </div>
}

export default CardPlayground