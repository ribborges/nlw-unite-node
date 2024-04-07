import z from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import prisma from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function getAttendeeBadge(app: FastifyInstance) {
    // Get attendee badge data
    app.withTypeProvider<ZodTypeProvider>().get("/attendees/:attendeeId/badge", {
        schema: {
            summary: "Get an attendee badge",
            tags: ["attendees"],
            params: z.object({
                attendeeId: z.coerce.number().int()
            }),
            response: {
                200: z.object({
                    badge: z.object({
                        name: z.string(),
                        email: z.string().email(),
                        eventTitle: z.string(),
                        checkInURL: z.string().url()
                    })
                })
            }
        }
    }, async (req, res) => {
        const { attendeeId } = req.params;

        const attendee = await prisma.attendee.findUnique({
            select: {
                name: true,
                email: true,
                event: {
                    select: {
                        title: true
                    }
                }
            },
            where: {
                id: attendeeId
            }
        });

        // Check if the attendee exists
        if (attendee === null) {
            throw new BadRequest("Attendee not found");
        }

        const baseUrl = `${req.protocol}://${req.hostname}`;

        const checkInURL = new URL(`/attendees/${attendeeId}/check-in`, baseUrl);

        return res.status(200).send({
            badge: {
                name: attendee.name,
                email: attendee.email,
                eventTitle: attendee.event.title,
                checkInURL: checkInURL.toString()
            }
        });
    });
}