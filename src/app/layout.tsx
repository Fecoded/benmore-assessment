"use client";

import { Inter } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import "./globals.css";
import theme from "@src/utils/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClientConfig } from "@src/utils";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const queryClient = new QueryClient(queryClientConfig);

	return (
		<html lang="en">
			<body className={`${inter.className}`}>
				<QueryClientProvider client={queryClient}>
					<AppRouterCacheProvider>
						<ThemeProvider theme={theme}>{children}</ThemeProvider>
					</AppRouterCacheProvider>
				</QueryClientProvider>
			</body>
		</html>
	);
}
