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

  const mergeWithStats = async (beerList) => {
    const { data: stats } = await supabase.from("beer_stats").select("*");
    return beerList.map((b) => {
      const stat = stats?.find((s) => s.beer_id === b.id);
      const price = stat && stat.avg_price ? Number(stat.avg_price) : 0;

      return {
        ...b,
        rating: stat ? stat.average_rating_10 : null,
        reviews_count: stat ? stat.review_count : 0,
        avg_price: price,
      };
    });
  };

  const listBeers = useCallback(
    async (filter, limit, page, orderBy = "name_asc") => {
      setLoading(true);
      try {
        const { data, error } = await Database.list(
          "beer",
          "*",
          filter,
          limit,
          page
        );
        if (error) throw error;

        if (data && data.length > 0) {
          let processedData = await Promise.all(
            data.map(async (item) => {
              if (item.image && !item.image.startsWith("http")) {
                item.image = await Bucket.load(item.image, "beers");
              }
              return item;
            })
          );

          processedData = await mergeWithStats(processedData);
          processedData.sort((a, b) => {
            const priceA = a.avg_price;
            const priceB = b.avg_price;
            const ratingA = a.rating || 0;
            const ratingB = b.rating || 0;
            switch (orderBy) {
              case "price_asc":
                if (priceA === 0) return 1;
                if (priceB === 0) return -1;
                return priceA - priceB;
              case "price_desc":
                return priceB - priceA;
              case "rating_desc":
                return ratingB - ratingA;
              case "rating_asc":
                return ratingA - ratingB;
              case "name_desc":
                return b.name.localeCompare(a.name);
              case "name_asc":
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
    },
    []
  );

  const findBeer = useCallback(async (id) => {
    setLoading(true);
    try {
      const { data: beerData, error } = await Database.get("beer", id);
      if (error) throw error;

      if (beerData) {
        if (beerData.image && !beerData.image.startsWith("http")) {
          beerData.image = await Bucket.load(beerData.image, "beers");
        }

        const { data: stat } = await supabase
          .from("beer_stats")
          .select("*")
          .eq("beer_id", id)
          .single();
        const { data: reviews } = await supabase
          .from("reviews")
          .select("*, profiles:user_id(full_name, avatar_url)")
          .eq("beer_id", id);

        let processedReviews = [];
        if (reviews && reviews.length > 0) {
          processedReviews = await Promise.all(
            reviews.map(async (review) => {
              if (
                review.profiles?.avatar_url &&
                !review.profiles.avatar_url.startsWith("http")
              ) {
                const publicUrl = await Bucket.load(
                  review.profiles.avatar_url,
                  "images"
                );
                review.profiles.avatar_url = publicUrl;
              }
              return review;
            })
          );
        }

        setBeer({
          ...beerData,
          rating: stat ? stat.average_rating_10 : null,
          reviews_count: stat ? stat.review_count : 0,
          stats: stat,
          reviews: processedReviews,
        });
      }
    } catch (error) {
      setBeer({});
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserReviews = useCallback(async (userId) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, beer:beer_id(id, name, image)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) {
        const processed = await Promise.all(
          data.map(async (review) => {
            if (
              review.beer &&
              review.beer.image &&
              !review.beer.image.startsWith("http")
            ) {
              review.beer.image = await Bucket.load(review.beer.image, "beers");
            }
            return review;
          })
        );
        return processed;
      }
      return [];
    } catch (error) {
      console.error("Erro ao buscar reviews do usuário:", error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const saveBeer = useCallback(
    async (data, filter, limit, page, id = null) => {
      setLoading(true);
      try {
        let imagePath = data.currentImagePath;
        if (data.image && typeof data.image === "object") {
          const imageName = Bucket.generateNameFile(data.name);
          imagePath = await Bucket.upload("beers", imageName, data.image);
        }
        let createdDate = undefined;
        if (data.year) createdDate = `${data.year}-01-01`;
        else if (!id) createdDate = new Date();

        const payload = {
          name: data.name,
          description: data.description,
          brewery: data.brewery,
          style: data.style,
          price: data.price,
          image: imagePath,
          ...(createdDate ? { created_at: createdDate } : {}),
        };

        let error = null;
        if (id) {
          const res = await Database.update("beer", payload, id);
          error = res.error;
        } else {
          const res = await Database.create("beer", payload);
          error = res.error;
        }

        if (error) {
          if (
            error.code === "23505" ||
            error.details?.includes("already exists")
          )
            throw new Error("Já existe!");
          throw error;
        }
        showToast("Salvo com sucesso!", "success");
      } catch (error) {
        showToast(error.message, "error");
      } finally {
        await listBeers(filter, limit, page);
        setLoading(false);
      }
    },
    [listBeers, showToast]
  );

  const deleteBeer = useCallback(
    async (id, filter, limit, page) => {
      setLoading(true);
      try {
        const { error } = await Database.delete("beer", id);
        if (error) throw error;
        showToast("Cerveja excluída!", "success");
      } catch (error) {
        showToast("Erro ao excluir.", "error");
      } finally {
        await listBeers(filter, limit, page);
        setLoading(false);
      }
    },
    [listBeers, showToast]
  );

  const saveReview = useCallback(
    async (beerId, reviewData) => {
      setLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error("Usuário não logado.");
        const { error } = await supabase.from("reviews").insert({
          beer_id: beerId,
          user_id: user.id,
          ...reviewData,
        });
        if (error) throw error;
        showToast("Nova avaliação registrada!", "success");
        await findBeer(beerId);
      } catch (error) {
        console.error("Erro ao avaliar:", error);
        showToast("Erro ao salvar avaliação: " + error.message, "error");
      } finally {
        setLoading(false);
      }
    },
    [findBeer, showToast]
  );

  return {
    listBeers,
    findBeer,
    getUserReviews,
    saveBeer,
    deleteBeer,
    saveReview,
    beers,
    beer,
    loading,
  };
};

export default useBeers;
