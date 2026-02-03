import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL environment variable is not defined");
}

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
	adapter,
});

async function main() {
	await prisma.user.createMany({
		data: [
			{ id: crypto.randomUUID(), email: "alice@example.com", name: "Alice" },
			{ id: crypto.randomUUID(), email: "bob@example.com", name: "Bob" },
			{
				id: crypto.randomUUID(),
				email: "charlie@example.com",
				name: "Charlie",
			},
			{ id: crypto.randomUUID(), email: "diana@example.com", name: "Diana" },
			{ id: crypto.randomUUID(), email: "eve@example.com", name: "Eve" },
			{ id: crypto.randomUUID(), email: "frank@example.com", name: "Frank" },
			{ id: crypto.randomUUID(), email: "grace@example.com", name: "Grace" },
			{ id: crypto.randomUUID(), email: "henry@example.com", name: "Henry" },
			{
				id: crypto.randomUUID(),
				email: "isabella@example.com",
				name: "Isabella",
			},
			{ id: crypto.randomUUID(), email: "jack@example.com", name: "Jack" },
		],
		skipDuplicates: true,
	});

	console.log("Seed data inserted!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
