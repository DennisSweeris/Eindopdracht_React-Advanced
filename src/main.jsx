// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { EventsPage } from "./pages/EventsPage";
import { EventPage } from "./pages/EventPage";
import { Root } from "./components/Root";
import { eventsLoader, eventLoader } from "./loaders/eventLoaders";
import { createEventAction, updateEventAction, deleteEventAction } from "./loaders/eventActions";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		errorElement: <div>Something went wrong</div>,
		children: [
			{
				path: "events",
				element: <EventsPage />,
				loader: eventsLoader,
				action: createEventAction,
			},
			{
				path: "events/new",
				element: <EventPage isNew />,
				action: createEventAction,
			},
			{
				path: "events/:eventId",
				element: <EventPage />,
				loader: eventLoader,
				action: updateEventAction,
			},
			{
				path: "events/:eventId/delete",
				action: deleteEventAction,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<ChakraProvider>
			<RouterProvider router={router} />
		</ChakraProvider>
	</React.StrictMode>
);
