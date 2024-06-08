import { AuthContext } from "@/contexts/AuthContext";
import {
  AccessToken,
  IAuthStrategy,
  SpotifyApi,
} from "@spotify/web-api-ts-sdk";
import { useContext, useEffect, useState } from "react";

const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

if (!CLIENT_ID) {
  throw new Error("Missing SPOTIFY_CLIENT_ID");
}

if (!CLIENT_SECRET) {
  throw new Error("Missing SPOTIFY_CLIENT_SECRET");
}

const scopes = [
  "user-read-email",
  "user-read-private",
  "user-top-read",
  "user-read-playback-state",
  "user-library-read",
  "playlist-read-private",
  "playlist-read-collaborative",
];

export const useSpotify = () => {
  const [spotifyApi, setSpotifyApi] = useState<SpotifyApi | null>(null);
  const authContext = useContext(AuthContext);
  if (authContext === null) {
    throw Error("Context is not available");
  }
  const { accessToken, setToken } = authContext;

  const signIn = async () => {
    if (accessToken) {
      console.warn("already signed in");
      return;
    }
    SpotifyApi.performUserAuthorization(
      CLIENT_ID as string,
      "http://localhost:3000/",
      scopes,
      async (token) => {
        setToken(token);
      }
    );
  };

  const signOut = () => {
    setToken(null);
  };

  useEffect(() => {
    (async () => {
      const getAccessToken = async () => {
        if (!accessToken) {
          return {} as AccessToken;
        }
        return {
          access_token: accessToken.access_token,
          token_type: "Bearer",
          expires_in: accessToken.expires_in,
          expires: accessToken.expires,
          refresh_token: accessToken.refresh_token,
        } as AccessToken;
      };
      const authStrategy: IAuthStrategy = {
        getAccessToken,
        getOrCreateAccessToken: getAccessToken,
        removeAccessToken: () => {
          setToken(null);
        },
        setConfiguration: () => {
          console.warn("Not implemented");
        },
      };

      const sdk = new SpotifyApi(authStrategy);

      try {
        const { authenticated } = await sdk.authenticate();
        if (authenticated) {
          setSpotifyApi(() => sdk);
        }
      } catch (e: Error | unknown) {
        const error = e as Error;
        if (
          error &&
          error.message &&
          error.message.includes("No verifier found in cache")
        ) {
          console.error(
            "If you are seeing this error in a React Development Environment it's because React calls useEffect twice. Using the Spotify SDK performs a token exchange that is only valid once, so React re-rendering this component will result in a second, failed authentication. This will not impact your production applications (or anything running outside of Strict Mode - which is designed for debugging components).",
            error
          );
        } else {
          console.error(e);
        }
      }
    })();
  }, [accessToken, setToken]);

  return { signIn, signOut, spotifyApi };
};
