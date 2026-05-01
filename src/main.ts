import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

async function seedAdminUser(app: any) {
  try {
    const usersRepository = app.get('UserRepository') as Repository<User>;

    const adminEmail = 'admin@example.com';
    const existingAdmin = await usersRepository.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = usersRepository.create({
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        state: 'Lagos',
        role: 'admin',
      });
      await usersRepository.save(admin);
      console.log('✅ Admin user created: admin@example.com / admin123');
    }
  } catch (error) {
    console.log('ℹ️ Admin user already exists or seed skipped');
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Seed admin user
  await seedAdminUser(app);

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.APP_PORT || 3000;
  await app.listen(port);
  console.log(`Poll & Voting Backend running on http://localhost:${port}`);
}

bootstrap();
