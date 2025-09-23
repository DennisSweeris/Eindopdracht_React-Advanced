export const eventsLoader = async () => {
	try {
		const [usersResponse, eventsResponse] = await Promise.all([
			fetch("http://localhost:3000/users"),
			fetch("http://localhost:3000/events"),
		]);

		if (!usersResponse.ok || !eventsResponse.ok) {
			throw new Error("Could not retrieve users or events data");
		}

		const [users, events] = await Promise.all([usersResponse.json(), eventsResponse.json()]);

		return { users, events };
	} catch (error) {
		throw new Error(`Could not retrieve data: ${error.message}`);
	}
};

export const eventLoader = async ({ params }) => {
	try {
		const [usersResponse, eventResponse] = await Promise.all([
			fetch("http://localhost:3000/users"),
			fetch(`http://localhost:3000/events/${params.eventId}`),
		]);

		if (!usersResponse.ok || !eventResponse.ok) {
			throw new Error(`Could not retrieve data for event with id ${params.eventId}`);
		}

		const [users, event] = await Promise.all([usersResponse.json(), eventResponse.json()]);
		const creator = users.find((user) => user.id === event.createdBy);

		return { creator, event, users };
	} catch (error) {
		throw new Error(`Could not retrieve data: ${error.message}`);
	}
};
