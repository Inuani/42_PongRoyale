import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private connection: Connection) {}

  testConnection(): string {
    const isConnected = this.connection.isConnected;
    return isConnected ? 'Connected to the database!' : 'Not connected to the database!';;
  }
}
