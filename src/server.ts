import fastify from "fastify";
import z from "zod";
import { PrismaClient } from "@prisma/client";

const app = fastify();

const prisma = new PrismaClient({
    log: ["query"]
});

app.get("/", () => {
    return "Hi there! 😊";
});

app.post("/events", async (req, res) => {
    const eventSchema = z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maxAttendees: z.number().int().positive().nullable()
    });

    const data = eventSchema.parse(req.body);

    const event = await prisma.event.create({
        data: {
            title: data.title,
            details: data.details,
            maxAttendees: data.maxAttendees,
            slug: data.title.toLowerCase().replace(" ", "-")
        }
    });

    // return { eventId: event.id };
    return res.status(201).send({ eventId: event.id });
});

app.listen({ port: 3000 }).then(() => {
    console.log("Server is running on port 3000");
});