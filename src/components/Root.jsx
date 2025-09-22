import React from "react";
import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import { Box, Flex, Container } from "@chakra-ui/react";

export const Root = () => {
	return (
		<Flex
			minHeight="100vh"
			width="100%"
			flexDirection="column"
			bg="gray.50" // Lichtgrijze achtergrond voor de hele pagina
		>
			<Navigation />
			<Box
				as="main"
				flexGrow={1}
				py={[4, 6, 8]} // Responsieve padding
				px={[4, 6, 8]} // Responsieve padding
			>
				<Container maxW="container.xl">
					<Outlet />
				</Container>
			</Box>
		</Flex>
	);
};
