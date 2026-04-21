// AdCont_CreateLoanAgreement_WithPiutang_UseCase.ts
import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { CreateLoanAgreementDto } from '../DTOS/AdCont_CreateAgrementContractPayload.dto';
import { LoanAgreement } from 'src/Modules/Admin/Contracts/Domain/Entities/loan-agreements.entity';
import {
  ILoanAgreementRepository,
  LOAN_AGREEMENT_REPOSITORY,
} from 'src/Modules/Admin/Contracts/Domain/Repositories/loan-agreements.repository';
import { PayType } from 'src/Shared/Enums/Admins/Account-Receivable/PayType';
import { InstallmentStatus } from 'src/Shared/Enums/Admins/Account-Receivable/InstallmentStatus';
import {
  CLIENT_LOAN_INSTALLMENT_INTERNAL_REPOSITORY,
  IClientLoanInstallmentInternalRepository,
} from 'src/Modules/Admin/Account-Receivable/Domain/Repositories/client_loan_installment_internal.repository';
import {
  CLIENT_INSTALLMENT_FREQUENCY_REPOSITORY,
  IClientInstallmentFrequencyRepository,
} from 'src/Modules/Admin/Account-Receivable/Domain/Repositories/client_loan_installment_frequency.repository';
import {
  CLIENT_LOAN_INSTALLMENT_REPOSITORY,
  IClientLoanInstallmentRepository,
} from 'src/Modules/Admin/Account-Receivable/Domain/Repositories/client_loan_installment.repository';
import { ClientLoanInstallmentInternal } from 'src/Modules/Admin/Account-Receivable/Domain/Entities/client_loan_installment_internal.entity';
import { ClientInstallmentFrequency } from 'src/Modules/Admin/Account-Receivable/Domain/Entities/client_loan_installment_frequency.entity';
import { ClientLoanInstallment } from 'src/Modules/Admin/Account-Receivable/Domain/Entities/client_loan_installment.entity';

@Injectable()
export class AdCont_CreateLoanAgreementUseCase {
  constructor(
    @Inject(LOAN_AGREEMENT_REPOSITORY)
    private readonly loanAgreementRepo: ILoanAgreementRepository,

    @Inject(CLIENT_LOAN_INSTALLMENT_INTERNAL_REPOSITORY)
    private readonly cli_InternalRepo: IClientLoanInstallmentInternalRepository,

    @Inject(CLIENT_INSTALLMENT_FREQUENCY_REPOSITORY)
    private readonly cli_frequencyRepo: IClientInstallmentFrequencyRepository,

    @Inject(CLIENT_LOAN_INSTALLMENT_REPOSITORY)
    private readonly cli_repo: IClientLoanInstallmentRepository,
  ) {}

