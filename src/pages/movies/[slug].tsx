import { GetStaticProps, GetStaticPaths } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Params } from 'next/dist/server/router';

import { api } from '../../services/api';

import { IMovieDetail } from '../../types/IMovieDetail';
import { ISlugProps } from '../../types/ISlugProps';

import styles from '../../styles/SlugStyles.module.scss'

import { RiArrowGoBackFill } from 'react-icons/ri'

export default function Movies(props: ISlugProps) {

   return (
      <div className={styles.container}>
         <div className={styles.imgContainer}>
            <Image
               src={`https://image.tmdb.org/t/p/w500${props.details.backdrop_path}`}
               alt={props.details.title}
               width={800}
               height={450} />
         </div>
         <div className={styles.infoContainer}>
            <Link href={'/'}
            >
               <a><RiArrowGoBackFill /></a>
            </Link>
            <h3>Título do filme</h3>
            <p> {props.details.title}</p>
            <p> {props.details.original_title} / ({props.details.original_language})</p>
            {props.details.tagline ? (
               <>
                  <h3>Slogan do Filme</h3>
                  <p> {props.details.tagline}</p>
               </>
            ) : ""}
            <h3>Sinopse</h3>
            <p> {props.details.overview}</p>
            {props.details.budget && props.details.revenue ? (
               <div className={styles.budgetContainer} >
                  <div >
                     <h3>Orçamento</h3>
                     <p> ${props.details.budget.toLocaleString()}</p>
                  </div>
                  <div>
                     <h3>Bilheteria</h3>
                     <p> ${props.details.revenue.toLocaleString()}</p>
                  </div>
               </div>
            ) : ""}

            <h3>Generos</h3>
            <div className={styles.genreContainer}>
               <p> {props.details.genres.map((item, index) => { return (<span key={index} className={styles.genreButton} >{item.name}</span>) })}</p>
            </div>

            <h3>Site do filme</h3>
            <a href={props.details.homepage}>{props.details.homepage}</a>
         </div>
      </div >
   )
}

export const getStaticPaths: GetStaticPaths = async () => {
   return {
      paths: [],
      fallback: 'blocking'
   }
}

export const getStaticProps: GetStaticProps = async ({ params }: Params) => {
   const { slug } = params;


   const responseDetails = await api.get(`movie/${slug}`, {
      params: {
         api_key: '3035934e587a656dcf1c327b5ec0779f',
         language: 'pt-BR',
      }
   });

   const dataDetails: IMovieDetail = await responseDetails.data;

   return {
      props: {
         details: dataDetails
      },
      revalidate: 60 * 60 * 24 * 7
   }
}