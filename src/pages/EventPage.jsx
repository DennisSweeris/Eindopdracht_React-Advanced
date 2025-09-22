import React from "react";
import { useLoaderData, Form, useNavigate } from "react-router-dom";
import { Box, Heading, Text, Button, Stack, Image, Flex, Badge, Divider } from "@chakra-ui/react";

export const EventPage = ({ isNew }) => {
	const navigate = useNavigate();
	const data = useLoaderData();

	const formatDate = (dateString) => {
		const options = {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
			timeZone: "Europe/Amsterdam",
		};
		return new Date(dateString).toLocaleDateString("nl-NL", options);
	};

	const getCategoryNames = (categoryIds = []) => {
		if (!data.categories) return [];
		return categoryIds
			.map((id) => {
				const category = data.categories.find((cat) => cat.id === id);
				return category ? category.name : "";
			})
			.filter(Boolean);
	};

	if (isNew) {
		return (
			<Box
				maxW="800px"
				mx="auto"
				p={4}>
				<Heading mb={6}>Create Event</Heading>
				<Form method="post">
					<input
						name="title"
						placeholder="Title"
					/>
					<textarea
						name="description"
						placeholder="Description"
					/>
					<Button
						type="submit"
						colorScheme="teal"
						mt={4}>
						Save
					</Button>
				</Form>
			</Box>
		);
	}

	const { event, creator } = data;
	const categoryNames = getCategoryNames(event.categoryIds);

	return (
		<Box
			maxW="800px"
			mx="auto"
			p={4}>
			<Flex
				direction={{ base: "column", md: "row" }}
				gap={8}>
				<Box flex="1">
					{event.image && (
						<Image
							src={event.image}
							alt={event.title}
							objectFit="cover"
							w="100%"
							h="auto"
							borderRadius="lg"
							mb={4}
						/>
					)}
				</Box>

				<Box flex="1">
					<Stack spacing={4}>
						<Box>
							<Heading
								size="lg"
								mb={2}>
								{event.title}
							</Heading>
							<Text
								color="gray.600"
								fontSize="lg">
								Created by: {creator?.name || "Unknown"}
							</Text>
						</Box>

						{categoryNames.length > 0 && (
							<Box>
								<Text
									fontWeight="bold"
									mb={2}>
									Categories:
								</Text>
								<Flex
									gap={2}
									flexWrap="wrap">
									{categoryNames.map((name, index) => (
										<Badge
											key={index}
											colorScheme="teal"
											px={2}
											py={1}
											borderRadius="full">
											{name}
										</Badge>
									))}
								</Flex>
							</Box>
						)}

						<Divider my={2} />

						<Box>
							<Text
								fontWeight="bold"
								mb={2}>
								Description:
							</Text>
							<Text>{event.description}</Text>
						</Box>

						{event.location && (
							<Box>
								<Text
									fontWeight="bold"
									mb={2}>
									Location:
								</Text>
								<Text>{event.location}</Text>
							</Box>
						)}

						<Box>
							<Text
								fontWeight="bold"
								mb={2}>
								When:
							</Text>
							<Text>Starts: {formatDate(event.startTime)}</Text>
							<Text>Ends: {formatDate(event.endTime)}</Text>
						</Box>
					</Stack>

					<Stack
						direction="row"
						mt={8}
						spacing={4}>
						<Button
							onClick={() => navigate(`/events/${event.id}/edit`)}
							colorScheme="blue"
							flex="1">
							Edit Event
						</Button>
						<Form
							method="post"
							action={`/events/${event.id}/delete`}
							style={{ flex: 1 }}>
							<Button
								type="submit"
								colorScheme="red"
								w="100%">
								Delete Event
							</Button>
						</Form>
					</Stack>
				</Box>
			</Flex>
		</Box>
	);
};
