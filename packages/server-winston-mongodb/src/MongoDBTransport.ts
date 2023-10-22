import { getModelForClass } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { LogEntity } from './Log.entity';

class MongoDBTransport {
  private opts?: object;

  public LogModel?: ReturnType<typeof getModelForClass>;
  public connection?: mongoose.Connection;

  constructor(private options: any) {
    const transportOptions = options;
  }

  public async connect() {
    const url: string = (this.options as any).url!;
    if (!this.connection && url) {
      this.opts = { useUnifiedTopology: false };
      this.connection = await mongoose
        .createConnection(url, this.opts)
        .asPromise();

      this.LogModel = getModelForClass(LogEntity, {
        existingConnection: this.connection,
      });
    }
  }

  public async disconnect() {
    const url: string = (this.options as any).url!;
    await this.connection!.close();
  }

  public async log(
    info: { [x: symbol]: object; level: string; message: string },
    callback: () => void,
  ) {
    const service = (this.options as any).service;
    const level = info.level;
    const message = info.message;
    const splat = info[Symbol.for('splat')] as Array<object>;
    const meta = splat ? (splat.length > 1 ? splat : splat[0]) : undefined;
    const timestamp = new Date();

    await this.logEntity(service, timestamp, level, message, meta);

    callback?.();
  }

  public async logEntity(
    service: string = 'Service',
    timestamp: Date,
    level: string,
    message: string,
    meta?: object,
  ) {
    if (this.connection!.readyState === 1) {
      console.log(1);

      await this.LogModel!.create({
        service,
        timestamp,
        level,
        message,
        meta,
      });
      console.log(2);
    }
  }
}

export { MongoDBTransport };
