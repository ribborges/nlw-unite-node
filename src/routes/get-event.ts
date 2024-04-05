import z from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import prisma from "../lib/prisma";

export async function getEvent(app: FastifyInstance) {
    // Get an event
    app.withTypeProvider<ZodTypeProvider>().get("/events/:eventId", {
        schema: {
            params: z.object({
                eventId: z.string().uuid()
            }),
            response: {
                200: {
                    event: z.object({
                        id: z.string().uuid(),
                        title: z.string(),
                        details: z.string().nullable(),
                        slug: z.string(),
                        maxAttendees: z.number().int().nullable(),
                        attendeesAmount: z.number()
                    })
                }
            }
        }
    }, async (req, res) => {
        const { eventId } = req.params;

        const event = await prisma.event.findUnique({
            select: {
                id: true,
                title: true,
                details: true,
                slug: true,
                maxAttendees: true,
                _count: {
                    select: {
                        attendees: true
                    }
                }
            },
            where: {
                id: eventId
            }
        });

        // Check if the event exists
        if (event === null) {
            throw new Error("Event not found");
        }

        return res.status(200).send({
            event: {
                id: event.id,
                title: event.title,
                details: event.details,
                slug: event.slug,
                maxAttendees: event.maxAttendees,
                attendeesAmount: event._count.attendees
            }
        });
    });
}