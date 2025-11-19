import React, { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export function FilterProvider({ children }) {
    // Adaptamos seu estado para usar 'name' (pois seu banco usa 'name', não 'title')
    const [filter, setFilter] = useState({
        name: { 
            value: '',
            exact: false
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