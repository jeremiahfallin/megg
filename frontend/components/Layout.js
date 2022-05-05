import Head from "next/head";
import { Box } from "@chakra-ui/react";

import Link from "./Link";

export default function Layout({ children }) {
  return (
    <Box>
      <Head>
        <title>Me.gg</title>
        <meta name="description" content="A League of Legends stats website." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box as="header">
        <Link href="/">Me.gg</Link>
      </Box>

      <Box as="main">{children}</Box>

      <Box as="footer"></Box>
    </Box>
  );
}
