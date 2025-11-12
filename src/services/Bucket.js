// MUDANÇA 1: Importação nomeada (com chaves)
import { supabase } from "./SupabaseClient"; 
//import { decode } from 'base64-arraybuffer'

const Bucket = {
    generateNameFile: (name) => {
        return name.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // remove marcas diacríticas
            .replace(/[^a-zA-Z0-9-_\.]/g, '') // remove tudo que não for letra, número, hífen, underline ou ponto
            .replace(/\s+/g, '-') // substitui espaços por hífen
            .toLowerCase(); // deixa tudo minúsculo
    },

    // MUDANÇA 3: A função agora aceita o 'file' (File Object) diretamente
    upload: async (path, name, file) => {
        const finalPathAndFile = `${path}/${name}`

        // O Supabase faz o upload do File object direto, não precisamos de base64
        const { data, error } = await supabase.storage.from('images').upload(finalPathAndFile, file, {
            contentType: file.type // O Supabase lê o tipo de imagem do próprio arquivo
        });

        if (error) {
          throw error;
        }

        return data.path;
    },
    load: async (fullPath) => {
        const { data } = await supabase.storage.from('images').getPublicUrl(fullPath);
        return data.publicUrl;
    }
}

export default Bucket;