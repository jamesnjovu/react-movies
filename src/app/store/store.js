import { createContext, useContext } from "react";
import MovieStore from "./movieStore";

export const store = new MovieStore();

export const StoreContext = createContext(store);

export function useStore(){
    return useContext(StoreContext);
}