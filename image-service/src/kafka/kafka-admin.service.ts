import { Injectable, Logger } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaAdminService {
  private readonly logger = new Logger(KafkaAdminService.name);
  private kafka: Kafka;
  private readonly DEFAULT_NUM_PARTITIONS = 3;
  private readonly DEFAULT_REPLICATION_FACTOR = 2;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'image-service-admin',
      brokers: ['localhost:9092', 'localhost:9093']
    });
  }

  async createTopic(
    topic: string,
    numPartitions: number = this.DEFAULT_NUM_PARTITIONS,
    replicationFactor: number = this.DEFAULT_REPLICATION_FACTOR
  ): Promise<void> {
    const admin = this.kafka.admin();
    await admin.connect();
    try {
      await admin.createTopics({
        topics: [
          {
            topic,
            numPartitions,
            replicationFactor
          }
        ]
      });
      this.logger.log(
        `Topic ${topic} created with ${numPartitions} partitions and replication factor ${replicationFactor}`
      );
    } catch (error) {
      this.logger.error(`Failed to create topic ${topic}`, error);
      throw error;
    } finally {
      await admin.disconnect();
    }
  }

  async topicExists(topic: string): Promise<boolean> {
    const admin = this.kafka.admin();
    await admin.connect();
    try {
      const topics = await admin.listTopics();
      return topics.includes(topic);
    } catch (error) {
      this.logger.error(`Failed to check if topic ${topic} exists`, error);
      throw error;
    } finally {
      await admin.disconnect();
    }
  }
}
