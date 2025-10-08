import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from "@nestjs/common";
import { ClientExternalService } from "../../Application/Services/client-external.service";
import { CreateClientExternalDto } from "../../Application/DTOS/dto-ClientExternal/create-client-external.dto";
import { UpdateClientExternalDto } from "../../Application/DTOS/dto-ClientExternal/update-client-external.dto";

import { RolesGuard } from "src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard";
import { JwtAuthGuard } from "src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard";
import { Public } from "src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('client-external')
export class ClientExternalController {
    constructor(private readonly clientExternal: ClientExternalService) {

    }
}