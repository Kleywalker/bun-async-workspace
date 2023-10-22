import { describe, expect, it } from 'bun:test';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import winston from 'winston';
import { MongoDBTransport } from '.';

describe('MongoDBTransport', () => {
  it('logs service', async () => {
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    const transport = new MongoDBTransport({
      service: 'MongoDBTransportService',
      level: 'debug',
      format: winston.format.colorize(),
      url: uri,
    });

    const client = new MongoClient(uri);
    await client.connect();
    await transport.connect();
    const db = client.db('');
    console.log('a');
    await db.dropDatabase();

    console.log('b');
    await db.collection('log').insertOne({});
    console.log('c');
    await transport.logEntity('service', new Date(), 'debug', 'message');
    const logs = await db.collection('log').find({}).toArray();

    expect(logs.length).toBe(1);
    await transport.disconnect();

    await client.close();
    await mongoServer.stop();
  });
});
