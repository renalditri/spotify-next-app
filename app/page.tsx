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
    queryKey: ["topArtists"],
    queryFn: () => {
      return spotifyApi?.currentUser.topItems("artists");
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

  const genres = () => {
    const tempObj: { [key: string]: boolean } = {};
    query.data?.items.forEach((item) => {
      item.genres.forEach((genre) => {
        tempObj[genre] = true;
      });
    });
    return Object.keys(tempObj);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button onClick={() => signOut()}>Logout</button>
      {genres().map((item, index) => (
        <span key={index}>{item}</span>
      ))}
    </main>
  );
};

export default Home;
