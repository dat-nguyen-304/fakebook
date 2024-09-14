import { Injectable, Logger } from '@nestjs/common';
import { CompressionTypes, Kafka, logLevel, Partitioners, Producer } from 'kafkajs';

@Injectable()
export class KafkaService {
  private readonly logger = new Logger(KafkaService.name);
  private kafka: Kafka;
  private producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'api-gateway',
      brokers: ['localhost:9092', 'localhost:9093']
    });
    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner
    });
  }

  async onModuleInit() {
    await this.connect();
  }

  async connect() {
    await this.producer.connect();
    this.logger.log('Connected to Kafka');
  }

  async sendImageUploadMessage({ file, userId, type }) {
    try {
      await this.producer.send({
        topic: 'image-upload',
        messages: [{ value: JSON.stringify({ file, userId, type }) }],
        compression: CompressionTypes.GZIP,
        acks: 1
      });
      this.logger.log('Message sent to Kafka');
    } catch (error) {
      this.logger.error('Failed to send message', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }
}
