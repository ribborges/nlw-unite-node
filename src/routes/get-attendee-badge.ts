import z from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import prisma from "../lib/prisma";

export async function getAttendeeBadge(app: FastifyInstance) {
    // Get attendee badge data
    app.withTypeProvider<ZodTypeProvider>().get("/attendees/:attendeeId/badge", {
        schema: {
            params: z.object({
                attendeeId: z.coerce.number().int()
            }),
            response: {}
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
            throw new Error("Attendee not found");
        }

        return res.status(200).send({ attendee });
    });
}