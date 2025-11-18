import { supabase } from "./SupabaseClient";

const list = async (table, fields, filter, limit, page = 1) => {
    let query = supabase
        .from(table)
        .select(fields, { count: 'exact' });

    if (filter) {
        Object.keys(filter).forEach(key => {
            const column = key === 'title' ? 'name' : key;

            if (filter[key].exact) {
                query = query.eq(column, filter[key].value);
            } else {
                query = query.ilike(column, `%${filter[key].value}%`);
            }
        });
    }

    if (limit) {
        const offset = (page - 1) * limit;
        query = query.range(offset, offset + limit - 1);
    }

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

    find: async (table, id) => {
        const { data, error } = await list(table, "*", { 
            "id": {
                exact: true,
                value: id
            },
        }, 1);

        if (error) return { data: null, error };
        return { data: data && data.length > 0 ? data[0] : null, error: null };
    },

    get: async (table, id) => {
        const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
        return { data, error };
    },
}
export default Database;