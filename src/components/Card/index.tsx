import Image from 'next/image';
import Link from 'next/link'
import { ICardProps } from '../../types/ICardProps';

import { format } from 'date-fns'

import { AiFillStar } from "react-icons/ai";

import styles from './style.module.scss'

export function Card(props: ICardProps) {

   function formatDate(stringDate: string) {
      if (stringDate) {
         const splitedDate = stringDate.replace('-', ',');

         return (format(new Date(splitedDate), 'dd/MM/yyyy'))
      }
      return ''
   }

   return (
      <Link href={`/movies/${props.movie.id}`} passHref>
         <div className={styles.container}>
            <Image
               src={`https://image.tmdb.org/t/p/w500${props.movie.poster_path}`}
               alt={props.movie.title}
               width={160}
               height={240}
               objectFit={"contain"}
            ></Image>
            <div className={styles.cardInfo}>
               <h4> #{props.movie.rank + 1} {props.movie.title}</h4>
               <p> ({props.movie.original_title})</p>
               <p> Lançamento: {formatDate(props.movie.release_date)}</p>
               <p>{props.movie.vote_average} <AiFillStar /></p>

            </div>

         </div>
      </Link>
   )
}