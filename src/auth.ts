import { jwtDecode } from 'jwt-decode';
import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Kakao from 'next-auth/providers/kakao';
import Naver from 'next-auth/providers/naver';
import { AccessTokenClaims } from './services/auth/type';
import { postFactAuth, postLogin, postSessionRenew } from './services/auth/request';
import { generateRandomString } from './utils/randomString';
import { JWT } from 'next-auth/jwt';

async function refreshAccessToken(token: JWT) {
  try {
    const payload = {
      acntUnqNo: token.id as string,
      verificationCode: token.accessToken as string,
      renewCode: token.refreshToken as string,
      classify: token.classify as string,
    };

    console.log('토큰 재발급 요청 값: ', payload);
    const { data: newJwt } = await postSessionRenew(payload);

    console.log('토큰 재발급 응답: ', newJwt);
    const claims: AccessTokenClaims = jwtDecode(newJwt);
    console.log('새로운 토큰:', claims);

    return {
      ...token,
      accessToken: claims.verificationCode,
      refreshToken: claims.renewCode,
      accessTokenExp: claims.exp,
    };
  } catch (error) {
    console.error('REFRESH ERROR:', error);

    return {
      ...token,
      accessToken: undefined,
      refreshToken: undefined,
      accessTokenExp: 0,
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        acntId: { type: 'email' },
        pswd: { type: 'password' },
        seCd: { type: 'text' },
        uuId: { type: 'text' },
        classify: { type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.acntId || !credentials?.pswd || !credentials.seCd) {
          const credentialsSignin = new CredentialsSignin();
          credentialsSignin.code = '아이디 또는 비밀번호를 확인해 주세요.';
          throw credentialsSignin;
        }

        try {
          const hashKey = generateRandomString(16);

          const payload = {
            acntId: credentials.acntId as string,
            pswd: credentials.pswd as string,
            uuId: credentials.uuId as string,
            seCd: credentials.seCd as string,
            classify: (credentials.classify as string) ?? '',
            hashKey,
          };

          console.log('로그인 입력 정보: ', payload);

          // 로그인 요청
          const { data: loginRes } = await postLogin(payload);
          console.log('postLogin 응답: ', loginRes);

          if (!loginRes) {
            const credentialsSignin = new CredentialsSignin();
            credentialsSignin.code = '로그인 응답이 없습니다.';
            throw credentialsSignin;
          }

          if (!loginRes.verifiedCode || loginRes.statusCode !== 'S000') {
            const credentialsSignin = new CredentialsSignin();
            credentialsSignin.code =
              loginRes.statusMessage || '아이디 또는 비밀번호를 확인해 주세요.';
            throw credentialsSignin;
          }

          // JWT 발급 요청
          const { data: factAuthRes } = await postFactAuth({
            hashKey,
            classify: (credentials.classify as string) ?? '',
            verifiedCode: loginRes.verifiedCode,
          });

          console.log('postFactAuth 응답: ', factAuthRes);

          if (!factAuthRes) {
            const credentialsSignin = new CredentialsSignin();
            credentialsSignin.code = '인증 토큰 발급에 실패했습니다.';
            throw credentialsSignin;
          }

          // JWT decode
          const claims: AccessTokenClaims = jwtDecode(factAuthRes);

          console.log('최초 로그인: ', claims);

          return {
            id: claims.acntUnqNo,
            email: claims.acntId,
            pridtfScrtyId: claims.pridtfScrtyId, // 이메일 암호화
            name: claims.nm,
            pwplType: claims.pwplTypeCd, // 발전소 유형
            joinTypeCd: claims.joinTypeCd, // 가입 유형
            role: claims.grd, // 계정 등급
            groupCd: claims.groupCd, // 메뉴 권한 ID
            classify: (credentials.classify as string) ?? '', // 일반, 관리자 구분 값

            accessToken: claims.verificationCode,
            refreshToken: claims.renewCode,
            accessTokenExp: claims.exp,
          };
        } catch (err) {
          console.log('AUTHORIZE ERROR:', err);

          if (err instanceof CredentialsSignin) {
            throw err;
          }

          if (err instanceof Error) {
            const credentialsSignin = new CredentialsSignin();
            credentialsSignin.code = err.message || '로그인 중 오류가 발생하였습니다.';
            throw credentialsSignin;
          }

          const credentialsSignin = new CredentialsSignin();

          credentialsSignin.code = '로그인 중 오류가 발생하였습니다.';

          throw credentialsSignin;
        }
      },
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    Naver({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/login',
  },

  callbacks: {
    async jwt({ token, account, profile, user, trigger, session }) {
      console.log('현재 토큰: ', token);

      if (account?.provider === 'credentials' && user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExp = user.accessTokenExp;
        token.provider = 'credentials';

        token.id = user.id;
        token.email = user.email;
        token.pridtfScrtyId = user.pridtfScrtyId;
        token.name = user.name;
        token.pwplType = user.pwplType;
        token.joinTypeCd = user.joinTypeCd;
        token.role = user.role;
        token.classify = user.classify;

        token.groupCd = user.groupCd;
      }

      if (account && account.provider !== 'credentials') {
        token.snsAccessToken = account.access_token;
        token.provider = account.provider;

        token.email = profile?.email ?? user?.email ?? null;
        token.name = profile?.name ?? user?.name ?? null;
        token.picture = profile?.profile_image ?? profile?.picture ?? user?.image ?? null;
      }

      if (trigger === 'update' && session?.extend === true) {
        return await refreshAccessToken(token);
      }

      // 매 요청마다 만료 확인
      if (token.provider === 'credentials') {
        const now = Math.floor(Date.now() / 1000);
        const accessTokenExp = token.accessTokenExp as number | undefined;

        if (accessTokenExp && now >= accessTokenExp) {
          return {
            ...token,
            accessToken: undefined,
            refreshToken: undefined,
            accessTokenExp: 0,
          };
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        email: token.email,
        pridtfScrtyId: token.pridtfScrtyId,
        name: token.name,
        image: token.picture ?? null,
        role: token.role,
        classify: token.classify as string,
        accessTokenExp: token.accessTokenExp,
      };

      session.provider = token.provider;
      session.accessToken = token.accessToken as string;

      return session;
    },
  },
});
