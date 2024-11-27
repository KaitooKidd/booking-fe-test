import { getCookie } from 'cookies-next';
import useSWRImmutable from 'swr/immutable';
import { UserRole } from '~/configs/role.config';
import { axiosPrivateInstance } from './instances/axios.instance';
import { FetchInstance } from './instances/fetch.instance';

const AuthApiEndPoint = {
  SIGN_IN: '/auth/sign-in',
  SIGN_UP: '/auth/sign-up',
  VERIFY_EMAIL: '/auth/verify-email',
  RESEND_VERIFICATION_EMAIL: '/auth/verify-email/resend',
};

type VerifyEmailResponse = {
  data: any;
  isLoading: boolean;
  isError: boolean;
  error: any;
};

export type SignInResponse = {
  // id: string; // email
  // isVerified: boolean;
  // roleName: UserRole;

  // id: string | number;
  email: string;
  isVerified: boolean;
  role: UserRole;
  name: string;
  avatar?: string;
};

export const AuthApi = {
  async signIn(token: string) {
    return await new FetchInstance<SignInResponse>().post(AuthApiEndPoint.SIGN_IN, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: false },
    });
  },

  async signUp(token: string) {
    return await new FetchInstance().post(AuthApiEndPoint.SIGN_UP, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: false },
    });
  },

  resendVerificationEmail() {
    return axiosPrivateInstance.post(AuthApiEndPoint.RESEND_VERIFICATION_EMAIL);
  },

  useVerifyEmail(verifyToken: string): VerifyEmailResponse {
    const token = getCookie('token');
    const fetcher = (url: string) =>
      new FetchInstance().fetcher(url, 'POST', {
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ verifyToken }),
        next: { revalidate: false },
      });
    const { data, isLoading, error } = useSWRImmutable(AuthApiEndPoint.VERIFY_EMAIL, fetcher);
    return { data, isLoading, isError: !!error, error };
  },
};
