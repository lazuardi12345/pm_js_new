// src/Modules/LoanAppExternal/Application/UseCases/SVY_GetClientDetailForSurvey_UseCase.ts
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  ILoanApplicationExternalRepository,
  LOAN_APPLICATION_EXTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/loanApp-external.repository';
import { ClientDetailForSurveyData } from 'src/Shared/Interface/SVY_ClientDetails/ClientDetails.interface';

@Injectable()
export class SVY_GetClientDetailForSurveyPurposeUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationExternalRepository,
  ) {}

  async execute(loan_app_id: number): Promise<ClientDetailForSurveyData> {
    try {
      // Call stored procedure
      const result =
        await this.loanAppRepo.callSP_SVY_GetClientDetailForSurveyPurpose_External(
          loan_app_id,
        );

      console.log('Mi vida, por favor, ven conmigo', result);

      if (!result) {
        throw new NotFoundException(
          'Client detail not found for this loan application',
        );
      }

      const rawCollateral = result[4]?.[0];

      let collateral: Record<string, any> | null = null;

      if (rawCollateral?.collateral_type) {
        const { collateral_type, ...collateralData } = rawCollateral;

        collateral = {
          [collateral_type.toLowerCase()]: collateralData,
        };
      }
      // Map result sets ke interface
      const clientDetail: ClientDetailForSurveyData = {
        client_profile: result[0]?.[0] || null,
        loan_application: result[1]?.[0] || null,
        address_external: result[2]?.[0] || [],
        job_external: result[3]?.[0] || null,
        collateral,
        document_files: result[5]?.[0] || null,
      };

      // Validasi data minimal yang diperlukan
      if (!clientDetail.client_profile || !clientDetail.loan_application) {
        throw new NotFoundException('Incomplete client data');
      }

      console.log(clientDetail);
      return clientDetail;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new Error(
        error.message || 'Failed to get client detail for survey',
      );
    }
  }
}
