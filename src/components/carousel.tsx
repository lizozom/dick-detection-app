import * as React from 'react';
import './carousel.scss';


export interface CarouselItem {
    id: string;
    src: string;
    handler?: (item: CarouselItem) => void;
}

export interface CarouselProps {
    items: Array<CarouselItem>;
    handler: (itemId: CarouselItem) => void;

}

export function Carousel(props: CarouselProps) {
    const listItems = props.items.map((item) => 
        <div className={`item item-${item.id}`} key={item.id} onClick={() => props.handler(item)}>
            <img alt={item.id} src={item.src}/>
        </div>
        
    );

    return (
        <div className="carousel">
            {listItems}
        </div>
    )
}