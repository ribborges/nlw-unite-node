import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import fastifyCors from "@fastify/cors";

// Import routes
import { createEvent } from "./routes/create-events";
import { registerForEvent } from "./routes/register-for-event";
import { getEvent } from "./routes/get-event";
import { getAttendeeBadge } from "./routes/get-attendee-badge";
import { checkIn } from "./routes/check-in";
import { getEventAttendees } from "./routes/get-event-attendees";

// Import error handler
import { errorHandler } from "./error-handler";

const app = fastify();

// Add CORS
app.register(fastifyCors, {
    origin: "*"
});

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Register Swagger
app.register(fastifySwagger, {
    swagger: {
        consumes: ["application/json"],
        produces: ["application/json"],
        info: {
            title: "pass.in",
            description: "Especificação da API para o back-end da aplicação pass.in construida durante o NLW Unite da Rocketseat",
            version: "1.0.0"
        },
    },
    transform: jsonSchemaTransform
});

// Register Swagger UI
app.register(fastifySwaggerUI, {
    routePrefix: "/docs"
});

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

// Get attendee check-in
app.register(checkIn);

// Get event attendees
app.register(getEventAttendees);

// Add error handler
app.setErrorHandler(errorHandler);

app.listen({ port: 3000, host: "0.0.0.0" }).then(() => {
    console.log("Server is running on port 3000");
});