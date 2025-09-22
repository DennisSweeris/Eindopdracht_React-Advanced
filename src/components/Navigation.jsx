import React from "react";
import { Link } from "react-router-dom";
import { Flex, Box, Button, Container, Heading } from "@chakra-ui/react";

export const Navigation = () => {
	return (
		<Box
			as="nav"
			bg="blue.600"
			color="white"
			position="sticky"
			top="0"
			zIndex="sticky"
			boxShadow="sm">
			<Container
				maxW="container.xl"
				px={[4, 6, 8]}>
				<Flex
					align="center"
					justify="space-between"
					height="64px">
					<Heading
						as="h1"
						size="lg">
						Event App
					</Heading>
					<Flex
						as="ul"
						listStyleType="none"
						gap={4}>
						<Box as="li">
							<Button
								as={Link}
								to="/events"
								colorScheme="whiteAlpha"
								variant="ghost">
								Events
							</Button>
						</Box>
						<Box as="li">
							<Button
								as={Link}
								to="/events/1"
								colorScheme="whiteAlpha"
								variant="ghost">
								Event Details
							</Button>
						</Box>
					</Flex>
				</Flex>
			</Container>
		</Box>
	);
};
