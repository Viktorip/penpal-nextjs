'use client';
import PageContainer from '@/components/PageContainer';
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/app/actions';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../layout';
import t from '@/lib/localization';


export default function LoginForm() {
  const [state, dispatch] = useFormState(authenticate, undefined);
  console.log("State in Login Page", state);
  const router = useRouter();
  const {user, setUser} = useContext(AuthContext);

  useEffect(()=>{
    if (state?.id) {
      console.log("got user with id:", state.id);
      setUser(state);
      router.push('/');
    }
  }, [state]);

  return (
    <PageContainer>
      <form action={dispatch} className="space-y-3">
        <div>
          <div className='text-xl'>
            {t('login_title')}
          </div>
          <div>
            <div>
              <label
                className="mb-3 mt-5 block text-s font-medium text-gray-900"
                htmlFor="email"
              >
                {t('login_email')}
              </label>
              <div>
                <input
                  className="w-80 p-1 focus:outline-none focus:ring focus:border-blue-500"
                  id="email"
                  type="email"
                  name="email"
                  placeholder={t('login_email_placeholder')}
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                className="mb-3 mt-5 block text-s font-medium text-gray-900"
                htmlFor="password"
              >
                {t('login_password')}
              </label>
              <div>
                <input
                  className="w-80 p-1 focus:outline-none focus:ring focus:border-blue-500"
                  id="password"
                  type="password"
                  name="password"
                  placeholder={t('login_password_placeholder')}
                  required
                  minLength={4}
                />
              </div>
            </div>
          </div>
          <LoginButton />
        </div>
      </form>
    </PageContainer>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button aria-disabled={pending} disabled={pending} className='mt-6 border-solid border-2 rounded-md border-indigo-700 bg-white text-blue-700 enabled:hover:bg-blue-400 disabled:bg-gray-400 p-1 w-24'>{t('login_btn')}</button>
  )
}