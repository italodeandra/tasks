import { EmblaOptionsType } from "embla-carousel";
import { ReactNode } from "react";
export declare type CarouselProps = {
    children?: ReactNode;
    carouselClassName?: string;
    className?: string;
    navigation?: boolean;
} & EmblaOptionsType;
declare function Carousel({ children, className, carouselClassName, navigation, ...options }: CarouselProps): JSX.Element;
declare namespace Carousel {
    var Slide: typeof CarouselSlide;
}
export default Carousel;
export interface CarouselSlideProps {
    children?: ReactNode;
    className?: string;
}
declare function CarouselSlide({ children, className }: CarouselSlideProps): JSX.Element;
