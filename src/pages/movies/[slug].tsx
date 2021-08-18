import { GetStaticProps, GetStaticPaths } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Params } from 'next/dist/server/router';
import Head from 'next/head';

import { api } from '../../services/api';

import { IMovieDetail } from '../../types/IMovieDetail';
import { ISlugProps } from '../../types/ISlugProps';

import styles from '../../styles/SlugStyles.module.scss'

import { RiArrowGoBackFill } from 'react-icons/ri'

export default function Movies(props: ISlugProps) {

   return (
      <div className={styles.container}>
         <Head>
            <title> {props.details.title} - Promobit - Movies</title>
            <meta name="description" content="Portal da Promobit onde pode-se consultar os filmes mais populares do dia" />
            <link rel="icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png"></link>
            <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16x16.png"></link>
            <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png"></link>
            <link rel="icon" type="image/png" sizes="192x192" href="/assets/favicon-192x192.png"></link>
            <link rel="icon" type="image/png" sizes="194x194" href="/assets/favicon-194x194.png"></link>
         </Head>
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
            <h1> {props.details.title}</h1>
            <h2> {props.details.original_title} / ({props.details.original_language})</h2>
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

   try {
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
         revalidate: 60 * 60 * 24 * 7 //7 dias
      }
   } catch (error) {
      console.error(error)

      return {
         props: {
            details: []
         },
         revalidate: 60 * 60 * 1 //Uma Hora
      }

   }

}