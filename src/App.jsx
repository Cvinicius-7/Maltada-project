import React from 'react';
import { supabase } from './services/SupabaseClient';

const App = () => {
    console.log(supabase)

    return (
        <div>
            <h1>Bem-vindo ao Projeto Bloco Atualizado e com deploy automatizado!</h1>
        </div>
    );
};

export default App;