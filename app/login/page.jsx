'use client';
import PageContainer from '@/components/PageContainer';
import { authenticate, register } from '@/app/actions';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext, LocalizationContext } from '../layout';
import t from '@/lib/localization';


export default function LoginForm() {
  const router = useRouter();
  const { user, setUser } = useContext(AuthContext);
  const { loc, setLoc } = useContext(LocalizationContext);
  const [formResponse, setFormResponse] = useState();

  const [modeRegister, setModeRegister] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (formResponse?.success) {
      if (modeRegister) {
        setModeRegister(false);
        setFeedback(`${t('user_succesfully_created', loc)} ( ${formResponse.email} ).`);
        setFormResponse(null);
      } else {
        setUser(formResponse);

        if (formResponse.redirected) {
          router.push(formResponse.redirected);
        } else {
          router.push('/');
        }
      }
    }

    if (formResponse?.error) {
      setFeedback(t('something_went_wrong', loc));
    }

  }, [formResponse]);

  const formHandler = async (formData) => {
    let resp;
    if (modeRegister) {
      resp = await register(formData);
    } else {
      resp = await authenticate(formData);
    }
    
    setFormResponse(resp);
  }

  return (
    <PageContainer>
      <form action={formHandler} className="space-y-3">
        <div className='w-96'>
          <p className='text-xl text-indigo-900'>
            {t('login_title', loc)}
          </p>
          <div className='text-md text-black'>
            {feedback}
          </div>
          <div>
            <div>
              <label
                className="mb-3 mt-5 block text-s font-medium text-indigo-900"
                htmlFor="email"
              >
                {t('login_email', loc)}
              </label>
              <div>
                <input
                  className="w-80 p-1 focus:outline-none focus:ring focus:border-blue-500"
                  id="email"
                  type="email"
                  name="email"
                  placeholder={t('login_email_placeholder', loc)}
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                className="mb-3 mt-5 block text-s font-medium text-indigo-900"
                htmlFor="password"
              >
                {t('login_password', loc)}
              </label>
              <div>
                <input
                  className="w-80 p-1 focus:outline-none focus:ring focus:border-blue-500"
                  id="password"
                  type="password"
                  name="password"
                  placeholder={t('login_password_placeholder', loc)}
                  required
                  minLength={4}
                />
              </div>
            </div>
            {modeRegister &&
              <div className="mt-4 animate-fade-in">
                <label
                  className="mb-3 mt-5 block text-s font-medium text-indigo-900"
                  htmlFor="password2"
                >
                  {t('password_again', loc)}
                </label>
                <div>
                  <input
                    className="w-80 p-1 focus:outline-none focus:ring focus:border-blue-500"
                    id="password2"
                    type="password"
                    name="password2"
                    placeholder={t('login_password_placeholder', loc)}
                    required
                    minLength={4}
                  />
                </div>
              </div>
            }
            {modeRegister &&
              <div className='animate-fade-in'>
                <label
                  className="mb-3 mt-5 block text-s font-medium text-indigo-900"
                  htmlFor="fullname"
                >
                  {t('full_name', loc)}
                </label>
                <div>
                  <input
                    className="w-80 p-1 focus:outline-none focus:ring focus:border-blue-500"
                    id="fullname"
                    type="text"
                    name="fullname"
                    placeholder={t('full_name_placeholder', loc)}
                    required
                  />
                </div>
              </div>
            }
          </div>
          <div className='flex flex-row space-x-4 mt-6 items-center'>
            <LoginButton statusRegister={modeRegister} loc={loc} />
            <div className="text-xs text-blue-500 cursor-pointer hover:bg-gray-200 hover:ring" onClick={() => setModeRegister(!modeRegister)}>{modeRegister ? t('already_have_account', loc) : t('no_account_register', loc)}</div>
          </div>

        </div>
      </form>
    </PageContainer>
  );
}

function LoginButton({ statusRegister, loc }) {

  return (
    <button aria-disabled={false} disabled={false} className='border-solid border-2 rounded-md border-indigo-700 bg-white text-blue-700 enabled:hover:bg-blue-400 disabled:bg-gray-400 p-1 w-24'>{statusRegister ? t('register', loc) : t('login_btn', loc)}</button>
  )
}