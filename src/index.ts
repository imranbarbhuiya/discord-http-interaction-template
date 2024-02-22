import crypto from 'node:crypto';
import process from 'node:process';
import { InteractionResponseType, InteractionType } from 'discord-api-types/v10';
import { verify } from 'discord-verify';
import Fastify from 'fastify';

const port = Number(process.env.PORT ?? 3_000);
const publicKey = process.env.DISCORD_PUBLIC_KEY!;

const fastify = Fastify({
	logger: true,
});

fastify.get('/', () => ({ message: 'I am alive' }));

fastify.post('/interaction', async (req, res) => {
	const signature = req.headers['x-signature-ed25519'] as string;
	const timestamp = req.headers['x-signature-timestamp'] as string;
	const rawBody = JSON.stringify(req.body);

	const isValid = await verify(rawBody, signature, timestamp, publicKey, crypto.webcrypto.subtle);

	if (!isValid) return res.code(401).send('Bad request signature');

	const { type } = req.body as { data: any; id: string; type: number };

	if (type === InteractionType.Ping) return res.send({ type: InteractionResponseType.Pong });

	await res.send({ message: 'Success' });
});

await fastify.listen({ port });
