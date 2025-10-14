import React from "react";
import { Button, Grid } from "../components";
import useBeers from "../hooks/useBeers";
import Authentication from "../services/Authentication";
import useFilter from "../hooks/useFilter";
import Filter from "../components/customs/Filter";
import BeerCard from "../components/customs/BeerCard";

const Home = () => {
    const { beers, listBeers } = useBeers();
    const { filter, doFilter } = useFilter();

    React.useEffect(() => {
        listBeers(filter.title.value ? filter : null, 10, 1);
    }, [filter]);

    return <>
                <Button text="Logout" onClick={() => {
                    Authentication.logout();
                }}>Sair</Button>
                  <Filter 
                    label="Filtrar por Nome"
                    filter={filter}
                    doFilter={doFilter}
                />
                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                    {beers.map((beer) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={beer.id}>
                            <BeerCard beer={beer} />
                        </Grid>
                    ))}
                </Grid>
            </>;
}

export default Home;