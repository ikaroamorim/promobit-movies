export interface IMovie {
    adult: boolean;
    id: number;
    backdrop_path: string;
    genre_ids: number[];
    rank: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    vote_average: number;
    vote_count: number;
}