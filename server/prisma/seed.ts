import prisma from '../src/prismaClient';

async function main() {
  const existing = await prisma.user.findFirst();
  if (existing) return console.log('Seed skipped, user already exists');

  const user = await prisma.user.create({ data: { id: '00000000-0000-0000-0000-000000000000', email: 'demo@kingidy.dev', name: 'Demo User' } });
  const chat = await prisma.chat.create({ data: { title: 'Welcome Chat', ownerId: user.id, participants: { connect: [{ id: user.id }] } } });
  await prisma.message.create({ data: { chatId: chat.id, userId: user.id, role: 'SYSTEM', content: 'Welcome to Kingidy chat!', tokens: 1 } });
  console.log('Seed finished');
}

main()
  .catch((e) => console.error(e))
  .finally(() => process.exit(0));
