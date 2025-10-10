import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // Simulasi DB user
  private users = [
    {
      id: 1,
      email: 'user1@gmail.com',
      password: bcrypt.hashSync('password', 10), // hashed
      roles: ['superadmin'],
    },
    {
      id: 2,
      email: 'admin1@gmail.com',
      password: bcrypt.hashSync('password', 10),
      roles: ['superadmin'],
    },
  ];

  // Register user baru
  async register(dto: { username: string; password: string }) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const newUser = {
      id: this.users.length + 1,
      email: dto.username,
      password: hashed,
      roles: ['user'], // default role user
    };
    this.users.push(newUser);
    return { message: 'User registered successfully', userId: newUser.id };
  }

  // Validate user (dipakai LocalStrategy)
  async validateUser(username: string, password: string) {
    const user = this.users.find((u) => u.email === username);
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    // jangan balikin password
    const { password: _, ...result } = user;
    console.log('result: ', result);
    return result;
  }

  // Login -> bikin JWT
  async login(user: any): Promise<string> {
    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles.map((r) => r.toUpperCase()), // semua role uppercase
      is_active: true,
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET ?? 'superSecretKey',
      expiresIn: '1h',
    });
  }
}
