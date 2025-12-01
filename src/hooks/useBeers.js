import React, { useCallback } from "react";
import Database from "../services/Database";
import Bucket from "../services/Bucket";
import { useToast } from "../context/ToastContext"; 
import { supabase } from "../services/SupabaseClient"; 

const useBeers = () => {
    const [beers, setBeers] = React.useState([]);
    const [beer, setBeer] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const { showToast } = useToast();

    // Mescla os dados da tabela 'beer' com a view 'beer_stats'
    const mergeWithStats = async (beerList) => {
        const { data: stats } = await supabase.from('beer_stats').select('*');
        
        return beerList.map(b => {
            const stat = stats?.find(s => s.beer_id === b.id);
            return {
                ...b,
                rating: stat ? stat.average_rating_10 : null,
                reviews_count: stat ? stat.review_count : 0,
                // NOVO: Pegando o preço médio pago pelos usuários
                avg_price: stat ? stat.avg_price : 0 
            };
        });
    };

    const listBeers = useCallback(async (filter, limit, page, orderBy = 'name_asc') => {
        setLoading(true);
        try {
            // Database.list vai filtrar o 'name' e o 'style' na tabela 'beer'
            const { data, error } = await Database.list('beer', '*', filter, limit, page);
            if (error) throw error;

            if (data && data.length > 0) {
                // 1. Carrega Imagens
                let processedData = await Promise.all(data.map(async (item) => {
                    if (item.image && !item.image.startsWith('http')) {
                        item.image = await Bucket.load(item.image, 'beers');
                    }
                    return item;
                }));
                
                // 2. Mescla com estatísticas (incluindo avg_price)
                processedData = await mergeWithStats(processedData);

                // 3. ORDENAÇÃO NO FRONT-END
                processedData.sort((a, b) => {
                    switch (orderBy) {
                        // Ordenação por Preço Médio (avg_price)
                        case 'price_asc': // Menor Preço
                            // Tratamento para jogar quem tem preço 0 para o final, se quiser
                            if (a.avg_price === 0) return 1; 
                            if (b.avg_price === 0) return -1;
                            return a.avg_price - b.avg_price;

                        case 'price_desc': // Maior Preço
                            return b.avg_price - a.avg_price;

                        // Ordenação por Nota
                        case 'rating_desc': 
                            return (b.rating || 0) - (a.rating || 0);
                        case 'rating_asc': 
                            return (a.rating || 0) - (b.rating || 0);

                        // Ordenação por Nome
                        case 'name_desc': 
                            return b.name.localeCompare(a.name);
                        case 'name_asc': 
                        default: 
                            return a.name.localeCompare(b.name);
                    }
                });

                setBeers(processedData);
            } else {
                setBeers([]);
            }
        } catch (error) {
            console.error("Erro ao listar:", error);
            setBeers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // --- Find Beer (Mantido igual, só omitido para brevidade) ---
    const findBeer = useCallback(async (id) => {
        setLoading(true);
        try {
            const { data: beerData, error } = await Database.get('beer', id);
            if (error) throw error;
            
            if (beerData) {
                if (beerData.image && !beerData.image.startsWith('http')) {
                    beerData.image = await Bucket.load(beerData.image, 'beers');
                }

                const { data: stat } = await supabase.from('beer_stats').select('*').eq('beer_id', id).single();
                
                const { data: reviews } = await supabase
                    .from('reviews')
                    .select('*, profiles:user_id(full_name, avatar_url)') 
                    .eq('beer_id', id);

                // Processa avatares dos reviews
                let processedReviews = [];
                if (reviews && reviews.length > 0) {
                    processedReviews = await Promise.all(reviews.map(async (review) => {
                        if (review.profiles?.avatar_url && !review.profiles.avatar_url.startsWith('http')) {
                            const publicUrl = await Bucket.load(review.profiles.avatar_url, 'images');
                            review.profiles.avatar_url = publicUrl;
                        }
                        return review;
                    }));
                }

                setBeer({
                    ...beerData,
                    rating: stat ? stat.average_rating_10 : null,
                    reviews_count: stat ? stat.review_count : 0,
                    stats: stat, 
                    // Incluindo avg_price no objeto beer individual também
                    avg_price: stat ? stat.avg_price : 0,
                    reviews: processedReviews
                });
            }
        } catch (error) {
            setBeer({});
        } finally {
            setLoading(false);
        }
    }, []);

    // --- Save, Delete, SaveReview (Mantidos iguais) ---
    const saveBeer = useCallback(async (data, filter, limit, page, id = null) => {
        setLoading(true);
        try {
            let imagePath = data.currentImagePath; 
            if (data.image && typeof data.image === 'object') {
                 const imageName = Bucket.generateNameFile(data.name);
                 imagePath = await Bucket.upload('beers', imageName, data.image);
            }
            let createdDate = undefined;
            if (data.year) createdDate = `${data.year}-01-01`;
            else if (!id) createdDate = new Date();

            const payload = {
                name: data.name, description: data.description, brewery: data.brewery, style: data.style,
                image: imagePath, ...(createdDate ? { created_at: createdDate } : {})
            };
            
            let error = null;
            if (id) { const res = await Database.update('beer', payload, id); error = res.error; } 
            else { const res = await Database.create('beer', payload); error = res.error; }
            
            if (error) {
                if (error.code === '23505' || error.details?.includes('already exists')) throw new Error("Já existe!");
                throw error;
            }
            showToast("Salvo com sucesso!", "success");
        } catch (error) { showToast(error.message, "error"); } 
        finally { await listBeers(filter, limit, page); setLoading(false); }
    }, [listBeers, showToast]);

    const deleteBeer = useCallback(async (id, filter, limit, page) => {
        setLoading(true);
        try {
            const { error } = await Database.delete('beer', id);
            if (error) throw error;
            showToast("Cerveja excluída!", "success");
        } catch (error) { showToast("Erro ao excluir.", "error"); } 
        finally { await listBeers(filter, limit, page); setLoading(false); }
    }, [listBeers, showToast]);

    const saveReview = useCallback(async (beerId, reviewData) => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { error } = await supabase.from('reviews').insert({ beer_id: beerId, user_id: user.id, ...reviewData });
            if (error) throw error;
            showToast("Avaliação enviada!", "success");
            await findBeer(beerId); 
        } catch (error) { showToast("Erro ao salvar avaliação.", "error"); } 
        finally { setLoading(false); }
    }, [findBeer, showToast]);

    return { listBeers, findBeer, saveBeer, deleteBeer, saveReview, beers, beer, loading };
}

export default useBeers;