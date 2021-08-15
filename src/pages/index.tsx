import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'

import { IMovie } from '../types/IMovie'

import styles from '../../styles/Home.module.scss'
import { api } from '../services/api'
import axios, { AxiosResponse } from 'axios'
import { IHomeProps } from '../types/IHomeProps'

const Home = (props : IHomeProps) => {

  console.log(props);

  return (
    <div className={styles.container}>
      <Head>
        <title>Promobit - Movies</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Teste 123</h1>
      { props.movies.map( (item, id) => {
        return (
          <h2 key={id}> {item.title}</h2>

        )
      })}
    </div>
  )
}

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const requestArray: Promise<AxiosResponse<any>>[] = [];

  for (let i = 0; i < 10; i++) {
    requestArray.push(api.get('movie/popular/', {
      params: {
        api_key: '3035934e587a656dcf1c327b5ec0779f',
        language: 'pt-BR',
        page: i+1
      }
    }));
  }

  const responseMovie = await axios.all(requestArray)
  const dataMovie = await responseMovie.map( response => response.data.results );

  const dataMovieReduced = dataMovie.reduce( function(accumulator, currentValue){ return accumulator.concat(currentValue)},[])
  

  const responseGenre = await api.get('genre/movie/list', {
    params: {
      api_key: '3035934e587a656dcf1c327b5ec0779f',
    }
  });
  const dataGenre = await responseGenre.data;

  return {
    props: {
      movies: dataMovieReduced,
      genres: dataGenre
    },
    revalidate: 60 * 60 * 24 //Um dia
  }
}