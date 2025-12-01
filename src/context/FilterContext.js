import React, { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export function FilterProvider({ children }) {
    const [filter, setFilter] = useState({
        name: { 
            value: '',
            exact: false
        },
        // NOVO CAMPO: Filtro por Estilo
        style: {
            value: '', // Vazio = Todos os estilos
            exact: false // false para permitir busca parcial (ex: "IPA" acha "Session IPA")
        }
    });

    const doFilter = (field, value) => {
        setFilter(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                value: value
            }
        }));
    };

    return (
        <FilterContext.Provider value={{ filter, doFilter }}>
            {children}
        </FilterContext.Provider>
    );
}

export function useFilterContext() {
    return useContext(FilterContext);
}