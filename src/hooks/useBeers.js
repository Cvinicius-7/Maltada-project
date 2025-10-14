import React, { useCallback } from "react";
import Database from "../services/Database";

const useBeers = () => {
    const [beers, setBeers] = React.useState([]);
    const [beer, setBeer] = React.useState({});

    const listBeers = useCallback(async (filter, limit, page) => {
        const { data, error } = await Database.list('beer', '*', filter, limit, page);
        if (!error) {
            setBeers(data);
        }
    }, []);

    const findBeer = useCallback(async (id) => {
        const { data, error } = await Database.get('beer', id);
        if (!error) {
            setBeer(data);
        }
    }, []);

    const ratingBeer = useCallback(async (id, rating) => {

    }, [listBeers, findBeer]);

    const ratingBeerPlay = useCallback(async (id, rating) => {
    }, [listBeers, findBeer]);

    return {
        listBeers, findBeer, ratingBeer, ratingBeerPlay, beers, beer
    };
}

export default useBeers;