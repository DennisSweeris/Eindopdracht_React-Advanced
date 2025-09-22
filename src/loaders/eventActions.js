// For Posting, Editing and Deleting events

export const createEventAction = async ({ request }, eventData = null) => {
	// Als er geen eventData is, gebruik dan het oude gedrag met formData
	if (!eventData) {
		const formData = await request.formData();
		eventData = Object.fromEntries(formData);
	}

	// Zorg ervoor dat categoryIds een array is
	if (eventData.categoryIds && !Array.isArray(eventData.categoryIds)) {
		eventData.categoryIds = [eventData.categoryIds];
	}

	const response = await fetch("http://localhost:3000/events", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(eventData),
	});

	if (!response.ok) throw new Error("Failed to create event");
	return response.json();
};

export const updateEventAction = async ({ params }, eventData) => {
	const response = await fetch(`http://localhost:3000/events/${params.eventId}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(eventData),
	});

	if (!response.ok) throw new Error("Failed to update event");

	return response.json();
};

export const deleteEventAction = async ({ params, toast, navigate }) => {
	try {
		const response = await fetch(`http://localhost:3000/events/${params.eventId}`, {
			method: "DELETE",
		});

		if (!response.ok) throw new Error("Failed to delete event");

		// Toon succesmelding als toast beschikbaar is
		if (toast) {
			toast({
				title: "Evenement verwijderd",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		}

		// Navigeer terug naar events als navigate functie beschikbaar is
		if (navigate) {
			navigate("/events");
		}

		return true;
	} catch (error) {
		console.error("Fout bij verwijderen:", error);
		
		// Toon foutmelding als toast beschikbaar is
		if (toast) {
			toast({
				title: "Fout bij verwijderen",
				description: error.message || "Er is een fout opgetreden bij het verwijderen van het evenement.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}

		throw error; // Gooi de fout opnieuw zodat de aanroepende component deze kan afhandelen indien nodig
	}
};
