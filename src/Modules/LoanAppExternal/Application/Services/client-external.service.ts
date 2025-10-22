import { Injectable, Inject } from '@nestjs/common';
import {
  IClientExternalRepository,
  CLIENT_EXTERNAL_REPOSITORY,
} from '../../Domain/Repositories/client-external.repository';
import { ClientExternal } from '../../Domain/Entities/client-external.entity';
import { CreateClientExternalDto } from '../DTOS/dto-ClientExternal/create-client-external.dto';
import { UpdateClientExternalDto } from '../DTOS/dto-ClientExternal/update-client-external.dto';

@Injectable()
export class ClientExternalService {
  constructor(
    @Inject(CLIENT_EXTERNAL_REPOSITORY)
    private readonly repo: IClientExternalRepository,
  ) {}

  async create(dto: CreateClientExternalDto): Promise<ClientExternal> {
    const now = new Date();

   const address = new ClientExternal(
  { id: dto.marketing_id },     
  dto.nama_lengkap,              
  dto.nik,                     
  dto.no_kk,                   
  dto.jenis_kelamin,            
  dto.tempat_lahir,             
  dto.tanggal_lahir, 
  dto.no_rekening,          
  dto.no_hp,                  
  dto.status_nikah!,          
  undefined,                   
  dto.email,                   
  dto.foto_ktp,               
  dto.foto_kk,                
  dto.dokumen_pendukung,       
  dto.validasi_nasabah,        
  dto.catatan,                 
  now,                        
  now,                        
);

    return this.repo.save(address);
  }

  async update(
    id: number,
    dto: UpdateClientExternalDto,
  ): Promise<ClientExternal> {
    return this.repo.update(id, dto);
  }

  async findById(id: number): Promise<ClientExternal | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<ClientExternal[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
