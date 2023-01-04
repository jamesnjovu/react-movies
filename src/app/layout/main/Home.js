import { observer } from "mobx-react-lite";
import { useEffect } from 'react';
import {useStore} from '../../store/store';
import MovieList from '../components/MovieListComponent';
import LikeMovie from "../components/LikeMovie";
import { Grid } from '@mui/material';
import LoadingComponent from '../components/LoadingComponent';
import PageHeading from "../components/PageHeading";

function Home() {
    const store = useStore();

    useEffect(() => {
        store.loadMovies();
    }, [store])
    
    useEffect(() => {
        store.updateLiked();
    }, [store])

    const addLikedMovie = (movie) => {
        store.addLikedMovie(movie);
        return false
    }

    const liked = (id) => {
        return store.findLikedInList(id)
    }

    if (store.loadingInitial) return <LoadingComponent inverted={false} content={'LOADING...'} />

    return (
        <>
            <PageHeading heading="Popular Movies" />

            <Grid container spacing={2}>
                <MovieList
                    movies={store.movies}
                    liked_movies={liked}
                    handleLikedClick={addLikedMovie}
                    likedComponent={LikeMovie} />
            </Grid>
        </>
    )
}

export default observer(Home);
