import { ReactNode } from "react";
import { IGenre } from "./IGenre";
import { IMovie } from "./IMovie";

export interface IHomeProps{
    movies: IMovie[];
    genres: IGenre[];
    children?: ReactNode;
}