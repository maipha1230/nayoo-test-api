import { User } from './../user/entities/user.entity';
import { MailService } from './../mail/mail.service';
import { UserService } from './../user/user.service';
import { CreateUserDto } from './../user/dto/create-user.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private jwtService: JwtService,
  ) {}
  async signUp(createUser: CreateUserDto) {
    try {
      let existEmail = await this.userService.findByEmailAndVerify(
        createUser.email,
        true,
      );

      if (existEmail) {
        throw new HttpException(
          'อีเมลนี้ถูกใช้งานแล้ว',
          HttpStatus.BAD_REQUEST,
        );
      }

      const saltOrRounds = 10;
      const password = createUser.password;
      const hash = await bcrypt.hash(password, saltOrRounds);
      createUser.password = hash;

      let create = await this.userService.createUser(createUser);
      delete create.password;
      const payload = { user: create };
      let token = await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
        secret: process.env.JWT_SECRET,
      });

      try {
        let url = `${process.env.FRONTEND_URL}/verify?token=${token}`;
        const text = `Welcome to the application. To confirm the email address, click here: ${url}`;
        await this.mailService.postMail({
          from: 'Nayoo-Test',
          subject: 'Verify Email',
          to: create.email,
          text: text,
        });
      } catch (error) {
        console.error(error);
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'ลงทะเบียนสำเร็จกรุณายืนยันอีเมล',
      };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Something Went Wrong',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signIn(signInBody: SignInDto) {
    try {
      let user = await this.userService.findByEmailAndVerify(
        signInBody.email,
        true,
      );

      if (!user) {
        throw new HttpException(
          'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
          HttpStatus.BAD_REQUEST,
        );
      }

      const isMatch = await bcrypt.compare(signInBody.password, user.password);
      if (!isMatch) {
        throw new HttpException(
          'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
          HttpStatus.BAD_REQUEST,
        );
      }

      delete user.password;
      const payload = { user: user };
      return {
        statusCode: HttpStatus.OK,
        message: 'เข้าสู่ระบบสำเร็จ',
        data: {
          accessToken: await this.jwtService.signAsync(payload, {
            expiresIn: '1h',
            secret: process.env.JWT_SECRET,
          }),
          refreshToken: await this.jwtService.signAsync(payload, {
            expiresIn: '1d',
            secret: process.env.JWT_SECRET,
          }),
        },
      };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Something Went Wrong',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verify(token: string) {
    try {
      let verify = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      if (!verify) {
        throw new HttpException('token ไม่ถูกต้อง', HttpStatus.BAD_REQUEST);
      }

      let decode = await this.jwtService.decode(token)
      let user = decode?.user as User

      user.isVerify = true
      let update = await this.userService.updateUser(user)
      return {
        statusCode: 200,
        message: 'verify success'
      }
    } catch (error) {
      throw new HttpException(
        error?.message || 'Something Went Wrong',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
