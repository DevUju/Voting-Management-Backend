import { Module } from "@nestjs/common";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { User } from "../users/user.entity";
import { AuthController } from "./auth.controller"; // 👈 ADD THIS

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "secret",
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || process.env.JWT_EXPIRATION || "1h",
      },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [JwtAuthGuard, JwtModule, AuthService],
})
export class AuthModule {}
