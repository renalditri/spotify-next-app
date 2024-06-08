"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const QueryProvider = ({ children }: React.PropsWithChildren) => {
  const [client] = useState(new QueryClient());

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export default QueryProvider;
