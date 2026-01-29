export const parseDateToUTC = (dateString: string): Date => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    throw new Error(`Format tanggal tidak valid: ${dateString}`);
  }

  const parts = dateString.split("-");

  if (parts.length !== 3) {
    throw new Error(`Format tanggal tidak valid: ${dateString}`);
  }

  const yearStr = parts[0];
  const monthStr = parts[1];
  const dayStr = parts[2];

  if (!yearStr || !monthStr || !dayStr) {
    throw new Error(`Format tanggal tidak valid: ${dateString}`);
  }

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  // Validasi angka
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    throw new Error(`Tanggal tidak valid: ${dateString}`);
  }

  // Validasi
  if (month < 1 || month > 12) throw new Error(`Bulan tidak valid: ${month}`);
  if (day < 1 || day > 31) throw new Error(`Tanggal tidak valid: ${day}`);

  // ⭐ SELALU buat UTC date untuk storage
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
};

/**
 * Format Date UTC → "2024-01-15" string
 */
export const formatUTCToString = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// ==================== WIB (USER TIMEZONE) FUNCTIONS ====================

/**
 * Get TODAY in WIB (Asia/Jakarta) → "2024-01-15"
 */
export const getTodayInWIB = (): string => {
  // Create date in WIB timezone
  const now = new Date();
  const wibDate = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
  );

  const year = wibDate.getFullYear();
  const month = String(wibDate.getMonth() + 1).padStart(2, "0");
  const day = String(wibDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/**
 * Get yesterday's date in WIB timezone
 */
export const getYesterdayDateInWIB = (): string => {
  const today = getTodayInWIB();
  return addDays(today, -1);
};

/**
 * Add days to a date string (WIB)
 */
export const addDays = (dateString: string, days: number): string => {
  // Parse as WIB date (UTC+7)
  const date = new Date(`${dateString}T00:00:00+07:00`);
  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/**
 * Parse date string → Date in WIB timezone
 */
export const parseDateToWIB = (dateString: string): Date => {
  // Create midnight in WIB, then convert to Date object
  return new Date(`${dateString}T00:00:00+07:00`);
};

/**
 * Convert WIB date → UTC date (untuk storage)
 */
export const convertWIBtoUTC = (wibDate: Date): Date => {
  // WIB = UTC+7, jadi kurangi 7 jam
  const utcMillis = wibDate.getTime() - 7 * 60 * 60 * 1000;
  return new Date(utcMillis);
};

/**
 * Convert WIB date string → UTC Date
 */
export const convertWIBStringToUTC = (wibDateString: string): Date => {
  const wibDate = parseDateToWIB(wibDateString);
  return convertWIBtoUTC(wibDate);
};

/**
 * Convert UTC date → WIB date (untuk display)
 */
export const convertUTCtoWIB = (utcDate: Date): Date => {
  // UTC → WIB (+7 jam)
  const wibMillis = utcDate.getTime() + 7 * 60 * 60 * 1000;
  return new Date(wibMillis);
};

// ==================== BUSINESS LOGIC HELPERS ====================

/**
 * Get date range for WIB date (untuk query)
 */
export const getDateRangeForWIBDate = (
  wibDateString: string,
): { startUTC: Date; endUTC: Date } => {
  const wibDate = parseDateToWIB(wibDateString);

  // Start: WIB 00:00 → UTC
  const startWIB = new Date(wibDate);
  startWIB.setHours(0, 0, 0, 0);
  const startUTC = convertWIBtoUTC(startWIB);

  // End: WIB 23:59:59.999 → UTC
  const endWIB = new Date(wibDate);
  endWIB.setHours(23, 59, 59, 999);
  const endUTC = convertWIBtoUTC(endWIB);

  return { startUTC, endUTC };
};

/**
 * Get date range for query (BACKWARD COMPATIBILITY - deprecated)
 */
export const getDateRangeForQuery = (
  dateString: string,
): { start: Date; end: Date } => {
  const { startUTC, endUTC } = getDateRangeForWIBDate(dateString);
  return { start: startUTC, end: endUTC };
};

// ==================== DISPLAY FORMATTERS ====================

/**
 * Format untuk display di UI (WIB timezone)
 */
export const formatForDisplay = (utcDate: Date): string => {
  const wibDate = convertUTCtoWIB(utcDate);

  return wibDate.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
};

/**
 * Format simple date (15 Jan 2024) - WIB timezone
 */
export const formatSimpleDate = (utcDate: Date): string => {
  const wibDate = convertUTCtoWIB(utcDate);

  return wibDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
};

/**
 * Format UTC date to Indonesian date string (BACKWARD COMPATIBILITY - deprecated)
 */
export const formatToIndonesianDate = (utcDate: Date): string => {
  return formatSimpleDate(utcDate);
};

// ==================== VALIDATION & UTILITIES ====================

/**
 * Validate date string format
 */
export const isValidDateString = (dateString: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;

  try {
    parseDateToUTC(dateString);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get today's date in UTC (BACKWARD COMPATIBILITY - deprecated)
 */
export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Parse date (BACKWARD COMPATIBILITY - deprecated)
 */
export const parseDateFromFE = parseDateToUTC;

/**
 * Format date (BACKWARD COMPATIBILITY - deprecated)
 */
export const formatDateForFE = formatUTCToString;

/**
 * Get yesterday's date string (BACKWARD COMPATIBILITY - deprecated)
 */
export const getYesterdayDateString = (): string => {
  return getYesterdayDateInWIB();
};
