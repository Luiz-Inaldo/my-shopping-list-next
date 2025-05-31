import { supabase } from "@/lib/api";

export default async function getProfile(userEmail: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', userEmail)
            .single();

        return data;
    }