import { Ticket } from '../ticket.model';

it('implement optimistic concurrency control', async () => {
  // create an instant of a ticket
  const ticket = Ticket.build({
    title: 'new year eve',
    price: 10,
    userId: '123',
  });

  // save to db
  await ticket.save();

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);
  // make 2 seperate changes to the tickets we frtched
  firstInstance!.set({ price: 1000 });
  secondInstance!.set({ price: 2000 });
  // savr the forst fetched ticket
  await firstInstance!.save();

  // save the second fetched ticket and expect an Error
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }
  throw new Error('Should not reach this point ');
});

it('increment the version number on multible saves', async () => {
  // create an instant of a ticket
  const ticket = Ticket.build({
    title: 'new year eve',
    price: 10,
    userId: '123',
  });

  // save to db
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
