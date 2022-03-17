import { useCallback, useEffect, useMemo, useState } from 'react';

import { SideBar } from './components/SideBar';
import { Content } from './components/Content';

import { api } from './services/api';

import './styles/global.scss';

import './styles/sidebar.scss';
import './styles/content.scss';

interface GenreResponseProps {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}

interface MovieProps {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

export function App() {
  const [selectedGenreId, setSelectedGenreId] = useState(1);
  const [genres, setGenres] = useState<GenreResponseProps[]>([]);
  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);



  useEffect(() => {
    api.get<GenreResponseProps[]>('genres').then(response => {
      setGenres(response.data);
      response.data.filter((genre) => genre.id === selectedGenreId).map((genre) => setSelectedGenre(genre));
    });
    
  }, []);


  useMemo(() => api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`).then((res) => setMovies(res.data)), [selectedGenreId]);

  useEffect(() => {
   

     var response = genres.filter((genre) => genre.id === selectedGenreId)
      setSelectedGenre(response[0]);

  }, [selectedGenreId]);

  const clickButton  = useCallback( (id: number) => {
     setSelectedGenreId(id);
  },[])

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <SideBar
        genres={genres}
        selectedGenreId={selectedGenreId}
        buttonClickCallback={clickButton}
      />

      <Content
        selectedGenre={selectedGenre}
        movies={movies}
      />
    </div>
  )
}