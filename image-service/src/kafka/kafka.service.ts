import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Kafka, Producer, Consumer, Partitioners } from 'kafkajs';
import { CloudinaryService } from '@cloudinary/cloudinary.service';
import { KafkaAdminService } from '@kafka/kafka-admin.service';
import { ImageService } from '@image/image.service';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor(
    private cloudinaryService: CloudinaryService,
    private readonly kafkaAdminService: KafkaAdminService,
    private readonly imageService: ImageService
  ) {
    this.kafka = new Kafka({
      clientId: 'image-service',
      brokers: ['localhost:9092', 'localhost:9093']
    });
    this.producer = this.kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
    this.consumer = this.kafka.consumer({ groupId: 'image-upload-group' });
  }

  async onModuleInit() {
    await this.checkPartitionStatus('image-upload');
    await this.producer.connect();
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: 'image-upload',
      fromBeginning: true
    });
    this.logger.log('Connected to Kafka');

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const { file, userId, type } = JSON.parse(message.value.toString());
          this.logger.log(`Received message update image for user ${userId}`);
          const imageBuffer = Buffer.from(file, 'base64');
          const result = await this.cloudinaryService.uploadImage(imageBuffer);
          this.logger.log(`Received url ${result.secure_url}`);
          this.imageService.updateUserImage(userId, { type, url: result.secure_url });
        } catch (error) {
          console.error('Error processing message:', error);
        }
      }
    });
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  async sendMessage(topic: string, message: any) {
    try {
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }]
      });
      this.logger.log(`Message sent to topic ${topic}: ${JSON.stringify(message)}`);
    } catch (error) {
      this.logger.error('Error sending message:', error);
    }
  }

  async checkPartitionStatus(topic: string) {
    const topicExists = await this.kafkaAdminService.topicExists(topic);
    if (!topicExists) {
      await this.kafkaAdminService.createTopic(topic);
    } else {
      this.logger.log(`Topic ${topic} is ready`);
    }
  }
}
