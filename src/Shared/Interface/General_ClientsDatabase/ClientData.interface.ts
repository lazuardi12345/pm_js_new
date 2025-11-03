export interface General_ClientDataInterface {
  id: number; // ID Nasabah
  nama_lengkap: string; // Nama lengkap
  no_ktp: string; // Nomor KTP
  jenis_kelamin: string; // Jenis kelamin
  tempat_lahir: string; // Tempat lahir
  tanggal_lahir: string; // Tanggal lahir
  enable_edit: boolean; // Status apakah nasabah bisa diedit
  points: number; // Points
  marketing_id: number; // ID marketing
  client_created_at: string; // Waktu dibuat
  client_updated_at: string; // Waktu di-update
}
