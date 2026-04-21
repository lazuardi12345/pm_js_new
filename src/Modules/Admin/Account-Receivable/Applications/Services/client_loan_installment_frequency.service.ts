// Application/Services/client-installment-frequency.service.ts

import { Injectable, Inject } from '@nestjs/common';
import { ClientInstallmentFrequency } from '../../Domain/Entities/client_loan_installment_frequency.entity';
import { CreateClientInstallmentFrequencyDto } from '../DTOs/client_loan_installment_frequency/create_client_loan_installment_frequency.entity';
import { UpdateClientInstallmentFrequencyDto } from '../DTOs/client_loan_installment_frequency/update_client_loan_installment_frequency.entity';
import {
  CLIENT_INSTALLMENT_FREQUENCY_REPOSITORY,
  IClientInstallmentFrequencyRepository,
} from '../../Domain/Repositories/client_loan_installment_frequency.repository';

@Injectable()
export class ClientInstallmentFrequencyService {
  constructor(
    @Inject(CLIENT_INSTALLMENT_FREQUENCY_REPOSITORY)
    private readonly clientInstallmentFrequencyRepository: IClientInstallmentFrequencyRepository,
  ) {}

  async create(
    dto: CreateClientInstallmentFrequencyDto,
  ): Promise<ClientInstallmentFrequency> {
    const now = new Date();
    const entity = new ClientInstallmentFrequency(
      dto.loan_frequency,
      dto.application_date,
      dto.loan_amount,
      dto.loan_tenor,
      dto.revenue_forecast,
      dto.outstanding_receivable_total,
      dto.pay_type,
      dto.expected_payout_date,
      undefined, // id
      dto.loan_agreement_id,
      dto.client_id, // FK
      now, // created_at
      now, // updated_at
      null, // deleted_at
    );
    return this.clientInstallmentFrequencyRepository.create(entity);
  }

  async update(
    id: string,
    dto: UpdateClientInstallmentFrequencyDto,
  ): Promise<ClientInstallmentFrequency> {
    return this.clientInstallmentFrequencyRepository.update(id, dto);
  }

  async findAll(): Promise<ClientInstallmentFrequency[]> {
    return this.clientInstallmentFrequencyRepository.findAll();
  }

  async findById(id: string): Promise<ClientInstallmentFrequency | null> {
    return this.clientInstallmentFrequencyRepository.findById(id);
  }

  async findByClientId(
    client_id: string,
  ): Promise<ClientInstallmentFrequency[]> {
    return this.clientInstallmentFrequencyRepository.findByClientId(client_id);
  }

  async delete(id: string): Promise<void> {
    return this.clientInstallmentFrequencyRepository.delete(id);
  }
}
