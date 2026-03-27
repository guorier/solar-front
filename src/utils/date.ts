// src/utils/date.ts

/**
 * YYYY-MM-DD 형식으로 반환
 * - null/undefined면 '-'
 * - ISO 문자열, Date 변환 가능한 문자열 처리
 */
export const formatYmd = (v: string | null | undefined): string => {
  if (!v) return '-';

  const d = new Date(v);

  // Date 파싱 가능할 경우
  if (!Number.isNaN(d.getTime())) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // 파싱 실패 시 문자열 앞 10자리 반환 (YYYY-MM-DD 가정)
  return String(v).slice(0, 10);
};


/**
 * YYYY-MM-DD HH:mm 형식으로 반환
 * - 초 단위는 제거
 * - null/undefined면 '-'
 * - ISO / 일반 문자열 모두 대응
 */
export const formatYmdHm = (v: string | null | undefined): string => {
  if (!v) return '-';

  const d = new Date(v);

  // Date 객체 변환 가능할 경우
  if (!Number.isNaN(d.getTime())) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
  }

  // ISO 형식 (YYYY-MM-DDTHH:mm:ss)
  const s = String(v);

  if (s.length >= 16 && s.includes('T')) {
    return s.slice(0, 16).replace('T', ' ');
  }

  // 일반 공백 구분 형식 (YYYY-MM-DD HH:mm:ss)
  if (s.length >= 16 && s.includes(' ')) {
    return s.slice(0, 16);
  }

  return s;
};
