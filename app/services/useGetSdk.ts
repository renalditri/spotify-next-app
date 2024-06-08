import {
  AccessToken,
  IAuthStrategy,
  SdkOptions,
  SpotifyApi,
} from "@spotify/web-api-ts-sdk";
import { useSession } from "next-auth/react";
import { AuthUser } from "./authOptions";

const useAuthStrategy = () => {
  const session = useSession();
  const user = session.data?.user as AuthUser;
  const getAccessToken = async () => {
    if (!session) {
      return {} as AccessToken;
    }
    return {
      access_token: user.access_token,
      token_type: "Bearer",
      expires_in: user.expires_in,
      expires: user.expires_at,
      refresh_token: user.refresh_token,
    } as AccessToken;
  };
  return {
    getOrCreateAccessToken: getAccessToken,
    getAccessToken,
    removeAccessToken: () => {
      console.warn("[Spotify-SDK][WARN]\nremoveAccessToken not implemented");
    },
    setConfiguration: () => {
      console.warn("[Spotify-SDK][WARN]\nsetConfiguration not implemented");
    },
  };
};

export const useGetSdk = (config?: SdkOptions) => {
  const strategy: IAuthStrategy = useAuthStrategy();
  const sdk = new SpotifyApi(strategy, config);
  return sdk;
};
