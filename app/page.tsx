"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useGetSdk } from "./services/useGetSdk";
// import { usePlaylists } from "./services/usePlaylists";
import { useQuery } from "react-query";

export const Home = () => {
  const session = useSession();
  const sdk = useGetSdk();

  const query = useQuery({
    queryKey: ["playlists", session.data?.user?.name],
    queryFn: () => {
      return sdk.currentUser.playlists.playlists(50);
    },
  });
  // const playlists = usePlaylists(sdk);
  if (!session || session.status !== "authenticated") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <button onClick={() => signIn("spotify")}>Login</button>
      </main>
    );
  }
  return (
    <div>
      <p>
        Logged in as {session.data.user?.name} {query.isLoading}
      </p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
};

export default Home;
