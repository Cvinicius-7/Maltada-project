import { supabase } from "./SupabaseClient";

const Bucket = {
  generateNameFile: (name) => {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9-_\.]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();
  },

  upload: async (bucket, name, file) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(name, file, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      throw error;
    }

    return data.path;
  },

  load: async (fullPath, bucket = "images") => {
    const { data } = await supabase.storage.from(bucket).getPublicUrl(fullPath);

    return data.publicUrl;
  },
};

export default Bucket;
