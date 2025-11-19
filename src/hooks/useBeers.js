import React, { useCallback } from "react";
import Database from "../services/Database";
import Bucket from "../services/Bucket";

const useBeers = () => {
    const [beers, setBeers] = React.useState([]);
    const [beer, setBeer] = React.useState({});
    const [loading, setLoading] = React.useState(false);

    // Lista todas as cervejas (usado na Home)
    const listBeers = useCallback(async (filter, limit, page) => {
        setLoading(true);
        try {
            const { data, error } = await Database.list('beer', '*', filter, limit, page);
            
            if (error) throw error;

            if (data && data.length > 0) {
                // Processa as imagens do Bucket se necessário
                const processedData = await Promise.all(data.map(async (item) => {
                    if (item.image && !item.image.startsWith('http')) {
                        item.image = await Bucket.load(item.image);
                    }
                    return item;
                }));
                setBeers(processedData);
            } else {
                setBeers([]);
            }
        } catch (error) {
            console.error("Erro ao listar cervejas:", error);
            setBeers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Busca uma cerveja específica (usado na página de Detalhes)
    const findBeer = useCallback(async (id) => {
        setLoading(true);
        try {
            // 1. Busca a cerveja diretamente pelo ID
            // A sua tabela 'beer' JÁ TEM 'description' e 'style', então não precisamos de joins complexos agora.
            const { data: beerData, error } = await Database.get('beer', id);
            
            if (error) throw error;
            
            if (beerData) {
                // 2. Carrega a imagem do bucket se não for link externo
                if (beerData.image && !beerData.image.startsWith('http')) {
                    beerData.image = await Bucket.load(beerData.image);
                }

                // Define o estado com os dados completos da tabela
                setBeer(beerData);
            } else {
                setBeer({});
            }

        } catch (error) {
            console.error("Erro ao encontrar cerveja:", error);
            setBeer({});
        } finally {
            setLoading(false);
        }
    }, []);

    const saveBeer = useCallback(async (data, filter, limit, page) => {
        setLoading(true);
        try {
            if (data.image && typeof data.image === 'object') {
                 const imageName = Bucket.generateNameFile(data.name);
                 const image = await Bucket.upload('beers', imageName, data.image);
                 data.image = image.path; 
            }
            await Database.create('beer', data);
        } catch (error) {
             console.error("Erro ao salvar cerveja:", error);
        } finally {
            await listBeers(filter, limit, page);
        }
    }, [listBeers]);

    return {
        listBeers, 
        findBeer, 
        saveBeer, 
        beers, 
        beer,
        loading
    };
}

export default useBeers;