  async execute(dto: CreateLoanAgreementDto): Promise<{
    contract: LoanAgreement | null;
    account_receivable_created: boolean;
    account_receivable_message: string;
    success: boolean;
    reference: string;
  }> {
    try {
      // ── STEP 1: Cek client sudah ada di piutang by NIK ─────────────────────
      const existingClient = await this.cli_InternalRepo.findByNik(dto.no_ktp);

      if (existingClient) {
        const existingFrequencies = await this.cli_frequencyRepo.findByClientId(
          existingClient.id!,
        );
        const isFrequencyExist = existingFrequencies.some(
          (f) => f.loan_frequency === dto.pinjaman_ke,
        );

        if (isFrequencyExist) {
          throw new ConflictException(
            `Pinjaman ke-${dto.pinjaman_ke} untuk nasabah "${dto.nama}" sudah tercatat.`,
          );
        }
      }

      // ── STEP 2: Create Contract ─────────────────────────────────────────────
      const savedContract = await this.loanAgreementRepo.generateAndSave(dto);

      // ── STEP 3A: Belum ada → create parent + frequency + installments ───────
      if (!existingClient) {
        // Hitung ulang di sini juga agar konsisten
        const totalBiayaLayanan = dto.pokok_pinjaman * 0.003 * dto.tenor;
        const biayaLayananPerBulan = totalBiayaLayanan / dto.tenor;
        const cicilanPerBulan = dto.cicilan + biayaLayananPerBulan;
        const revenueForecast = cicilanPerBulan * dto.tenor + dto.biaya_admin;

        const newClient = await this.cli_InternalRepo.create({
          client_name: dto.nama,
          nik: dto.no_ktp,
          company_name: dto.perusahaan,
          original_loan_principal: dto.pokok_pinjaman,
          revenue_forecast: revenueForecast,
          outstanding_receivable_total: revenueForecast,
        } as ClientLoanInstallmentInternal);

        await this.createFrequencyAndInstallments(
          Number(savedContract.id!),
          newClient.id!,
          dto,
          savedContract.nomor_kontrak,
        );

        return {
          contract: savedContract,
          account_receivable_created: true,
          account_receivable_message: `Client piutang baru berhasil dibuat`,
          success: true,
          reference: 'LOAN_AGREEMENT_CREATED_NEW_CLIENT',
        };
      }

      // ── STEP 3B: Sudah ada → cek collision loan_frequency ──────────────────
      const existingFrequencies = await this.cli_frequencyRepo.findByClientId(
        existingClient.id!,
      );

      const isFrequencyExist = existingFrequencies.some(
        (f) => f.loan_frequency === dto.pinjaman_ke,
      );

      if (isFrequencyExist) {
        throw new ConflictException(
          `Pinjaman ke-${dto.pinjaman_ke} untuk nasabah "${dto.nama}" sudah tercatat di piutang`,
        );
      }

      // Belum ada → create frequency baru + installments
      await this.createFrequencyAndInstallments(
        Number(savedContract.id!),
        existingClient.id!,
        dto,
        savedContract.nomor_kontrak,
      );

      return {
        contract: savedContract,
        account_receivable_created: true,
        account_receivable_message: `Pinjaman ke-${dto.pinjaman_ke} berhasil ditambahkan ke piutang nasabah existing`,
        success: true,
        reference: 'LOAN_AGREEMENT_CREATED_EXISTING_CLIENT',
      };
    } catch (err) {
      if (err instanceof ConflictException) throw err;

      console.error('=== EXECUTE ERROR ===');
      console.error('message:', err.message);
      console.error('stack:', err.stack); // ← TAMBAH INI
      console.error('full err:', err); // ← DAN INI

      return {
        contract: null,
        account_receivable_created: false,
        account_receivable_message: err.message || 'Gagal membuat data piutang',
        success: false,
        reference: 'LOAN_AGREEMENT_CREATED_ERROR',
      };
    }
  }

  // ── Helper: Create frequency + N installment rows sesuai tenor ───────────
  private async createFrequencyAndInstallments(
    loanAgreementId: number,
    clientId: string,
    dto: CreateLoanAgreementDto,
    nomorKontrak: string,
  ): Promise<void> {
    try {
      const applicationDate = this.parseToDate(dto.tanggal_jatuh_tempo as any);

      // ── Hitung derived values sesuai rule domain ────────────────────────
      // BIAYA_LAYANAN = pokok * 0.3% * tenor
      const totalBiayaLayanan = dto.pokok_pinjaman * 0.003 * dto.tenor;
      const biayaLayananPerBulan = totalBiayaLayanan / dto.tenor;

      // CICILAN_PER_BULAN = cicilan_dasar + biayaLayananPerBulan
      // dto.cicilan di sini adalah cicilan_dasar (Pokok + Bunga) / Tenor
      const cicilanPerBulan = dto.cicilan + biayaLayananPerBulan;

      // REVENUE_FORECAST = total yang akan diterima sepanjang tenor
      // = (cicilanPerBulan * tenor) + biaya_admin (hanya sekali di bulan 1)
      const revenueForecast = cicilanPerBulan * dto.tenor + dto.biaya_admin;

      console.log('=== createFrequencyAndInstallments ===');
      console.log('clientId:', clientId);
      console.log('nomorKontrak:', nomorKontrak);
      console.log('applicationDate:', applicationDate);
      console.log('cicilanPerBulan:', cicilanPerBulan);
      console.log('revenueForecast:', revenueForecast);

      const frequency = await this.cli_frequencyRepo.create({
        loan_agreement_id: loanAgreementId,
        loan_frequency: dto.pinjaman_ke,
        application_date: applicationDate,
        loan_amount: dto.pokok_pinjaman,
        loan_tenor: dto.tenor,
        revenue_forecast: revenueForecast,
        outstanding_receivable_total: revenueForecast,
        pay_type: this.resolvePayType(dto.pay_type!),
        client_id: clientId,
      } as ClientInstallmentFrequency);

      console.log('frequency created:', JSON.stringify(frequency));
      console.log('frequency.id:', frequency.id);

      const installmentPromises = Array.from({ length: dto.tenor }, (_, i) => {
        const isFirstMonth = i === 0;

        // Bulan 1: cicilanPerBulan + biaya_admin (admin hanya sekali)
        // Bulan 2+: cicilanPerBulan saja
        const amount_due = isFirstMonth
          ? cicilanPerBulan + dto.biaya_admin
          : cicilanPerBulan;

        const payload = {
          frequency_id: frequency.id,
          frequency_number: i + 1,
          nomor_kontrak: nomorKontrak,
          amount_due,
          status: InstallmentStatus.UNPAID,
          description: this.generateInstallmentDescription(
            i,
            applicationDate,
            dto.type,
          ),
        };

        console.log(`installment[${i}] payload:`, JSON.stringify(payload));
        return this.cli_repo.create(payload as ClientLoanInstallment);
      });

      await Promise.all(installmentPromises);
      console.log('=== semua installment berhasil dibuat ===');
    } catch (err) {
      console.error('createFrequencyAndInstallments ERROR:', err);
      throw new Error(`Gagal membuat frequency/installment: ${err.message}`);
    }
  }

