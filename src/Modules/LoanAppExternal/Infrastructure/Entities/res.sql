BEGIN
    DECLARE v_offset INT DEFAULT 0;
    SET collation_connection = utf8mb4_0900_ai_ci;
    SET NAMES utf8mb4;
    
    -- Set default values
    SET p_page = COALESCE(NULLIF(p_page, ''), 1);
    SET p_pageSize = COALESCE(NULLIF(p_pageSize, ''), 10);
    SET v_offset = (p_page - 1) * p_pageSize;

    -- ========================================
    -- REQUEST SECTION
    -- ========================================
    IF p_type = 'Request' THEN
        
        -- HEAD MARKETING - Request
        IF p_role = 'head_marketing' THEN
            WITH filtered_clients AS (
                SELECT DISTINCT
                    c.id,
                    c.nama_lengkap,
                    c.nik,
                    c.marketing_id
                FROM client_external c
                LEFT JOIN client_external_profile cp ON c.id = cp.nasabah_id
                WHERE (
                    p_keyword IS NULL 
                    OR p_keyword = '' 
                    OR MATCH(c.nama_lengkap) AGAINST (CONCAT('+', p_keyword, '*') IN BOOLEAN MODE)
                    OR cp.no_hp LIKE CONCAT('%', p_keyword, '%')
                )
            ),
            filtered_loans AS (
                SELECT 
                    l.id,
                    l.nasabah_id,
                    l.nominal_pinjaman,
                    l.status_pengajuan,
                    l.pinjaman_ke,
                    l.tenor,
                    l.created_at,
                    l.jenis_pembiayaan
                FROM loan_application_external l
                WHERE l.status_pengajuan IN ('approved ca', 'rejected ca', 'approved banding ca', 'rejected banding ca')
                  AND (p_jenis_pembiayaan IS NULL OR l.jenis_pembiayaan = p_jenis_pembiayaan)
            ),
            final_data AS (
                SELECT 
                    fl.id AS loan_id,
                    fc.nama_lengkap AS nama_nasabah,
                    fl.nominal_pinjaman,
                    fl.status_pengajuan AS loan_app_status,
                    m.nama AS marketing_nama,
                    u.nama AS supervisor_nama,
                    fl.pinjaman_ke AS loan_sequence,
                    fl.tenor,
                    fl.jenis_pembiayaan,
                    fl.created_at
                FROM filtered_clients fc
                INNER JOIN filtered_loans fl ON fc.id = fl.nasabah_id
                LEFT JOIN users m ON fc.marketing_id = m.id
                LEFT JOIN approval_external ai ON fl.id = ai.pengajuan_id AND ai.role = 'supervisor'
                LEFT JOIN users u ON ai.user_id = u.id
            )
            -- Result 0: Total Count
            SELECT COUNT(*) AS total FROM final_data;
            
            -- Result 1: Paginated Data
            SELECT 
                loan_id,
                nama_nasabah,
                nominal_pinjaman,
                loan_app_status,
                marketing_nama,
                supervisor_nama,
                loan_sequence,
                tenor,
                jenis_pembiayaan,
                created_at
            FROM final_data
            ORDER BY created_at DESC
            LIMIT p_pageSize OFFSET v_offset;

        -- CREDIT ANALYST - Request
        ELSEIF p_role = 'credit_analyst' THEN
            WITH filtered_clients AS (
                SELECT DISTINCT
                    c.id,
                    c.nama_lengkap,
                    c.nik,
                    c.marketing_id
                FROM client_external c
                LEFT JOIN client_external_profile cp ON c.id = cp.nasabah_id
                WHERE (
                    p_keyword IS NULL 
                    OR p_keyword = '' 
                    OR MATCH(c.nama_lengkap) AGAINST (CONCAT('+', p_keyword, '*') IN BOOLEAN MODE)
                    OR cp.no_hp LIKE CONCAT('%', p_keyword, '%')
                )
            ),
            filtered_loans AS (
                SELECT 
                    l.id,
                    l.nasabah_id,
                    l.nominal_pinjaman,
                    l.status_pengajuan,
                    l.created_at,
                    l.jenis_pembiayaan
                FROM loan_application_external l
                WHERE l.status_pengajuan IN ('approved spv', 'banding')
                  AND (p_jenis_pembiayaan IS NULL OR l.jenis_pembiayaan = p_jenis_pembiayaan)
            ),
            final_data AS (
                SELECT 
                    fl.id AS loan_id,
                    fc.nama_lengkap AS nama_nasabah,
                    fl.nominal_pinjaman,
                    fl.status_pengajuan AS loan_app_status,
                    m.nama AS marketing_nama,
                    u.nama AS supervisor_nama,
                    fl.jenis_pembiayaan,
                    fl.created_at
                FROM filtered_clients fc
                INNER JOIN filtered_loans fl ON fc.id = fl.nasabah_id
                LEFT JOIN users m ON fc.marketing_id = m.id
                LEFT JOIN approval_external ai ON fl.id = ai.pengajuan_id AND ai.role = 'supervisor'
                LEFT JOIN users u ON ai.user_id = u.id
            )
            -- Result 0: Total Count
            SELECT COUNT(*) AS total FROM final_data;
            
            -- Result 1: Paginated Data
            SELECT 
                loan_id,
                nama_nasabah,
                nominal_pinjaman,
                loan_app_status,
                marketing_nama,
                supervisor_nama,
                NULL AS loan_sequence,
                NULL AS tenor,
                jenis_pembiayaan,
                created_at
            FROM final_data
            ORDER BY created_at DESC
            LIMIT p_pageSize OFFSET v_offset;

        -- SUPERVISOR - Request
        ELSEIF p_role = 'supervisor' THEN
            WITH filtered_clients AS (
                SELECT DISTINCT
                    c.id,
                    c.nama_lengkap,
                    c.nik,
                    c.marketing_id
                FROM client_external c
                LEFT JOIN client_external_profile cp ON c.id = cp.nasabah_id
                WHERE (
                    p_keyword IS NULL 
                    OR p_keyword = '' 
                    OR MATCH(c.nama_lengkap) AGAINST (CONCAT('+', p_keyword, '*') IN BOOLEAN MODE)
                    OR cp.no_hp LIKE CONCAT('%', p_keyword, '%')
                )
            ),
            filtered_loans AS (
                SELECT 
                    l.id,
                    l.nasabah_id,
                    l.nominal_pinjaman,
                    l.status_pengajuan,
                    l.created_at,
                    l.jenis_pembiayaan
                FROM loan_application_external l
                WHERE l.status_pengajuan = 'pending'
                  AND (p_jenis_pembiayaan IS NULL OR l.jenis_pembiayaan = p_jenis_pembiayaan)
            ),
            final_data AS (
                SELECT 
                    fl.id AS loan_id,
                    fc.nama_lengkap AS nama_nasabah,
                    fl.nominal_pinjaman,
                    fl.status_pengajuan AS loan_app_status,
                    m.nama AS marketing_nama,
                    fl.jenis_pembiayaan,
                    fl.created_at
                FROM filtered_clients fc
                INNER JOIN filtered_loans fl ON fc.id = fl.nasabah_id
                LEFT JOIN users m ON fc.marketing_id = m.id
            )
            -- Result 0: Total Count
            SELECT COUNT(*) AS total FROM final_data;
            
            -- Result 1: Paginated Data
            SELECT 
                loan_id,
                nama_nasabah,
                nominal_pinjaman,
                loan_app_status,
                marketing_nama,
                jenis_pembiayaan,
                created_at
            FROM final_data
            ORDER BY created_at DESC
            LIMIT p_pageSize OFFSET v_offset;
        END IF;

    -- ========================================
    -- HISTORY SECTION
    -- ========================================
    ELSEIF p_type = 'History' THEN
        
        -- MARKETING - History
        IF p_role = 'marketing' THEN
            WITH filtered_data AS (
                SELECT 
                    c.id AS client_id,
                    c.nama_lengkap,
                    l.id AS loan_id,
                    l.nominal_pinjaman,
                    l.tenor,
                    l.status_pengajuan,
                    l.jenis_pembiayaan,
                    l.created_at,
                    ai.id AS approval_id,
                    ai.status AS approval_status
                FROM client_external c
                LEFT JOIN client_external_profile cp ON c.id = cp.nasabah_id
                INNER JOIN loan_application_external l ON c.id = l.nasabah_id
                LEFT JOIN approval_external ai ON l.id = ai.pengajuan_id AND ai.role = 'supervisor'
                WHERE (
                    p_keyword IS NULL 
                    OR p_keyword = '' 
                    OR MATCH(c.nama_lengkap) AGAINST (CONCAT('+', p_keyword, '*') IN BOOLEAN MODE)
                    OR cp.no_hp LIKE CONCAT('%', p_keyword, '%')
                )
                AND (p_jenis_pembiayaan IS NULL OR l.jenis_pembiayaan = p_jenis_pembiayaan)
                AND (
                    (ai.id IS NOT NULL AND ai.status IN ('approved', 'rejected'))
                    OR (ai.id IS NULL AND l.status_pengajuan = 'pending')
                )
            ),
            deduplicated AS (
                SELECT 
                    client_id,
                    loan_id,
                    nama_lengkap,
                    nominal_pinjaman,
                    tenor,
                    status_pengajuan,
                    jenis_pembiayaan,
                    created_at,
                    ROW_NUMBER() OVER (PARTITION BY loan_id ORDER BY created_at DESC) AS rn
                FROM filtered_data
            )
            -- Result 0: Total Count
            SELECT COUNT(*) AS total FROM deduplicated WHERE rn = 1;

            -- Result 1: Paginated Data
            SELECT 
                client_id AS clientId,
                loan_id AS loanAppId,
                nominal_pinjaman,
                tenor,
                nama_lengkap,
                status_pengajuan,
                jenis_pembiayaan,
                created_at
            FROM deduplicated
            WHERE rn = 1
            ORDER BY created_at DESC
            LIMIT p_pageSize OFFSET v_offset;

        -- SUPERVISOR - History
        ELSEIF p_role = 'supervisor' THEN
            WITH filtered_data AS (
                SELECT 
                    c.id AS id_nasabah,
                    c.nama_lengkap AS nama_nasabah,
                    l.id AS id_pengajuan,
                    l.nominal_pinjaman,
                    l.status_pengajuan AS loan_status,
                    l.jenis_pembiayaan,
                    ai.created_at AS approve_response_date,
                    ai.status AS approval_status,
                    ai.is_banding AS is_appeal,
                    m.id AS id_marketing,
                    m.nama AS marketing_nama
                FROM client_external c
                LEFT JOIN client_external_profile cp ON c.id = cp.nasabah_id
                INNER JOIN loan_application_external l ON c.id = l.nasabah_id
                INNER JOIN approval_external ai ON l.id = ai.pengajuan_id 
                    AND ai.role = 'supervisor' 
                    AND ai.status IN ('approved', 'rejected')
                LEFT JOIN users m ON c.marketing_id = m.id
                WHERE (
                    p_keyword IS NULL 
                    OR p_keyword = '' 
                    OR MATCH(c.nama_lengkap) AGAINST (CONCAT('+', p_keyword, '*') IN BOOLEAN MODE)
                    OR cp.no_hp LIKE CONCAT('%', p_keyword, '%')
                )
                AND (p_jenis_pembiayaan IS NULL OR l.jenis_pembiayaan = p_jenis_pembiayaan)
            ),
            ranked_data AS (
                SELECT 
                    *,
                    ROW_NUMBER() OVER (
                        PARTITION BY id_pengajuan 
                        ORDER BY approve_response_date DESC, is_appeal DESC
                    ) AS rn
                FROM filtered_data
            )
            -- Result 0: Total Count
            SELECT COUNT(*) AS total FROM ranked_data WHERE rn = 1;

            -- Result 1: Paginated Data
            SELECT 
                id_pengajuan,
                id_nasabah,
                nama_nasabah,
                nominal_pinjaman,
                id_marketing,
                marketing_nama,
                loan_status,
                approval_status,
                is_appeal,
                jenis_pembiayaan,
                approve_response_date
            FROM ranked_data
            WHERE rn = 1
            ORDER BY approve_response_date DESC
            LIMIT p_pageSize OFFSET v_offset;
            
        -- CREDIT ANALYST - History
        ELSEIF p_role = 'credit_analyst' THEN
            WITH filtered_data AS (
                SELECT 
                    c.id AS id_nasabah,
                    c.nama_lengkap AS nama_nasabah,
                    l.id AS id_pengajuan,
                    l.nominal_pinjaman,
                    l.status_pengajuan AS loan_app_status,
                    l.jenis_pembiayaan,
                    ai.created_at AS approve_response_date,
                    ai.status AS approval_status,
                    ai.is_banding AS is_it_appeal,
                    ai.tenor_persetujuan AS approval_tenor,
                    ai.nominal_persetujuan AS approval_amount,
                    m.id AS id_marketing,
                    m.nama AS marketing_nama,
                    s.nama AS nama_supervisor
                FROM client_external c
                LEFT JOIN client_external_profile cp ON c.id = cp.nasabah_id
                INNER JOIN loan_application_external l ON c.id = l.nasabah_id
                INNER JOIN approval_external ai ON l.id = ai.pengajuan_id 
                    AND ai.role = 'credit_analyst' 
                    AND ai.status IN ('approved', 'rejected')
                LEFT JOIN users m ON c.marketing_id = m.id
                LEFT JOIN users s ON m.spv_id = s.id
                WHERE (
                    p_keyword IS NULL 
                    OR p_keyword = '' 
                    OR MATCH(c.nama_lengkap) AGAINST (CONCAT('+', p_keyword, '*') IN BOOLEAN MODE)
                    OR cp.no_hp LIKE CONCAT('%', p_keyword, '%')
                )
                AND (p_jenis_pembiayaan IS NULL OR l.jenis_pembiayaan = p_jenis_pembiayaan)
            ),
            ranked_data AS (
                SELECT 
                    *,
                    ROW_NUMBER() OVER (
                        PARTITION BY id_pengajuan 
                        ORDER BY approve_response_date DESC, is_it_appeal DESC
                    ) AS rn
                FROM filtered_data
            )
            -- Result 0: Total Count
            SELECT COUNT(*) AS total FROM ranked_data WHERE rn = 1;
            
            -- Result 1: Paginated Data
            SELECT 
                nama_nasabah,
                id_pengajuan,
                id_nasabah,
                nominal_pinjaman,
                id_marketing,
                marketing_nama,
                nama_supervisor,
                approve_response_date,
                approval_status,
                loan_app_status,
                is_it_appeal,
                jenis_pembiayaan
            FROM ranked_data
            WHERE rn = 1
            ORDER BY approve_response_date DESC
            LIMIT p_pageSize OFFSET v_offset;

        -- HEAD MARKETING - History
        ELSEIF p_role = 'head_marketing' THEN
            -- Result 0: Total Count
            SELECT COUNT(DISTINCT l.id) AS total
            FROM client_external c
            LEFT JOIN client_external_profile cp ON c.id = cp.nasabah_id
            INNER JOIN loan_application_external l ON c.id = l.nasabah_id
            INNER JOIN approval_external ai ON l.id = ai.pengajuan_id 
                AND ai.role = 'head_marketing' 
                AND ai.status IN ('approved', 'rejected')
            WHERE (
                p_keyword IS NULL 
                OR p_keyword = '' 
                OR MATCH(c.nama_lengkap) AGAINST (CONCAT('+', p_keyword, '*') IN BOOLEAN MODE)
                OR cp.no_hp LIKE CONCAT('%', p_keyword, '%')
            )
            AND (p_jenis_pembiayaan IS NULL OR l.jenis_pembiayaan = p_jenis_pembiayaan);
            
            -- Create temp table for filtered loan IDs
            DROP TEMPORARY TABLE IF EXISTS temp_filtered_loans;
            CREATE TEMPORARY TABLE temp_filtered_loans AS
            SELECT loan_id
            FROM (
                SELECT 
                    l.id AS loan_id,
                    ai.created_at,
                    ROW_NUMBER() OVER (
                        PARTITION BY l.id 
                        ORDER BY ai.created_at DESC, ai.is_banding DESC
                    ) AS rn
                FROM client_external c
                LEFT JOIN client_external_profile cp ON c.id = cp.nasabah_id
                INNER JOIN loan_application_external l ON c.id = l.nasabah_id
                INNER JOIN approval_external ai ON l.id = ai.pengajuan_id 
                    AND ai.role = 'head_marketing' 
                    AND ai.status IN ('approved', 'rejected')
                WHERE (
                    p_keyword IS NULL 
                    OR p_keyword = '' 
                    OR MATCH(c.nama_lengkap) AGAINST (CONCAT('+', p_keyword, '*') IN BOOLEAN MODE)
                    OR cp.no_hp LIKE CONCAT('%', p_keyword, '%')
                )
                AND (p_jenis_pembiayaan IS NULL OR l.jenis_pembiayaan = p_jenis_pembiayaan)
            ) sub
            WHERE rn = 1
            ORDER BY created_at DESC
            LIMIT p_pageSize OFFSET v_offset;
            
            -- Result 1: Loan Data
            SELECT 
                c.nama_lengkap AS nama_nasabah,
                l.id AS loan_id,
                l.nominal_pinjaman,
                l.pinjaman_ke AS loan_sequence,
                l.tenor,
                l.jenis_pembiayaan,
                m.nama AS marketing_nama,
                ai.created_at,
                ai.status AS approval_status,
                l.status_pengajuan AS loan_app_status,
                ai.tenor_persetujuan AS approval_tenor,
                ai.nominal_persetujuan AS approval_amount,
                ai.is_banding
            FROM temp_filtered_loans tfl
            INNER JOIN loan_application_external l ON tfl.loan_id = l.id
            INNER JOIN client_external c ON l.nasabah_id = c.id
            INNER JOIN approval_external ai ON l.id = ai.pengajuan_id 
                AND ai.role = 'head_marketing' 
                AND ai.status IN ('approved', 'rejected')
            LEFT JOIN users m ON c.marketing_id = m.id
            ORDER BY ai.created_at DESC;
            
            -- Result 2: All approvals where is_banding = 0
            SELECT 
                ai.pengajuan_id AS loan_id,
                ai.role,
                u.nama AS user_name,
                ai.status AS response,
                ai.tenor_persetujuan AS approval_tenor,
                ai.nominal_persetujuan AS approval_amount,
                ai.created_at AS responded_at,
                ai.is_banding
            FROM approval_external ai
            LEFT JOIN users u ON ai.user_id = u.id
            WHERE ai.is_banding = 0
              AND ai.pengajuan_id IN (SELECT loan_id FROM temp_filtered_loans)
            ORDER BY ai.pengajuan_id, ai.created_at;
            
            -- Result 3: All approvals where is_banding = 1
            SELECT 
                ai.pengajuan_id AS loan_id,
                ai.role,
                u.nama AS user_name,
                ai.status AS response,
                ai.tenor_persetujuan AS approval_tenor,
                ai.nominal_persetujuan AS approval_amount,
                ai.created_at AS responded_at,
                ai.is_banding
            FROM approval_external ai
            LEFT JOIN users u ON ai.user_id = u.id
            WHERE ai.is_banding = 1
              AND ai.pengajuan_id IN (SELECT loan_id FROM temp_filtered_loans)
            ORDER BY ai.pengajuan_id, ai.created_at;
            
            -- Cleanup
            DROP TEMPORARY TABLE IF EXISTS temp_filtered_loans;
        END IF;
    END IF;
END