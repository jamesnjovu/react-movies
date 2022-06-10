import { Grid } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useStore } from "../../store/store";
import MovieList from "../components/MovieListComponent";
import PageHeading from "../components/PageHeading";
import RemoveLiked from "../components/RemoveLiked";

function LikedMovies() {
    const store = useStore();

    useEffect(() => {
        store.updateLiked();
    }, [])

    const removeLikedMovie = (movie) => {
        store.removeLikedMovie(movie)
    }
    const liked = (_id) => {
        return true;
    }

    return (
        <>
            <PageHeading heading="Liked Movives" />
            <br></br>
            <Grid container spacing={2}>
                <MovieList
                    movies={store.liked_movies}
                    liked_movies={liked}
                    handleLikedClick={removeLikedMovie}
                    likedComponent={RemoveLiked} />
            </Grid>
        </>
    )
}
export default observer(LikedMovies);