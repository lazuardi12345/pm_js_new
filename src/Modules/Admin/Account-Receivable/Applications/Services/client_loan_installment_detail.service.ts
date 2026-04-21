// Application/Services/client-loan-installment-detail.service.ts

import { Injectable, Inject } from '@nestjs/common';

import { ClientLoanInstallmentDetail } from '../../Domain/Entities/client_loan_installment_detail.entity';
import { CreateClientLoanInstallmentDetailDto } from '../DTOs/client_loan_installment_detail/create_client_loan_installment_detail.dto';
import { UpdateClientLoanInstallmentDetailDto } from '../DTOs/client_loan_installment_detail/update_client_loan_installment_detail.dto';
import {
  CLIENT_LOAN_INSTALLMENT_DETAIL_REPOSITORY,
  IClientLoanInstallmentDetailRepository,
} from '../../Domain/Repositories/client_loan_installment_detail.repository';

@Injectable()
export class ClientLoanInstallmentDetailService {
  constructor(
    @Inject(CLIENT_LOAN_INSTALLMENT_DETAIL_REPOSITORY)
    private readonly clientLoanInstallmentDetailRepository: IClientLoanInstallmentDetailRepository,
  ) {}

  async create(
    dto: CreateClientLoanInstallmentDetailDto,
  ): Promise<ClientLoanInstallmentDetail> {
    const now = new Date();
    const entity = new ClientLoanInstallmentDetail(
      dto.amount_paid,
      dto.pay_date,
      dto.pay_description,
      undefined, // id
      dto.installment_id, // FK
      now, // created_at
      now, // updated_at
      null, // deleted_at
    );
    return this.clientLoanInstallmentDetailRepository.create(entity);
  }

  async update(
    id: string,
    dto: UpdateClientLoanInstallmentDetailDto,
  ): Promise<ClientLoanInstallmentDetail> {
    return this.clientLoanInstallmentDetailRepository.update(id, dto);
  }

  async findAll(): Promise<ClientLoanInstallmentDetail[]> {
    return this.clientLoanInstallmentDetailRepository.findAll();
  }

  async findById(id: string): Promise<ClientLoanInstallmentDetail | null> {
    return this.clientLoanInstallmentDetailRepository.findById(id);
  }

  async findByInstallmentId(
    installment_id: string,
  ): Promise<ClientLoanInstallmentDetail[]> {
    return this.clientLoanInstallmentDetailRepository.findByInstallmentId(
      installment_id,
    );
  }

  async delete(id: string): Promise<void> {
    return this.clientLoanInstallmentDetailRepository.delete(id);
  }
}
