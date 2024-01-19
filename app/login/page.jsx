'use client';
import PageContainer from '@/components/PageContainer';
import { authenticate, register } from '@/app/actions';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext, LocalizationContext } from '../layout';
import t from '@/lib/localization';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { ERROR_MESSAGE_KEYS } from '@/utils/constants';


export default function LoginForm() {
  const router = useRouter();
  const { user, setUser } = useContext(AuthContext);
  const { loc, setLoc } = useContext(LocalizationContext);
  const [formResponse, setFormResponse] = useState();

  const [modeRegister, setModeRegister] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [fullname, setFullname] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    if (formResponse?.success) {
      if (modeRegister) {
        setModeRegister(false);
        setFeedback(`${t('user_succesfully_created', loc)} ( ${formResponse.email} ).`);
        setFormResponse(null);
        setPassword('');
        setPassword2('');
        setEmail('');
        setFullname('');
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
      if (formResponse?.status === 600) {
        const errorId = ERROR_MESSAGE_KEYS[formResponse.status];
        setFeedback(t(errorId, loc),);
      }else{
        setFeedback(t('something_went_wrong', loc));
      }
      
    }

  }, [formResponse]);

  const formHandler = ()=>{
    if (modeRegister && !passwordsMatch) return;
    setLoading(true);
    submitForm();
  }

  const submitForm = async () => {
    let resp;
    
    if (!executeRecaptcha) return;

    try {
      const token = await executeRecaptcha();

      if (!token) {
        console.log("Failed to get token");
        resp = {error: true, success: false};
        return;
      }

      const formData = new FormData();
      formData.append("token", token);
      formData.append("email", email);
      formData.append("password", password);
      if (modeRegister) {
        formData.append("password2", password2);
        formData.append("fullname", fullname);
        resp = await register(formData);
      } else {
        resp = await authenticate(formData);
      }
    } catch (error) {
      console.log('System error in sending a request to login.');
    } finally {
      if (!resp?.success) setLoading(false);
      setFormResponse(resp);
    }
  }

  const checkPasswordMatch = (pw1, pw2) => {
    if (pw1 === pw2) return true;
    return false;
  }

  return (
    <PageContainer>
      <form action={formHandler} className="space-y-3">
        <div className='sm:w-96 max-sm:w-screen max-sm:p-2'>
          <p className='max-sm:text-lg sm:text-xl text-indigo-900'>
            {t('login_title', loc)}
          </p>
          <div className='animate-pulse text-md text-black'>
            {feedback}
          </div>
          <div>
            <div>
              <label
                className="mb-3 mt-5 block max-sm:text-sm sm:text-md font-medium text-indigo-900"
                htmlFor="email"
              >
                {t('login_email', loc)}
              </label>
              <div>
                <input
                  className="max-sm:w-full sm:w-80 max-sm:text-sm sm:text-lg p-1 border-2 focus:outline-none focus:ring focus:border-blue-500"
                  id="email"
                  type="email"
                  name="email"
                  placeholder={t('login_email_placeholder', loc)}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                className="mb-3 mt-5 block max-sm:text-sm sm:text-md font-medium text-indigo-900"
                htmlFor="password"
              >
                {t('login_password', loc)}
              </label>
              <div>
                <input
                  className={`max-sm:w-full sm:w-80 max-sm:text-sm sm:text-lg p-1 focus:outline-none focus:ring focus:border-blue-500 border-2 ${modeRegister ? passwordsMatch ? 'border-green-500' : 'border-red-500' : 'valid:border-green-500 invalid:border-red-500'}`}
                  id="password"
                  type="password"
                  name="password"
                  placeholder={t('login_password_placeholder', loc)}
                  required
                  minLength={4}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    const match = checkPasswordMatch(e.target.value, password2);
                    setPasswordsMatch(match);
                  }}
                />
              </div>
            </div>
            {modeRegister &&
              <div className="mt-4 animate-fade-in">
                {!passwordsMatch && <p className='text-xs text-red-500'>{t('error_passwords_not_match', loc)}</p>}
                <label
                  className="mb-3 mt-5 block max-sm:text-sm sm:text-md font-medium text-indigo-900"
                  htmlFor="password2"
                >
                  {t('password_again', loc)}
                </label>
                <div>
                  <input
                    className={`max-sm:w-full sm:w-80 max-sm:text-sm sm:text-lg p-1 focus:outline-none focus:ring focus:border-blue-500 border-2 ${passwordsMatch ? 'border-green-500' : 'border-red-500'}`}
                    id="password2"
                    type="password"
                    name="password2"
                    placeholder={t('login_password_placeholder', loc)}
                    required
                    minLength={4}
                    value={password2}
                    onChange={(e) => {
                      setPassword2(e.target.value);
                      const match = checkPasswordMatch(password, e.target.value);
                      setPasswordsMatch(match);
                    }}
                  />
                </div>
              </div>
            }
            {modeRegister &&
              <div className='animate-fade-in'>
                <label
                  className="mb-3 mt-5 block max-sm:text-sm sm:text-md font-medium text-indigo-900"
                  htmlFor="fullname"
                >
                  {t('full_name', loc)}
                </label>
                <div>
                  <input
                    className="max-sm:w-full sm:w-80 max-sm:text-sm sm:text-lg p-1 focus:outline-none focus:ring focus:border-blue-500 border-2 valid:border-green-500 invalid:border-red-500"
                    id="fullname"
                    type="text"
                    name="fullname"
                    placeholder={t('full_name_placeholder', loc)}
                    required
                    minLength={3}
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                  />
                </div>
              </div>
            }
          </div>
          <div className='flex flex-row space-x-4 mt-6 items-center'>
            <LoginButton statusRegister={modeRegister} loc={loc} loading={loading} />
            <button type="button" aria-disabled={loading} disabled={loading} className="text-xs text-blue-500 cursor-pointer hover:bg-gray-200 hover:ring disabled:hover:cursor-not-allowed disabled:hover:bg-gray-300" onClick={() => {
              setPassword('');
              setPassword2('');
              setFullname('');
              setModeRegister(!modeRegister);
              
            }}>{modeRegister ? t('already_have_account', loc) : t('no_account_register', loc)}</button>
          </div>

        </div>
      </form>
    </PageContainer>
  );
}

function LoginButton({ statusRegister, loc, loading }) {

  return (
    <button aria-disabled={loading} disabled={loading} className='p-1 max-sm:w-32 sm:w-40 border-solid border-2 rounded-md border-indigo-700 bg-white text-blue-700 max-sm:text-sm sm:text-md hover:bg-blue-400 disabled:hover:cursor-not-allowed disabled:hover:bg-gray-300'>
      {loading &&
        <Spinner title={statusRegister ? t('spinner_register', loc) : t('spinner_login', loc)} />
      }
      {!loading &&
        <span>{statusRegister ? t('register', loc) : t('login_btn', loc)}</span>
      }
    </button>
  )
}

const Spinner = ({ title }) => {

  return (
    <div className="flex flex-row">
      <svg className="animate-spin h-5 w-5 mr-3 place-self-center" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {title}
    </div>
  )
}