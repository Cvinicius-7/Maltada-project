import React, { createContext, useContext } from "react";
import Authentication from "../services/Authentication";
import Database from "../services/Database";
import Storage from "../services/Storage";
import Bucket from "../services/Bucket";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(null);
  const [user, setUser] = React.useState(null);

  const checkAuth = async () => {
    const auth = await Authentication.isAuthenticated();
    setIsAuthenticated(auth);
    if (auth) {
      const stored = Storage.getItem("user");
      if (stored) {
        setUser(stored.user);
      }
    }
  };

  React.useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await Authentication.login(email, password);
      if (error) throw error;
      const { data: roleData } = await Database.list("user_roles", "*", {
        xid_user: { exact: true, value: data.user.id },
      });
      const userRole = roleData && roleData.length > 0 ? roleData[0].role : 2;
      const { data: profileData } = await Database.get(
        "profiles",
        data.user.id
      );

      let avatarUrl = null;
      if (profileData && profileData.avatar_url) {
        avatarUrl = await Bucket.load(profileData.avatar_url, "images");
        console.log("Link gerado no Login:", avatarUrl);
      }

      const userToStore = {
        user: {
          ...data.user,
          role: userRole,
          full_name:
            profileData?.full_name || data.user.user_metadata.full_name,
          avatar_url: avatarUrl,
          avatar_path: profileData?.avatar_url,
        },
        session: data.session,
      };

      Storage.setItem("user", userToStore);
      setUser(userToStore.user);
      setIsAuthenticated(true);

      return { data: userToStore, error: null };
    } catch (error) {
      console.error("Erro no AuthContext:", error);
      await Authentication.logout();
      setIsAuthenticated(false);
      setUser(null);
      return { data: null, error };
    }
  };

  const updateProfile = async (formData) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser.user.id;
      let avatarPath = storedUser.user.avatar_path;

      if (formData.imageFile) {
        const fileName = `${userId}/${Date.now()}`;
        avatarPath = await Bucket.upload(
          "images",
          fileName,
          formData.imageFile
        );
      }

      const profileData = {
        id: userId,
        full_name: formData.fullName,
        avatar_url: avatarPath,
        updated_at: new Date(),
      };

      const { error } = await Database.upsert("profiles", profileData);
      if (error) throw error;

      let newAvatarUrl = storedUser.user.avatar_url;
      if (formData.imageFile) {
        newAvatarUrl = await Bucket.load(avatarPath, "images");
        console.log("Novo link gerado no Update:", newAvatarUrl);
      }

      const updatedUserStore = {
        ...storedUser,
        user: {
          ...storedUser.user,
          full_name: formData.fullName,
          avatar_url: newAvatarUrl,
          avatar_path: avatarPath,
        },
      };
      Storage.setItem("user", updatedUserStore);
      setUser(updatedUserStore.user);

      return { success: true };
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      return { success: false, error };
    }
  };
  const register = async (email, password, displayName) => {
    return await Authentication.register(email, password, {
      data: { full_name: displayName },
    });
  };
  const logout = async () => {
    await Authentication.logout();
    Storage.clear();
    setIsAuthenticated(false);
    setUser(null);
  };
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
