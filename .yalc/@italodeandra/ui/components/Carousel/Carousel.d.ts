import { EmblaOptionsType, EmblaPluginType } from "embla-carousel-react";
import { ReactNode } from "react";
export type CarouselProps = {
    children?: ReactNode;
    carouselClassName?: string;
    className?: string;
    navigation?: boolean;
    plugins?: EmblaPluginType[];
} & EmblaOptionsType;
declare function Carousel({ children, className, carouselClassName, navigation, plugins, ...options }: CarouselProps): JSX.Element;
declare namespace Carousel {
    var Slide: typeof CarouselSlide;
}
export default Carousel;
export interface CarouselSlideProps {
    children?: ReactNode;
    className?: string;
}
declare function CarouselSlide({ children, className }: CarouselSlideProps): JSX.Element;
