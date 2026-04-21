// Application/Services/client-loan-installment.service.ts

import { Injectable, Inject } from '@nestjs/common';
import { ClientLoanInstallment } from '../../Domain/Entities/client_loan_installment.entity';
import { CreateClientLoanInstallmentDto } from '../DTOs/client_loan_installment/create_client_loan_installment.dto';
import { UpdateClientLoanInstallmentDto } from '../DTOs/client_loan_installment/update_client_loan_installment.dto';
import {
  CLIENT_LOAN_INSTALLMENT_REPOSITORY,
  IClientLoanInstallmentRepository,
} from '../../Domain/Repositories/client_loan_installment.repository';

@Injectable()
export class ClientLoanInstallmentService {
  constructor(
    @Inject(CLIENT_LOAN_INSTALLMENT_REPOSITORY)
    private readonly clientLoanInstallmentRepository: IClientLoanInstallmentRepository,
  ) {}

  async create(
    dto: CreateClientLoanInstallmentDto,
  ): Promise<ClientLoanInstallment> {
    const now = new Date();
    const entity = new ClientLoanInstallment(
      dto.frequency_number,
      dto.description,
      dto.nomor_kontrak,
      dto.amount_due,
      dto.status,
      dto.metadata,
      undefined, // id
      dto.frequency_id, // FK
      now, // created_at
      now, // updated_at
      null, // deleted_at
    );
    return this.clientLoanInstallmentRepository.create(entity);
  }

  async update(
    id: string,
    dto: UpdateClientLoanInstallmentDto,
  ): Promise<ClientLoanInstallment> {
    return this.clientLoanInstallmentRepository.update(id, dto);
  }

  async findAll(): Promise<ClientLoanInstallment[]> {
    return this.clientLoanInstallmentRepository.findAll();
  }

  async findById(id: string): Promise<ClientLoanInstallment | null> {
    return this.clientLoanInstallmentRepository.findById(id);
  }

  async findByFrequencyId(
    frequency_id: string,
  ): Promise<ClientLoanInstallment[]> {
    return this.clientLoanInstallmentRepository.findByFrequencyId(frequency_id);
  }

  async delete(id: string): Promise<void> {
    return this.clientLoanInstallmentRepository.delete(id);
  }
}
