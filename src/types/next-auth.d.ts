import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    provider: string;
    user: DefaultSession['user'];
  }

  interface User {
    name: string;
    email: string;
    pridtfScrtyId: string;
    pwplType: string;
    role: string;
    joinTypeCd: string;
    groupCd?: string | null;
    classify: string;

    accessToken: string;
    refreshToken: string;
    accessTokenExp: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    provider: string;
    name: string;
    email: string;
    pridtfScrtyId: string;
    pwplType: string;
    role: string;
    joinTypeCd: string;
    groupCd?: string | null;
    picture?: string | null;

    accessToken?: string;
    refreshToken?: string;
    accessTokenExp: number;
  }
}
