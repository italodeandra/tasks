/// <reference types="react" />
import { StaticImageData } from "next/image";
export interface ForgotPasswordViewProps {
    backgroundImage?: string | StaticImageData;
}
export default function ForgotPasswordView({ backgroundImage, }: ForgotPasswordViewProps): JSX.Element;
