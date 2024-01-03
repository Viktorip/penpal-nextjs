'use client';
import PageContainer from '@/components/PageContainer';
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate, register } from '@/app/actions';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../layout';
import t from '@/lib/localization';


export default function LoginForm() {
  const [state, dispatch] = useFormState(authenticate, undefined);
  const router = useRouter();
  const { user, setUser } = useContext(AuthContext);
  const [formResponse, setFormResponse] = useState();

  const [modeRegister, setModeRegister] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (state?.id) {
      setUser(state);
      console.log("user in login page:", state);
      if (state.redirected) {
        router.push(state.redirected);
      } else {
        router.push('/');
      }
    }
  }, [state]);

  useEffect(() => {
    if (formResponse?.id) {
      if (modeRegister) {
        setModeRegister(false);
        setFeedback(`User succesfully created ( ${formResponse.email} ).`);
      } else {
        setUser(formResponse);
        console.log("user in login page:", formResponse);
        if (formResponse.redirected) {
          router.push(formResponse.redirected);
        } else {
          router.push('/');
        }
      }

    }
  }, [formResponse]);

  const formHandler = async (formData) => {
    console.log("trying to submit form");
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    let resp;
    if (modeRegister) {
      resp = await register(formData);
      console.log("got response to register", resp);
    } else {
      resp = await authenticate(formData);
      console.log("got response to signIn", resp);
    }
    setFormResponse(resp);

  }

  return (
    <PageContainer>
      <form action={formHandler} className="space-y-3">
        <div className='w-96'>
          <p className='text-xl text-indigo-900'>
            {t('login_title')}
          </p>
          <div className='text-md text-green-600'>
            {feedback}
          </div>
          <div>
            <div>
              <label
                className="mb-3 mt-5 block text-s font-medium text-indigo-900"
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
                className="mb-3 mt-5 block text-s font-medium text-indigo-900"
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
            {modeRegister &&
              <div className="mt-4 animate-fade-in">
                <label
                  className="mb-3 mt-5 block text-s font-medium text-indigo-900"
                  htmlFor="password2"
                >
                  Password again
                </label>
                <div>
                  <input
                    className="w-80 p-1 focus:outline-none focus:ring focus:border-blue-500"
                    id="password2"
                    type="password"
                    name="password2"
                    placeholder={t('login_password_placeholder')}
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
                  Full Name
                </label>
                <div>
                  <input
                    className="w-80 p-1 focus:outline-none focus:ring focus:border-blue-500"
                    id="fullname"
                    type="text"
                    name="fullname"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
            }
          </div>
          <div className='flex flex-row space-x-4 mt-6 items-center'>
            <LoginButton statusRegister={modeRegister} />
            <div className="text-xs text-blue-500 cursor-pointer" onClick={() => setModeRegister(!modeRegister)}>{modeRegister ? 'I already have an account.' : "Don't have an account? Register."}</div>
          </div>

        </div>
      </form>
    </PageContainer>
  );
}

function LoginButton({ statusRegister }) {
  const { pending } = useFormStatus();

  return (
    <button aria-disabled={pending} disabled={pending} className='border-solid border-2 rounded-md border-indigo-700 bg-white text-blue-700 enabled:hover:bg-blue-400 disabled:bg-gray-400 p-1 w-24'>{statusRegister ? 'Register' : t('login_btn')}</button>
  )
}