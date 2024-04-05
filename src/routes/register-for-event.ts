import z from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import prisma from "../lib/prisma";

export async function registerForEvent(app: FastifyInstance) {
    // Register for an event
    app.withTypeProvider<ZodTypeProvider>().post("/events/:eventId/attendees", {
        schema: {
            body: z.object({
                name: z.string().min(4),
                email: z.string().email()
            }),
            params: z.object({
                eventId: z.string().uuid()
            }),
            response: {
                201: z.object({
                    attendeeId: z.number()
                })
            }
        }
    }, async (req, res) => {
        const { eventId } = req.params;
        const { name, email } = req.body;

        const attendeeFromEmail = await prisma.attendee.findUnique({
            where: {
                eventId_email: {
                    email,
                    eventId
                }
            }
        });

        const [ event, amountOfAttendees ] = await Promise.all([
            prisma.event.findUnique({
                where: {
                    id: eventId
                }
            }),
            prisma.attendee.count({
                where: {
                    eventId
                }
            })
        ]);

        // Check if the attendee has already registered for the event
        if (attendeeFromEmail !== null) {
            throw new Error("This attendee have already registered for this event");
        }

        // Check if the event is already full
        if (event?.maxAttendees && amountOfAttendees >= event?.maxAttendees) {
            throw new Error("This event is already full");
        }

        const attendee = await prisma.attendee.create({
            data: {
                name,
                email,
                eventId
            }
        });

        return res.status(201).send({ attendeeId: attendee.id });
    });
}