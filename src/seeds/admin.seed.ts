import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.create(AppModule);
  
  try {
    const usersRepository = app.get('UserRepository') as Repository<User>;

    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';
    const adminName = 'Admin User';
    const adminState = 'Lagos';

    // Check if admin already exists
    const existingAdmin = await usersRepository.findOne({ where: { email: adminEmail } });

    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists:', adminEmail);
      console.log('   Email:', existingAdmin.email);
      console.log('   Role:', existingAdmin.role);
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const admin = usersRepository.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        state: adminState,
        role: 'admin',
      });

      await usersRepository.save(admin);
      console.log('✅ Admin user created successfully!');
      console.log('   Email:', adminEmail);
      console.log('   Password:', adminPassword);
      console.log('   Name:', adminName);
      console.log('   State:', adminState);
      console.log('   Role:', 'admin');
      console.log('\n📝 Use these credentials to login at http://localhost:4200/login');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await app.close();
  }
}

seed().catch((error) => {
  console.error('❌ Seed script failed:', error);
  process.exit(1);
});
