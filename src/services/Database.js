import { supabase } from "./SupabaseClient";

/**
 * Função 'list' modificada para:
 * 1. Traduzir o filtro 'title' para 'name'.
 * 2. Lidar com 'page' (paginação).
 * 3. Retornar { data, error, count }
 */
const list = async (table, fields, filter, limit, page = 1) => { // 1. Adicionado page
    let query = supabase
        .from(table)
        .select(fields, { count: 'exact' }); // 2. Adicionado { count: 'exact' }

    if (filter) {
        Object.keys(filter).forEach(key => {
            // 3. Traduz 'title' (do filtro) para 'name' (coluna do DB)
            const column = key === 'title' ? 'name' : key;

            if (filter[key].exact) {
                query = query.eq(column, filter[key].value);
            } else {
                // Aplica o filtro ilike (case-insensitive)
                query = query.ilike(column, `%${filter[key].value}%`);
            }
        });
    }

    if (limit) {
        // 4. Lógica de paginação (offset)
        const offset = (page - 1) * limit;
        query = query.range(offset, offset + limit - 1);
    }

    // 5. Retorna o objeto completo
    const { data, error, count } = await query;
    return { data, error, count };
}

const Database = {
    create: async (table, data) => {
        return await supabase
            .from(table)
            .insert([data])
            .select()
    },
    update: async (table, data, id) => {
        return await supabase
            .from(table)
            .update(data)
            .eq('id', id)
            .select()
    },
    delete: async (table, id) => {
        return await supabase
            .from(table)
            .delete()
            .eq('id', id);
    },
    list: list,

    /**
     * Função 'find' corrigida para funcionar com a nova 'list'
     */
    find: async (table, id) => {
        const { data, error } = await list(table, "*", { 
            "id": {
                exact: true,
                value: id
            },
        }, 1);

        if (error) return { data: null, error };
        // Retorna o primeiro objeto do array, ou null
        return { data: data && data.length > 0 ? data[0] : null, error: null };
    },

    /**
     * ADICIONADO: Função 'get' que seus hooks (useBeers, etc.)
     * estão tentando chamar em vez de 'find'.
     */
    get: async (table, id) => {
        const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
        return { data, error };
    },
}
export default Database;