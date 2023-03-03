/// <reference types="react" />
import { StaticImageData } from "next/image";
export interface SignInViewProps {
    backgroundImage?: string | StaticImageData;
}
export default function SignInView({ backgroundImage }: SignInViewProps): JSX.Element;
