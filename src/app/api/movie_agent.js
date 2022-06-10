import axios from "axios";

const baseURL = 'https://api.themoviedb.org/3';

export const ImgApi = 'https://image.tmdb.org/t/p/w500';

const request = axios.create({baseURL: baseURL});

const PopularMovies = {
    list: () => request.get('/movie/popular?api_key='+process.env.REACT_APP_API_KEY)
}

const agents = {
    PopularMovies
}

export default agents;