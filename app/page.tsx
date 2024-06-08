"use client";
import { useContext } from "react";
import { useQuery } from "react-query";
import { AuthContext } from "./contexts/AuthContext";
import { useSpotify } from "./services/spotifyProfile";

export const Home = () => {
  const authContext = useContext(AuthContext);
  if (authContext === null) {
    throw Error("Context is not available");
  }
  const { accessToken } = authContext;
  const { signIn, signOut, spotifyApi } = useSpotify();

  const query = useQuery({
    queryKey: ["playlists"],
    queryFn: () => {
      return spotifyApi?.currentUser.playlists.playlists(50);
    },
    enabled: !!spotifyApi,
  });

  if (!accessToken || !spotifyApi) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <button onClick={() => signIn()}>Login</button>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button onClick={() => signOut()}>Logout</button>
      {query.data?.items.map((item) => <span key={item.id}>{item.name}</span>)}
    </main>
  );
};

export default Home;
