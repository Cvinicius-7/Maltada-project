import React, { createContext, useContext } from "react";
import Authentication from "../services/Authentication";
import Database from "../services/Database";
import Storage from "../services/Storage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = React.useState(null);

    const checkAuth = async () => {
        const auth = await Authentication.isAuthenticated();
        setIsAuthenticated(auth);
    }

    React.useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            // 1. Autenticação
            const { data, error } = await Authentication.login(email, password);
            if (error) throw error;

            // 2. Busca a Role (Função do usuário)
            // ATENÇÃO: Verifique se o nome da tabela no Supabase é 'user_roles' ou 'user_role'
            const { data: roleData, error: roleError } = await Database.list('user_roles', '*', {
                "xid_user": {
                    exact: true,
                    value: data.user.id
                },
            });

            // Se der erro ou não achar role, define como padrão (ex: 2) ou lança erro
            const userRole = (roleData && roleData.length > 0) ? roleData[0].role : 2; 

            // 3. Salva no Storage
            const userToStore = {
                user: {
                    ...data.user,
                    role: userRole,
                },
                session: data.session
            };
            Storage.setItem('user', userToStore);

            // 4. Atualiza o estado global (Fundamental para o redirecionamento funcionar)
            setIsAuthenticated(true);
            
            return { data: userToStore, error: null };

        } catch (error) {
            console.error("Erro no AuthContext:", error);
            await Authentication.logout();
            setIsAuthenticated(false);
            return { data: null, error };
        }
    }

    const register = async (email, password) => {
        return await Authentication.register(email, password);
    }

    const logout = async () => {
        await Authentication.logout();
        Storage.clear();
        setIsAuthenticated(false);
    }

    return <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
        {children}
    </AuthContext.Provider>
}

export function useAuth() {
    return useContext(AuthContext);
}