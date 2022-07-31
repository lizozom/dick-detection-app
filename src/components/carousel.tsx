import * as React from 'react';
import './carousel.scss';

export interface CarouselItem {
    id: string;
    img: string;
    xPercent?: number;
    yPercent?: number;
    handler?: (item: CarouselItem) => void
    getSize?: (item: CarouselItem) => {x: number, y: number}
    getPosition?: (item: CarouselItem) => {x: number, y: number}

}

export interface CarouselProps {
    items: Array<CarouselItem>;
    handler: (itemId: CarouselItem) => void;

}

export function Carousel(props: CarouselProps) {
    const listItems = props.items.map((item) => 
        <div className={`item item-${item.id}`} key={item.id} onClick={() => props.handler(item)}>
            <img alt={item.id} src={item.img}/>
        </div>
        
    );

    return (
        <div className="carousel">
            {listItems}
        </div>
    )
}