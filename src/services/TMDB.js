import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const tmdbApiKey = import.meta.env.REACT_APP_TMDB_KEY;
const page = 1;

// https://api.themoviedb.org/3/movie/popular?api_key=44f2be2768a237413c967952d80b64bd

export const tmdbApi = createApi({
    reducerPath: 'tmdbApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.themoviedb.org/3' }),
    endpoints: (builder) => ({
        // * Get Movies by [Type]
        getMovies: builder.query({
            query: () => `/movie/popular?page=${page}&api_key=44f2be2768a237413c967952d80b64bd`,
        })
    }),
})

export const { useGetMoviesQuery } = tmdbApi;