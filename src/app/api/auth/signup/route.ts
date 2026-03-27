import { NextResponse } from 'next/server';

// POST 요청 처리 함수
export async function POST() {
  try {
    // 외부 API에 회원가입 키 요청
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/acnt/signUpKey`, {
      method: 'POST',
    });

    // 응답을 JSON으로 변환
    const data = await res.json();

    // 정상 응답 반환
    return NextResponse.json(data);
  } catch {
    // 에러 발생 시 500 응답 반환
    return NextResponse.json({ message: 'ERROR' }, { status: 500 });
  }
}