import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

// Import routes
import { createEvent } from "./routes/create-events";
import { registerForEvent } from "./routes/register-for-event";
import { getEvent } from "./routes/get-event";
import { getAttendeeBadge } from "./routes/get-attendee-badge";

const app = fastify();

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Default route
app.get("/", () => {
    return "Hi there! 😊";
});

// Add a new event
app.register(createEvent);

// Register attendee for an event
app.register(registerForEvent);

// Get an event
app.register(getEvent);

// Get attendee badge
app.register(getAttendeeBadge);

app.listen({ port: 3000 }).then(() => {
    console.log("Server is running on port 3000");
});