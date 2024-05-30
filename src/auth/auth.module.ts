import { MailModule } from './../mail/mail.module';
import { UserModule } from './../user/user.module';
import { DatabaseModule } from './../database/database.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    MailModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
