// Application/Services/client-loan-installment-internal.service.ts

import { Injectable, Inject } from '@nestjs/common';

import { ClientLoanInstallmentInternal } from '../../Domain/Entities/client_loan_installment_internal.entity';
import { CreateClientLoanInstallmentInternalDto } from '../DTOs/client_loan_installment_internal/create_client_loan_installment_internal.dto';
import { UpdateClientLoanInstallmentInternalDto } from '../DTOs/client_loan_installment_internal/update_client_loan_installment_internal.dto';
import {
  CLIENT_LOAN_INSTALLMENT_INTERNAL_REPOSITORY,
  IClientLoanInstallmentInternalRepository,
} from '../../Domain/Repositories/client_loan_installment_internal.repository';

@Injectable()
export class ClientLoanInstallmentInternalService {
  constructor(
    @Inject(CLIENT_LOAN_INSTALLMENT_INTERNAL_REPOSITORY)
    private readonly clientLoanInstallmentInternalRepository: IClientLoanInstallmentInternalRepository,
  ) {}

  async create(
    dto: CreateClientLoanInstallmentInternalDto,
  ): Promise<ClientLoanInstallmentInternal> {
    const now = new Date();
    const entity = new ClientLoanInstallmentInternal(
      dto.client_name,
      dto.nik,
      dto.company_name,
      dto.original_loan_principal,
      dto.revenue_forecast,
      dto.outstanding_receivable_total,
      undefined, // id
      now, // created_at
      now, // updated_at
      null, // deleted_at
    );
    return this.clientLoanInstallmentInternalRepository.create(entity);
  }

  async update(
    id: string,
    dto: UpdateClientLoanInstallmentInternalDto,
  ): Promise<ClientLoanInstallmentInternal> {
    return this.clientLoanInstallmentInternalRepository.update(id, dto);
  }

  async findAll(): Promise<ClientLoanInstallmentInternal[]> {
    return this.clientLoanInstallmentInternalRepository.findAll();
  }

  async findById(id: string): Promise<ClientLoanInstallmentInternal | null> {
    return this.clientLoanInstallmentInternalRepository.findById(id);
  }

  async delete(id: string): Promise<void> {
    return this.clientLoanInstallmentInternalRepository.delete(id);
  }
}
