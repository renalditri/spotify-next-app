"use client";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { useQuery } from "react-query";

const getPlaylists = async (sdk: SpotifyApi) => {
  return await sdk.currentUser.playlists.playlists(50);
};

export const usePlaylists = async (sdk: SpotifyApi) => {
  const user = await sdk.currentUser.profile();

  return useQuery({
    queryKey: ["playlists", user.id],
    queryFn: () => getPlaylists(sdk),
  });
};

export default usePlaylists;
