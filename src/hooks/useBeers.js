import React, { useCallback } from "react";
import Database from "../services/Database";
import Bucket from "../services/Bucket";

const useBeers = () => {
   
    const [beers, setBeers] = React.useState([]);
    const [beer, setBeer] = React.useState({});
    

    const [loading, setLoading] = React.useState(false);
    const [numberOfTotalResults, setNumberOfTotalResults] = React.useState(0);


    const listBeers = useCallback(async (filter, limit, page) => {
        setLoading(true);
        try {
            const { data, error, count } = await Database.list('beer', '*', filter, limit, page);
            
            if (error) throw error;

            if (data && data.length > 0) {
                let i = 0;
                for (const item of data) {
                    if (item.image && item.image.indexOf('https://') === -1) {
                        const image = await Bucket.load(item.image); // Assumindo Bucket.load()
                        data[i].image = image;
                    }
                    i++;
                }
                setBeers(data);
                setNumberOfTotalResults(count || 0);
            } else {
                setBeers([]);
                setNumberOfTotalResults(0);
            }
        } catch (error) {
            console.error("Erro ao listar cervejas:", error);
            setBeers([]);
            setNumberOfTotalResults(0);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Busca uma cerveja específica pelo ID e também seu estilo relacionado.
     */
    const findBeer = useCallback(async (id) => {
        setLoading(true);
        try {
            // 1. Busca a cerveja (usando 'get' como no seu código original)
            const { data: beerData, error: beerError } = await Database.get('beer', id);
            
            if (beerError) throw beerError;
            if (!beerData) {
                setBeer({});
                return;
            }

            // 2. Carrega a imagem do bucket, se necessário
            if (beerData.image && beerData.image.indexOf('https://') === -1) {
                const image = await Bucket.load(beerData.image);
                beerData.image = image;
            }

            // 3. Busca o estilo relacionado (como 'game_play' no exemplo)
            // Assumindo que Database.list pode fazer joins/selects complexos
            const { data: styleData, error: styleError } = await Database.list(
                'beer_style', // Tabela de junção
                'style:style(id, name, style)', // Pega a coluna 'style' e faz o join
                { "id.beer": { exact: true, value: beerData.id } }, // Filtra pelo ID da cerveja
                1, 1 // Limita a 1 resultado
            );

            if (styleError) throw styleError;
            
            // Extrai o objeto 'style' do resultado
            const style = (styleData && styleData.length > 0) ? styleData[0].style : null;
            
            setBeer({ ...beerData, style: style });

        } catch (error) {
            console.error("Erro ao encontrar cerveja:", error);
            setBeer({});
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Salva uma nova cerveja, faz upload da imagem (se houver) e recarrega a lista.
     */
    const saveBeer = useCallback(async (data, filter, limit, page) => {
        setLoading(true);
        try {
            // 1. Upload da imagem (se houver e for um arquivo)
            if (data.image && typeof data.image === 'object') {
                 // Assumindo que 'data.name' é o nome da cerveja
                 const imageName = Bucket.generateNameFile(data.name);
                 const image = await Bucket.upload('beers', imageName, data.image);
                 data.image = image.path; // Salva o caminho do bucket no DB
            }
            
            // 2. Criar o registro no DB
            await Database.create('beer', data);

        } catch (error) {
             console.error("Erro ao salvar cerveja:", error);
        } finally {
            // 3. Recarregar a lista
            await listBeers(filter, limit, page); // listBeers já tem seu próprio setLoading
        }
    }, [listBeers]); // Adiciona 'listBeers' como dependência

    
    // Funções de rating (mantidas do seu código)
    const ratingBeer = useCallback(async (id, rating) => {
        // Lógica para avaliar a cerveja (ex: atualizar a tabela 'beer')
        // ...
        // Após avaliar, talvez recarregar os dados
        // await listBeers(...);
        // await findBeer(id);
    }, [listBeers, findBeer]);

    const ratingBeerPlay = useCallback(async (id, rating) => {
        // Você pode renomear isso para 'reviewBeer' ou algo similar
    }, [listBeers, findBeer]);

    // Retorno do hook com as novas funções e estados
    return {
        listBeers, 
        findBeer, 
        ratingBeer, 
        ratingBeerPlay, 
        saveBeer, // Adicionado
        beers, 
        beer,
        loading, // Adicionado
        numberOfTotalResults // Adicionado
    };
}

export default useBeers;