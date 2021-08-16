import { ReactNode } from "react";
import { IMovieDetail } from "./IMovieDetail";

export interface ISlugProps {
    details: IMovieDetail;
    children?: ReactNode;
}

export interface IContextParms {
    slug: string
}