import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import {
  createClient,
  dedupExchange,
  cacheExchange,
  fetchExchange,
  ssrExchange,
  Provider,
} from "urql";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: "Zen Kurenaido",
    body: "Zen Maru Gothic",
  },
  colors: {
    brand: {
      900: "#1a365d",
      800: "#153e75",
      700: "#2a69ac",
    },
  },
  styles: {
    global: {
      "body, html": {
        minWidth: "100%",
        overflowX: "hidden",
      },
      "&::-webkit-scrollbar": {
        width: "4px",
      },
      "&::-webkit-scrollbar-track": {
        background: "cyan.900",
        width: "6px",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "green.900",
        borderRadius: "24px",
      },
    },
  },
});

const isServerSide = typeof window === "undefined";
const ssrCache = ssrExchange({ isClient: !isServerSide });
const client = createClient({
  url: "http://localhost:8000/api/graphql",
  exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange],
});

function MyApp({ Component, pageProps }) {
  return (
    <Provider value={client}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
export { theme };
