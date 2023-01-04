import { makeAutoObservable, runInAction, toJS } from "mobx";
import agents from '../api/movie_agent';

export default class MovieStore {
    movies = [];
    liked_movies = [];
    loadingInitial = true;

    constructor () {
        makeAutoObservable(this)
    }

    loadMovies = async () => {
        this.loadingInitial = true;
        try {
            const movies = await agents.PopularMovies.list();
            this.saveMovies(movies.data.results)
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loadingInitial = false;
            })
        }
    }
    
    updateLiked = () => {
        const moviesLiked = JSON.parse(
            localStorage.getItem('bptn-Liked1-movie')
        );
        if (moviesLiked) {
            this.updateLikedMovieList(moviesLiked)
        } else {
            this.updateLikedMovieList([])
        } 
    }
    
    updateLikedMovieList = (movies) => {
        this.liked_movies = movies;
    }
    
    saveToLocalStorage = (items) => {
        localStorage.setItem('bptn-Liked1-movie', JSON.stringify(items))
    }

    addLikedMovie = (movie) => {
        const newLikedList = [...this.liked_movies, movie]
        this.saveLikedMovies(newLikedList);
    }
    
    removeLikedMovie = (movie) => {
        const newLikedList = this.liked_movies.filter(
            (fav) => fav.id !== movie.id
        );
        this.saveLikedMovies(newLikedList);
    }

    saveMovies = (movies) => {
        this.movies = movies;
        this.loadingInitial = false;
    }

    updateMovieItem = (movie) => {
        this.movies = movie;
    }

    saveLikedMovies = (newLikedList) => {
        this.liked_movies = toJS(newLikedList)
        this.saveToLocalStorage(newLikedList);
    }

    findLikedInList = (id) => {
        let stat = false;
        let life = this.liked_movies.find(data => data.id === id);
        if (life === undefined) {
            stat = true;
        }
        return stat;
    }
}