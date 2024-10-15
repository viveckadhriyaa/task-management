import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Sign up a new user' }) // Brief description of the operation
  @ApiResponse({ status: 201, description: 'User successfully signed up.' }) // Response description for successful signup
  @ApiResponse({ status: 400, description: 'Bad request. Validation failed.' }) // Error response for bad requests
  @ApiResponse({ status: 409, description: 'Conflict. Email already taken.' }) // Error response for conflicts
  async signUP(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  @ApiOperation({ summary: 'Sign in a user' }) // Brief description of the operation
  @ApiResponse({ status: 200, description: 'User successfully signed in. Returns an access token.' }) // Response for successful sign in
  @ApiResponse({ status: 401, description: 'Unauthorized. Invalid credentials.' }) // Error response for unauthorized access
  async signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }
}
