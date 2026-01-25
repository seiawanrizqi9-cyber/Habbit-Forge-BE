// TIME UTILITY FUNCTIONS FOR HABIT TRACKER
// Meng-handle konversi antara FE (YYYY-MM-DD) dan BE (DateTime)

/**
 * Convert FE date string (YYYY-MM-DD) to Date object (start of day in WIB)
 * @param dateString Format: "2024-01-15"
 * @returns Date object with time set to 00:00:00
 */
export const parseDateFromFE = (dateString: string): Date => {
  // Validasi format dasar
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    throw new Error(`Format tanggal tidak valid: ${dateString}. Gunakan YYYY-MM-DD`);
  }
  
  const parts = dateString.split('-');
  
  // Pastikan ada 3 parts
  if (parts.length !== 3) {
    throw new Error(`Format tanggal tidak valid: ${dateString}`);
  }
  
  const yearStr = parts[0];
  const monthStr = parts[1];
  const dayStr = parts[2];
  
  // Validasi part tidak kosong
  if (!yearStr || !monthStr || !dayStr) {
    throw new Error(`Format tanggal tidak valid: ${dateString}`);
  }
  
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // JavaScript month 0-based
  const day = parseInt(dayStr, 10);
  
  // Validasi angka
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    throw new Error(`Tanggal tidak valid: ${dateString}`);
  }
  
  // Validasi bulan (1-12)
  if (month < 0 || month > 11) {
    throw new Error(`Bulan tidak valid: ${month + 1}`);
  }
  
  // Validasi tanggal (1-31, validasi lebih detail nanti)
  if (day < 1 || day > 31) {
    throw new Error(`Tanggal tidak valid: ${day}`);
  }
  
  // Buat Date object (timezone akan mengikuti server, sudah WIB karena TZ=Asia/Jakarta)
  const date = new Date(year, month, day, 0, 0, 0, 0);
  
  // Validasi kembali (untuk kasus seperti 2024-02-31)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    throw new Error(`Tanggal tidak valid: ${dateString}`);
  }
  
  return date;
};

/**
 * Format Date object to YYYY-MM-DD string for FE
 * @param date Date object
 * @returns String format "2024-01-15"
 */
export const formatDateForFE = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Get today's date in YYYY-MM-DD format
 * @returns Today's date as string "2024-01-15"
 */
export const getTodayDateString = (): string => {
  const today = new Date();
  return formatDateForFE(today);
};

/**
 * Validate if date string is valid YYYY-MM-DD format
 */
export const isValidDateString = (dateString: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;
  
  try {
    parseDateFromFE(dateString);
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if two date strings represent the same day
 */
export const isSameDay = (dateStr1: string, dateStr2: string): boolean => {
  return dateStr1 === dateStr2;
};

/**
 * Get date range for database query (start and end of day)
 */
export const getDateRangeForQuery = (dateString: string): { start: Date; end: Date } => {
  const start = parseDateFromFE(dateString);
  const end = new Date(start);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
};

/**
 * Get today's date range for queries (for backward compatibility)
 */
export const getTodayRange = () => {
  return getDateRangeForQuery(getTodayDateString());
};

/**
 * Get yesterday's date string
 */
export const getYesterdayDateString = (): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  return formatDateForFE(yesterday);
};

/**
 * Get start of day Date object from date string
 */
export const getStartOfDay = (dateString: string): Date => {
  return parseDateFromFE(dateString);
};

/**
 * Get end of day Date object from date string
 */
export const getEndOfDay = (dateString: string): Date => {
  const date = parseDateFromFE(dateString);
  date.setHours(23, 59, 59, 999);
  return date;
};