import { CreateUserDto } from './../user/dto/create-user.dto';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { verifyDto } from './dto/verify-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() body: SignInDto) {
    return await this.authService.signIn(body)
  }

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  async signUp(@Body() body: CreateUserDto) {
    return await this.authService.signUp(body)
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify(@Body() body: verifyDto) {
    return await this.authService.verify(body.token)
  }
}
