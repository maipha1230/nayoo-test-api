import { User } from './entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmailAndVerify(email: string, isVerify: boolean) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email: email,
          isVerify: isVerify,
        },
      });
      return user;
    } catch (error) {
      console.error(error);

      throw new HttpException(
        error?.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(body: CreateUserDto) {
    try {
      let user = new User();
      user.email = body.email;
      user.nameTh = body.nameTh;
      user.nameEn = body.nameEn;
      user.phone = body.phone;
      user.password = body.password;

      let create = await this.userRepository.save(user);
      return create;
    } catch (error) {
        console.error(error)
      throw new HttpException(
        error?.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(body: User) {
    try {
      let update = this.userRepository.save(body);
      return update;
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: number) {
    try {
      let user = this.userRepository.findOne({
        where: {
            id: id
        }
      });
      return user;
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
