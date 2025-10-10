import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

// === Presentation
import { AuthController } from './Presentation/Controllers/auth.controller';

// === Application (Use Cases)
import { RegisterUseCase } from './Applications/Services/Register.usecase';

// === Infrastructure
import { LocalStrategy } from './Infrastructure/Strategies/local.strategy';
import { JwtStrategy } from './Infrastructure/Strategies/jwt.strategy';
import { JwtAuthGuard } from './Infrastructure/Guards/jwtAuth.guard';
import { RolesGuard } from './Infrastructure/Guards/roles.guard';
import { BcryptService } from './Infrastructure/Services/Bcrypt.service';
import { JwtTokenService } from './Infrastructure/Services/ResponseToken_JWT.service';
import { UserForAuthRepositoryImpl } from './Infrastructure/Repositories/UserForAuth.repository.impl';

// === Domain tokens
import { PASSWORD_HASHER } from './Domain/Service/HashPassword.service';
import { USER_FOR_AUTH_REPOSITORY } from './Domain/Repositories/UserForAuth.repository';
import { TOKEN_SIGN } from './Domain/Service/TokenSign.service';

// === Entities (only needed for Auth repo)
import { Users_ORM_Entity } from 'src/Modules/Users/Infrastructure/Entities/users.orm-entity';
import { UsersModule } from 'src/Modules/Users/ModuleUsers.module';
import { LoginUseCase } from './Applications/Services/Login.usecase';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'superSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([Users_ORM_Entity]), // <== ini wajib biar UserForAuthRepositoryImpl bisa jalan
    UsersModule
  ],
  controllers: [AuthController],
  providers: [
    // Application
    RegisterUseCase,
    LoginUseCase,

    // Strategies
    LocalStrategy,
    JwtStrategy,

    // Domain contracts binding ke infra
    { provide: PASSWORD_HASHER, useClass: BcryptService },
    { provide: TOKEN_SIGN, useClass: JwtTokenService },
    { provide: USER_FOR_AUTH_REPOSITORY, useClass: UserForAuthRepositoryImpl },

    // Global guards
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  exports: [RegisterUseCase, LoginUseCase],
})
export class AuthModule {}
