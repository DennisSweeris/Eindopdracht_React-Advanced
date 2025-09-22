import React, { useState } from "react";
import { useLoaderData, Link, useNavigate } from "react-router-dom";
import {
	Box,
	Heading,
	Grid,
	Button,
	Card,
	CardBody,
	CardFooter,
	Image,
	Text,
	Flex,
	Badge,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	FormControl,
	FormLabel,
	Input,
	Textarea,
	ModalFooter,
	useToast,
	IconButton,
	Tooltip,
	Divider,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { createEventAction, deleteEventAction, updateEventAction } from "../loaders/eventActions";

export const EventsPage = () => {
	const { events, categories } = useLoaderData();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedEvent, setSelectedEvent] = useState(null);
	const navigate = useNavigate();
	const toast = useToast();

	const formatDate = (dateString) => {
		if (!dateString) return "Niet gespecificeerd";
		return new Date(dateString).toLocaleDateString("nl-NL", {
			day: "2-digit",
			month: "long",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getCategoryNames = (categoryIds = []) => {
		if (!categories) return [];
		return categoryIds
			.map((id) => {
				const category = categories.find((cat) => cat.id === id);
				return category ? category.name : "";
			})
			.filter(Boolean);
	};

	const handleDelete = async (eventId) => {
		if (window.confirm("Weet je zeker dat je dit evenement wilt verwijderen?")) {
			try {
				await deleteEventAction({ params: { eventId } });
				toast({
					title: "Evenement verwijderd",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
				// Ga na het verwijderen terug naar de events pagina
				navigate("/events");
			} catch (error) {
				console.error("Fout bij verwijderen:", error);
				toast({
					title: "Fout bij verwijderen",
					description:
						error.message || "Er is een fout opgetreden bij het verwijderen van het evenement.",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			}
		}
	};

	const handleEdit = (event, e) => {
		e.stopPropagation();
		setSelectedEvent(event);
		onOpen();
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);

		// Verzamel de geselecteerde categorieën
		const categoryCheckboxes = Array.from(e.target.elements)
			.filter((el) => el.name === "categoryIds" && el.checked)
			.map((el) => Number(el.value));

		// In de handleSubmit functie van EventsPage.jsx
		const eventData = {
			title: formData.get("title") || "Nieuw evenement", // Fallback titel
			description: formData.get("description") || "", // Lege string als fallback
			image: formData.get("image") || "https://via.placeholder.com/300x200?text=Geen+afbeelding", // Fallback afbeelding
			location: formData.get("location") || "Locatie niet gespecificeerd", // Fallback locatie
			startTime: formData.get("startTime") || new Date().toISOString(), // Huidige tijd als fallback
			endTime: formData.get("endTime") || new Date(Date.now() + 3600000).toISOString(), // 1 uur later als fallback
			categoryIds: categoryCheckboxes.length > 0 ? categoryCheckboxes : [2], // Standaard categorie (bijv. games) als fallback
			createdBy: 1, // Zorg ervoor dat je de huidige gebruiker ID hier zet
		};

		try {
			if (selectedEvent) {
				// Update bestaand evenement
				await updateEventAction(
					{
						request: { formData: () => new FormData() }, // Leeg formdata object
						params: { eventId: selectedEvent.id },
					},
					eventData
				);

				toast({
					title: "Evenement bijgewerkt",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			} else {
				// Maak nieuw evenement
				await createEventAction(
					{
						request: { formData: () => new FormData() },
					},
					eventData
				);

				toast({
					title: "Evenement toegevoegd",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			}

			onClose();
			navigate("."); // Refresh de pagina
		} catch (error) {
			toast({
				title: "Er is iets misgegaan",
				description: error.message,
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	};

	return (
		<Box
			p={4}
			maxW="1400px"
			mx="auto">
			<Flex
				justify="space-between"
				align="center"
				mb={8}>
				<Heading>Evenementen</Heading>
				<Button
					colorScheme="teal"
					onClick={() => {
						setSelectedEvent(null);
						onOpen();
					}}>
					+ Evenement toevoegen
				</Button>
			</Flex>

			<Grid
				templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
				gap={6}
				mt={4}>
				{events.map((event) => (
					<Card
						key={event.id}
						as={Link}
						to={`/events/${event.id}`}
						_hover={{ transform: "translateY(-4px)", shadow: "lg" }}
						transition="all 0.2s"
						position="relative"
						overflow="hidden">
						{event.image && (
							<Image
								src={event.image}
								alt={event.title}
								objectFit="cover"
								h="160px"
								w="100%"
							/>
						)}
						<CardBody>
							<Flex
								justify="space-between"
								align="start">
								<Heading
									size="md"
									mb={2}>
									{event.title}
								</Heading>
								<Flex
									gap={2}
									onClick={(e) => e.preventDefault()}>
									<Tooltip label="Bewerken">
										<IconButton
											icon={<EditIcon />}
											size="sm"
											onClick={(e) => handleEdit(event, e)}
											aria-label="Bewerk evenement"
										/>
									</Tooltip>
									<Tooltip label="Verwijderen">
										<IconButton
											icon={<DeleteIcon />}
											size="sm"
											colorScheme="red"
											onClick={(e) => handleDelete(event.id, e)}
											aria-label="Verwijder evenement"
										/>
									</Tooltip>
								</Flex>
							</Flex>

							<Text
								noOfLines={2}
								mb={2}
								color="gray.600">
								{event.description}
							</Text>

							<Divider my={2} />

							<Text
								fontSize="sm"
								color="gray.600"
								mb={2}>
								<Text
									as="span"
									fontWeight="bold">
									Start:
								</Text>{" "}
								{formatDate(event.startTime)}
							</Text>
							<Text
								fontSize="sm"
								color="gray.600"
								mb={3}>
								<Text
									as="span"
									fontWeight="bold">
									Eind:
								</Text>{" "}
								{formatDate(event.endTime)}
							</Text>

							{event.categoryIds?.length > 0 && (
								<Flex
									wrap="wrap"
									gap={2}
									mt={2}>
									{getCategoryNames(event.categoryIds).map((name, idx) => (
										<Badge
											key={idx}
											colorScheme="teal"
											variant="subtle"
											px={2}
											py={1}>
											{name}
										</Badge>
									))}
								</Flex>
							)}
						</CardBody>
						<CardFooter pt={0}>
							<Button
								colorScheme="blue"
								size="sm"
								width="100%"
								onClick={(e) => {
									e.preventDefault();
									navigate(`/events/${event.id}`);
								}}>
								Bekijk details
							</Button>
						</CardFooter>
					</Card>
				))}
			</Grid>

			{/* Add/Edit Event Modal */}
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size="xl">
				<ModalOverlay />
				<ModalContent
					as="form"
					onSubmit={handleSubmit}>
					<ModalHeader>
						{selectedEvent ? "Evenement bewerken" : "Nieuw evenement toevoegen"}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<FormControl
							mb={4}
							isRequired>
							<FormLabel>Titel</FormLabel>
							<Input
								name="title"
								placeholder="Titel van het evenement"
								defaultValue={selectedEvent?.title || ""}
							/>
						</FormControl>

						<FormControl mb={4}>
							<FormLabel>Omschrijving(Optioneel)</FormLabel>
							<Textarea
								name="description"
								placeholder="Beschrijf je evenement"
								rows={3}
								defaultValue={selectedEvent?.description || ""}
							/>
						</FormControl>

						<FormControl mb={4}>
							<FormLabel>Afbeelding URL</FormLabel>
							<Input
								name="image"
								placeholder="https://voorbeeld.com/afbeelding.jpg"
								defaultValue={selectedEvent?.image || ""}
							/>
						</FormControl>

						<FormControl
							mb={4}
							isRequired>
							<FormLabel>Locatie</FormLabel>
							<Input
								name="location"
								placeholder="Locatie van het evenement"
								defaultValue={selectedEvent?.location || ""}
							/>
						</FormControl>

						<FormControl
							mb={4}
							isRequired>
							<FormLabel>Starttijd</FormLabel>
							<Input
								type="datetime-local"
								name="startTime"
								defaultValue={
									selectedEvent?.startTime
										? new Date(selectedEvent.startTime).toISOString().slice(0, 16)
										: ""
								}
							/>
						</FormControl>

						<FormControl
							mb={4}
							isRequired>
							<FormLabel>Eindtijd</FormLabel>
							<Input
								type="datetime-local"
								name="endTime"
								defaultValue={
									selectedEvent?.endTime
										? new Date(selectedEvent.endTime).toISOString().slice(0, 16)
										: ""
								}
							/>
						</FormControl>

						<FormControl mb={4}>
							<FormLabel>Categorieën</FormLabel>
							<Flex
								wrap="wrap"
								gap={2}>
								{categories?.map((category) => (
									<Box key={category.id}>
										<input
											type="checkbox"
											id={`cat-${category.id}`}
											name="categoryIds"
											value={category.id}
											defaultChecked={selectedEvent?.categoryIds?.includes(category.id)}
											style={{ marginRight: "5px" }}
										/>
										<label htmlFor={`cat-${category.id}`}>{category.name}</label>
									</Box>
								))}
							</Flex>
						</FormControl>
					</ModalBody>

					<ModalFooter>
						<Button
							variant="ghost"
							mr={3}
							onClick={onClose}>
							Annuleren
						</Button>
						<Button
							colorScheme="blue"
							type="submit">
							{selectedEvent ? "Opslaan" : "Toevoegen"}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};
