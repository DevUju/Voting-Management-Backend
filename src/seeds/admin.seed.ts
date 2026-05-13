import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.create(AppModule);
  
  try {
    const usersRepository = app.get('UserRepository') as Repository<User>;

    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';
    const adminName = 'Admin User';
    const adminState = 'Lagos';

    const existingAdmin = await usersRepository.findOne({ where: { email: adminEmail } });

    if (existingAdmin) {
    } else {

      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const admin = usersRepository.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        state: adminState,
        role: 'admin',
      });

      await usersRepository.save(admin);
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await app.close();
  }
}

seed().catch((error) => {
  console.error('❌ Seed script failed:', error);
  process.exit(1);
});
