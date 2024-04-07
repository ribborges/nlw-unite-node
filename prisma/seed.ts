import prisma from "../src/lib/prisma";

async function seed() {
    await prisma.event.create({
        data: {
            id: "b9083c55-437e-41ea-8ed8-6822c2ccf0a7",
            title: "Unite Summit",
            slug: "unite-summit",
            details: "Um evento para devs apaixonades por código!",
            maxAttendees: 120
        }
    });
}

seed().then(() => {
    console.log("Database seeded successfully");
    prisma.$disconnect();
});