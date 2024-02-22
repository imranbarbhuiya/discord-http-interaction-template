import process from 'node:process';
import Fastify from 'fastify';

const port = Number(process.env.PORT ?? 3_000);

const fastify = Fastify({
	logger: true,
});

fastify.get('/', () => ({ message: 'I am alive' }));

fastify.get('/interaction', async (request, reply) => {
	await reply.send({ message: request.query });
});

await fastify.listen({ port });
