import { Button } from "../components";
import Authentication from "../services/Authentication";
import React from "react";

const Beer = (props) => {
    const id = props.currentRoute.replace('/beer/', '');

    return <>
                <Button text="Logout" onClick={() => {
                    Authentication.logout();
                }}>Sair</Button>
                <h1>Beer Page {id}</h1>
            </>;
}

export default Beer;