import { User } from './../user/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    TypeOrmModule.forFeature([
        User
      ])
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
