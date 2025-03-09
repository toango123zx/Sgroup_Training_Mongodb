import { Sink } from '../sink';

class LogSink implements Sink {
  async save(data: any): Promise<void> {
  }
}

export {
  LogSink,
};