  // ? ── Helper: Map pay_type → PayType enum ──────────────────────────────────
  private resolvePayType(pay_type?: string): PayType {
    const map: Record<string, PayType> = {
      'Potong Gaji': PayType.SALARY_DEDUCTION,
      'Transfer Manual': PayType.MANUAL_TRANSFER,
      EDC: PayType.EDC,
    };
    return map[pay_type ?? ''] ?? PayType.SALARY_DEDUCTION;
  }

  private parseToDate(input: Date | string): Date {
    if (input instanceof Date) return input;

    const str = input.toString().trim();

    // Handle DD-MM-YYYY
    if (/^\d{2}-\d{2}-\d{4}$/.test(str)) {
      const [day, month, year] = str.split('-').map(Number);
      return new Date(year, month - 1, day);
    }

    // Fallback ISO
    return new Date(str);
  }

  private generateInstallmentDescription(
    index: number,
    applicationDate: Date,
    contractType: string,
  ): string {
    const type = contractType?.toLowerCase();
    if (type === 'borongan') {
      return this.generateBoronganDescription(index, applicationDate);
    }
    return this.generateRegularDescription(index, applicationDate);
  }

  // ── BORONGAN: 2x gajian per bulan, japo fixed 27 & 11 ───────────────────
  private generateBoronganDescription(
    index: number,
    applicationDate: Date,
  ): string {
    const MONTH_NAMES = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];

    const startDay = applicationDate.getDate();
    const startMonth = applicationDate.getMonth();
    const startYear = applicationDate.getFullYear();

    const monthOffset = Math.floor(index / 2);
    const isSecondHalf = index % 2 === 1;

    if (startDay === 27) {
      if (!isSecondHalf) {
        const fromMonth = (startMonth + monthOffset) % 12;
        const fromYear =
          startYear + Math.floor((startMonth + monthOffset) / 12);
        const toMonth = (startMonth + monthOffset + 1) % 12;
        const toYear =
          startYear + Math.floor((startMonth + monthOffset + 1) / 12);
        return `27-${MONTH_NAMES[fromMonth]}-${fromYear} - 10-${MONTH_NAMES[toMonth]}-${toYear}`;
      } else {
        const month = (startMonth + monthOffset + 1) % 12;
        const year =
          startYear + Math.floor((startMonth + monthOffset + 1) / 12);
        return `11-${MONTH_NAMES[month]}-${year} - 26-${MONTH_NAMES[month]}-${year}`;
      }
    } else {
      // startDay === 11
      if (!isSecondHalf) {
        const month = (startMonth + monthOffset) % 12;
        const year = startYear + Math.floor((startMonth + monthOffset) / 12);
        return `11-${MONTH_NAMES[month]}-${year} - 26-${MONTH_NAMES[month]}-${year}`;
      } else {
        const fromMonth = (startMonth + monthOffset) % 12;
        const fromYear =
          startYear + Math.floor((startMonth + monthOffset) / 12);
        const toMonth = (startMonth + monthOffset + 1) % 12;
        const toYear =
          startYear + Math.floor((startMonth + monthOffset + 1) / 12);
        return `27-${MONTH_NAMES[fromMonth]}-${fromYear} - 10-${MONTH_NAMES[toMonth]}-${toYear}`;
      }
    }
  }

  // ── REGULAR: japo per bulan, sadar bulan pendek ──────────────────────────
  private generateRegularDescription(
    index: number,
    applicationDate: Date,
  ): string {
    const MONTH_NAMES = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];

    const targetDay = applicationDate.getDate();
    const baseMonth = applicationDate.getMonth() + index;
    const year = applicationDate.getFullYear() + Math.floor(baseMonth / 12);
    const month = baseMonth % 12;
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const actualDay = Math.min(targetDay, lastDayOfMonth);

    return `${String(actualDay).padStart(2, '0')}-${MONTH_NAMES[month]}-${year}`;
  }
}
