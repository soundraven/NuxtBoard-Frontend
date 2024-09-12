import { defineStore } from "pinia";
import type { UserInfo } from "../types/interface";
import Cookies from "js-cookie";

interface State {
  isAuthenticated: boolean;
  user: UserInfo;
}

export const useAuthStore = defineStore<
  string,
  State,
  {},
  {
    login(user: UserInfo, refreshToken: string, accessToken: string): void;
    logout(): void;
    autoLogin(): void;
    setUserName(): void;
  }
>("auth", {
  state: (): State => ({
    isAuthenticated: false,
    user: {
      email: "",
      id: 0,
      userName: "",
    },
  }),

  actions: {
    login(user, refreshToken, accessToken) {
      this.isAuthenticated = true;
      this.user = user;

      sessionStorage.setItem("user", JSON.stringify(user));
      Cookies.set("refreshToken", refreshToken, { expires: 7 });
      Cookies.set("accessToken", accessToken, { expires: 15 / 1440 });
    },

    logout() {
      this.isAuthenticated = false;
      this.user = {
        email: "",
        id: 0,
        userName: "",
      };

      sessionStorage.removeItem("user");
      Cookies.remove("refreshToken");
      Cookies.remove("accessToken");
      navigateTo("/");
    },

    async autoLogin() {
      const { $apiGet } = useNuxtApp();

      const result = await $apiGet<{ user: UserInfo }>(
        "users/me",
        {},
        {
          headers: {
            requiresToken: true,
          },
        }
      );

      if (result.success && result.data?.user) {
        this.isAuthenticated = true;
        this.user = result.data.user;
      } else {
        this.isAuthenticated = false;
        this.user = {
          email: "",
          id: 0,
          userName: "",
        };
      }
    },

    async setUserName() {
      const { $apiGet } = useNuxtApp();

      const result = await $apiGet<{ user: UserInfo }>(
        "users/me",
        {},
        {
          headers: {
            requiresToken: true,
          },
        }
      );

      if (result.success && result.data?.user) {
        this.user.userName = result.data.user.userName;
        sessionStorage.setItem("user", JSON.stringify(this.user));
      } else {
        this.isAuthenticated = false;
        this.user = {
          email: "",
          id: 0,
          userName: "",
        };
      }
    },
  },
});
