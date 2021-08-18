import type { GetStaticProps } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';

import { IHomeProps } from '../types/IHomeProps'
import { IMovie } from '../types/IMovie'
import { IGenre } from '../types/IGenre';

import styles from '../styles/Home.module.scss'

import { api } from '../services/api'
import axios, { AxiosResponse } from 'axios'

import { Card } from '../components/Card'

import { BiSearchAlt } from 'react-icons/bi'
import { BsArrowBarLeft } from 'react-icons/bs'

const Home = (props: IHomeProps) => {
  const [filter, setFilter] = useState<number[]>([]);
  const [items, setItems] = useState<IMovie[]>([...props.movies])
  const [page, setPage] = useState<number>(1)
  const [isSearchPannelVisible, setIsSearchPannelVisible] = useState<boolean>(false)

  const numOfCards = items.length;
  const numOfPages = parseInt((numOfCards / 15).toString(), 10) + (numOfCards % 15 > 0 ? 1 : 0)
  const nextPage = () => setPage(page + 1);
  const prevPage = () => setPage(page - 1);
  const toggleSearchPanel = () => { setIsSearchPannelVisible(!isSearchPannelVisible) }

  useEffect(() => { filterItems(filter) }, [filter])


  function filterItems(filter: number[]) {
    if (filter.length > 0) {
      const filteredMovies = props.movies.filter((movie) => {
        let control = 0;
        movie.genre_ids.forEach((genre) => {
          if (filter.includes(genre)) { control++ }
          return filter.includes(genre)
        })
        return control > 0
      })
      setItems([...filteredMovies]);
    } else {
      setItems([...props.movies])
    }
  }


  // @ts-ignore
  function handleCheckboxChange(event, itemId: number) {
    const value = !event.target.checked;

    const stateValue = [...filter]

    if (value) {
      let index = stateValue.indexOf(itemId)
      stateValue.splice(index, 1)
    } else {
      stateValue.push(itemId)
    }

    setFilter(stateValue)
  }


  return (
    <div className={styles.container}>
      <Head>
        <title>Promobit - Movies</title>
        <meta name="description" content="Portal da Promobit onde pode-se consultar os filmes mais populares do dia" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png"></link>
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16x16.png"></link>
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png"></link>
        <link rel="icon" type="image/png" sizes="192x192" href="/assets/favicon-192x192.png"></link>
        <link rel="icon" type="image/png" sizes="194x194" href="/assets/favicon-194x194.png"></link>
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Promobit Movies" />
        <meta property="og:description" content="Promobit Movies, encontre os filmes mais populares da internet" />
        <meta property="og:image" content="https://promobit-movies.vercel.app/promobit_og_image.png" />
        <meta property="og:url" content="https://promobit-movies.vercel.app/" />
        <meta property="og:site_name" content="Promobit Movies" />
      </Head>
      <aside style={isSearchPannelVisible ? {} : { width: '0' }}>
        <div className={styles.asideTopContainer}>
          <h3>Filtros:</h3>
          <button onClick={toggleSearchPanel}>
            <BsArrowBarLeft />
          </button>
        </div>
        {props.genres.map(item => {
          return (
            <div
              key={item.id}
              className={styles.checkboxContainer}>
              <input
                type="checkbox"
                name={item.name}
                id={`${item.id}`}
                checked={filter.indexOf(item.id) === -1 ? false : true}
                onChange={(event) => { handleCheckboxChange(event, item.id) }}
              />
              <label htmlFor={`${item.id}`}>{item.name}</label>
            </div>
          )
        })}
      </aside>
      <main>

        <div className={styles.topContainer}>
          <div>
            <button
              onClick={toggleSearchPanel}
              style={isSearchPannelVisible ? { display: 'none' } : {}}><BiSearchAlt /></button>
          </div>
          <h2> Filmes Populares do Dia:</h2>
        </div>

        <div className={styles.cardsContainer}>
          {items
            .slice((page - 1) * 15, (page - 1) * 15 + 15)
            .map((item, id) => {
              return (
                <Card movie={item} key={id}></Card>
              )
            })}
        </div>

        <div className={styles.buttonsContainer}>
          <button
            onClick={prevPage}
            disabled={page === 1}>
            Página Anterior
          </button>
          <span>Página {page} de {numOfPages}</span>
          <button
            onClick={nextPage}
            disabled={page === numOfPages}>
            Próxima Página
          </button>

        </div>


      </main>
    </div>
  )
}

export default Home;

export const getStaticProps: GetStaticProps = async () => {

  try {
    /**
     * Criando uma Array de promises para as requisições
     * e realizando as consultas
     * Foi escolhido trazer 200 resultados, ou seja 10 consultas
     * porém poderia ser utilizada função recursiva para trazer todos os resultados
     */
    const requestArray: Promise<AxiosResponse<any>>[] = [];

    for (let i = 0; i < 10; i++) {
      requestArray.push(api.get('movie/popular/', {
        params: {
          api_key: '3035934e587a656dcf1c327b5ec0779f',
          language: 'pt-BR',
          page: i + 1
        }
      }));
    }

    const responseMovie = await axios.all(requestArray)
    const dataMovie = await responseMovie.map(response => response.data.results);

    /**
     * Reduzindo os Arrays para ter um único com todos os valores
     */
    const dataMovieReduced: IMovie[] = dataMovie.reduce(function (accumulator, currentValue) {
      return accumulator.concat(...currentValue)
    }, []);

    /**
     * Realizando Map dos valores para termos o valor do item no ranking
     */
    const dataMovieMapped = dataMovieReduced.map((item, index) => {
      item['rank'] = index
      return item;
    })

    /**
     * Consultando os Generos disponíveis
     */
    const responseGenre = await api.get('genre/movie/list', {
      params: {
        api_key: '3035934e587a656dcf1c327b5ec0779f',
        language: 'pt-BR',
      }
    });
    const dataGenre: IGenre[] = await responseGenre.data.genres;

    /**
     * Retorando os arrais e o Revalidate para o caso de sucesso e de erro
     */
    return {
      props: {
        movies: dataMovieMapped,
        genres: dataGenre
      },
      revalidate: 60 * 60 * 24 //Um dia
    }
  } catch (error) {
    console.error(error);
    return {
      props: {
        movies: [],
        genres: []
      },
      revalidate: 60 * 60 * 1 //Uma hora,
    }
  }
}