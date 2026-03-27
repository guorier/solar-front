/**
 * base64 문자열을 Web Crypto가 요구하는 ArrayBuffer로 변환
 * - 서버에서 내려준 공개키(SPKI)가 base64 문자열일 때 사용
 * - importKey("spki", ...)는 문자열 ❌ / ArrayBuffer ✅
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  // base64 → 바이너리 문자열
  const binary = atob(base64);

  // 바이너리 문자열을 실제 바이트 배열로 변환
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  // Web Crypto가 요구하는 ArrayBuffer 반환
  return bytes.buffer;
}

/**
 * 공개키 import는 비용이 크기 때문에
 * 같은 공개키에 대해선 CryptoKey를 캐싱
 * (회원가입/수정 여러 번 호출 대비)
 */
const publicKeyCache = new Map<string, CryptoKey>();

/**
 * base64(SPKI) 형태의 RSA 공개키를
 * Web Crypto에서 사용하는 CryptoKey로 변환
 */
async function importRsaPublicKeyFromBase64Spki(base64Spki: string): Promise<CryptoKey> {
  // 이미 import한 키면 재사용
  const cached = publicKeyCache.get(base64Spki);
  if (cached) return cached;

  // base64 → ArrayBuffer → CryptoKey
  const key = await crypto.subtle.importKey(
    'spki', // 공개키 포맷 (SubjectPublicKeyInfo)
    base64ToArrayBuffer(base64Spki),
    {
      name: 'RSA-OAEP', // RSA 암호화 알고리즘
      hash: 'SHA-256', // OAEP 내부 해시
    },
    false, // 키 추출 불가
    ['encrypt'], // 암호화 전용
  );

  // 캐시에 저장
  publicKeyCache.set(base64Spki, key);
  return key;
}

/**
 * ArrayBuffer → base64 문자열
 * - 암호화 결과는 ArrayBuffer로 나오기 때문에
 * - JSON으로 전송 가능한 문자열로 변환
 */
function arrayBufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = '';

  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

/**
 * 단일 문자열을 RSA-OAEP로 암호화
 * - 반환값은 서버로 전송할 base64 문자열
 */
export async function rsaEncryptValue(
  base64SpkiPublicKey: string,
  plainText: string,
): Promise<string> {
  // 빈 값 방어
  if (!plainText) return plainText;

  // 공개키 import (캐시 사용)
  const publicKey = await importRsaPublicKeyFromBase64Spki(base64SpkiPublicKey);

  // 문자열 → 바이트
  const encoded = new TextEncoder().encode(plainText);

  // RSA-OAEP 암호화
  const encrypted = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, encoded);

  // 전송용 base64 문자열로 변환
  return arrayBufferToBase64(encrypted);
}

/**
 * 객체 중 특정 필드들만 RSA로 암호화
 * - 회원가입 / 정보수정 payload에서
 *   민감한 필드만 골라서 암호화하기 위함
 */
export async function encryptFields<T extends Record<string, string>>(
  data: T,
  fields: (keyof T)[],
  base64SpkiPublicKey: string,
): Promise<T> {
  // 원본 객체 보호
  const result = { ...data };

  for (const field of fields) {
    const v = result[field];

    // 문자열이고 값이 있을 때만 암호화
    if (typeof v === 'string' && v.length > 0) {
      result[field] = (await rsaEncryptValue(base64SpkiPublicKey, v)) as T[typeof field];
    }
  }

  return result;
}

/**
 * 단일 문자열 RSA 암호화
 */
export async function encryptString(value: string, base64SpkiPublicKey: string): Promise<string> {
  if (!value) return value;
  return rsaEncryptValue(base64SpkiPublicKey, value);
}
