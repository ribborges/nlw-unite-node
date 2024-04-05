import z from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import prisma from "../lib/prisma";
import { generateSlug } from "../utils/generate-slug";

export async function createEvent(app: FastifyInstance) {
    // Add a new event
    app.withTypeProvider<ZodTypeProvider>().post("/events", {
        schema: {
            body: z.object({
                title: z.string().min(4),
                details: z.string().nullable(),
                maxAttendees: z.number().int().positive().nullable()
            }),
            response: {
                201: z.object({
                    eventId: z.string().uuid()
                })
            }
        }
    }, async (req, res) => {
        const {
            title,
            details,
            maxAttendees
        } = req.body;

        const slug = generateSlug(title);

        // Check if the slug already exists
        const checkSlug = await prisma.event.findUnique({
            where: {
                slug
            }
        });

        if (checkSlug !== null) {
            throw new Error("An event with this title already exists");
        }

        // Create the event
        const event = await prisma.event.create({
            data: {
                title,
                details,
                maxAttendees,
                slug
            }
        });

        // return { eventId: event.id };
        return res.status(201).send({ eventId: event.id });
    });
}