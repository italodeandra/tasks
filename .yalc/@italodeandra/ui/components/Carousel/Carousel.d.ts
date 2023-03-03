import { EmblaOptionsType } from "embla-carousel";
import { ReactNode } from "react";
export declare type CarouselProps = {
    children?: ReactNode;
    carouselClassName?: string;
    className?: string;
    navigation?: boolean;
} & EmblaOptionsType;
export declare function Carousel({ children, className, carouselClassName, navigation, ...options }: CarouselProps): JSX.Element;
export declare namespace Carousel {
    var Slide: typeof CarouselSlide;
}
export interface CarouselSlideProps {
    children?: ReactNode;
    className?: string;
}
export declare function CarouselSlide({ children, className }: CarouselSlideProps): JSX.Element;
