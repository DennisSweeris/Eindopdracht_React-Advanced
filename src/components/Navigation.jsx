import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Flex, 
  Box, 
  Button, 
  Container, 
  Heading, 
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useDisclosure,
  VStack,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  useToast
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

export const Navigation = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [image, setImage] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const toast = useToast();

  // Dit is een tijdelijke lijst - vervang dit door data uit events.json
  const categories = [
    { id: 1, name: 'Muziek' },
    { id: 2, name: 'Sport' },
    { id: 3, name: 'Eten & Drinken' },
    { id: 4, name: 'Kunst & Cultuur' },
    { id: 5, name: 'Overig' }
  ];

  const handleAddCategory = () => {
    if (selectedCategory && !selectedCategories.includes(selectedCategory)) {
      setSelectedCategories([...selectedCategories, selectedCategory]);
      setSelectedCategory('');
    }
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setSelectedCategories(selectedCategories.filter(cat => cat !== categoryToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedCategories.length === 0) {
      toast({
        title: 'Fout',
        description: 'Selecteer ten minste één categorie',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Hier zou je de API call doen om het evenement aan te maken
    console.log({
      title,
      description,
      startTime,
      endTime,
      image: image || 'https://via.placeholder.com/300x200?text=Geen+afbeelding',
      location,
      categoryIds: selectedCategories,
      createdBy: 1 // Dit wordt later vervangen door de ingelogde gebruiker
    });

    // Toon succesmelding
    toast({
      title: 'Evenement aangemaakt',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    // Reset formulier en sluit modal
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartTime('');
    setEndTime('');
    setImage('');
    setLocation('');
    setSelectedCategory('');
    setSelectedCategories([]);
  };
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
								leftIcon={<AddIcon />}
								onClick={onOpen}
								colorScheme="whiteAlpha"
								variant="ghost">
								Evenement Toevoegen
							</Button>
						</Box>
					</Flex>
				</Flex>
			</Container>

			{/* Add Event Modal */}
			<Modal isOpen={isOpen} onClose={onClose} size="xl">
				<ModalOverlay />
				<ModalContent as="form" onSubmit={handleSubmit}>
					<ModalHeader>Nieuw Evenement Toevoegen</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<VStack spacing={4}>
							<FormControl isRequired>
								<FormLabel>Titel</FormLabel>
								<Input 
									placeholder="Titel van het evenement" 
									value={title}
									onChange={(e) => setTitle(e.target.value)}
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Beschrijving (optioneel)</FormLabel>
								<Textarea 
									placeholder="Beschrijf je evenement" 
									value={description}
									onChange={(e) => setDescription(e.target.value)}
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Afbeelding URL (optioneel)</FormLabel>
								<Input 
									placeholder="https://voorbeeld.com/afbeelding.jpg" 
									value={image}
									onChange={(e) => setImage(e.target.value)}
								/>
							</FormControl>

							<FormControl isRequired>
								<FormLabel>Locatie</FormLabel>
								<Input 
									placeholder="Locatie van het evenement" 
									value={location}
									onChange={(e) => setLocation(e.target.value)}
								/>
							</FormControl>

							<FormControl isRequired>
								<FormLabel>Starttijd</FormLabel>
								<Input 
									type="datetime-local" 
									value={startTime}
									onChange={(e) => setStartTime(e.target.value)}
								/>
							</FormControl>

							<FormControl isRequired>
								<FormLabel>Eindtijd</FormLabel>
								<Input 
									type="datetime-local" 
									value={endTime}
									onChange={(e) => setEndTime(e.target.value)}
								/>
							</FormControl>

							<FormControl isRequired>
								<FormLabel>Categorieën</FormLabel>
								<HStack mb={2} spacing={2} flexWrap="wrap">
									{selectedCategories.map((category, index) => (
										<Tag key={index} size="md" colorScheme="blue" borderRadius="full">
											<TagLabel>{category}</TagLabel>
											<TagCloseButton onClick={() => handleRemoveCategory(category)} />
										</Tag>
									))}
								</HStack>
								<HStack>
									<Select 
										placeholder="Selecteer categorie"
										value={selectedCategory}
										onChange={(e) => setSelectedCategory(e.target.value)}
									>
										{categories.map(category => (
											<option 
												key={category.id} 
												value={category.name}
												disabled={selectedCategories.includes(category.name)}
											>
												{category.name}
											</option>
										))}
									</Select>
									<Button 
										type="button" 
										onClick={handleAddCategory}
										isDisabled={!selectedCategory}
									>
										Toevoegen
									</Button>
								</HStack>
							</FormControl>
						</VStack>
					</ModalBody>

					<ModalFooter>
						<Button variant="ghost" mr={3} onClick={onClose}>
							Annuleren
						</Button>
						<Button colorScheme="blue" type="submit">
							Toevoegen
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};
