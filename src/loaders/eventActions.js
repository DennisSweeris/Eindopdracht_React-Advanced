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

export const deleteEventAction = async ({ params }) => {
	const response = await fetch(`http://localhost:3000/events/${params.eventId}`, {
		method: "DELETE",
	});

	if (!response.ok) throw new Error("Failed to delete event");

	return true;
};
