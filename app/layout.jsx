'use client'
import './globals.css'
import Navigation from '@/components/Navigation'
import { createContext, useState } from 'react';
import { robotoFont, robotoHeavyFont } from './fonts';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';


export const AuthContext = createContext({
  user: null,
  setUser: () => { }
});

export const LocalizationContext = createContext({
  loc: 'fi',
  setLoc: () => { }
});

export default function RootLayout({ children }) {
  const [user, setUser] = useState({});
  const providerValue = { user, setUser };

  const [loc, setLoc] = useState('fi');
  const locProviderValue = { loc, setLoc }; 

  return (
    <html lang="fi">

      <body className="min-h-screen bg-[url('/background_paper_big.png')]">
        <AuthContext.Provider value={providerValue}>
          <LocalizationContext.Provider value={locProviderValue}>
            <GoogleReCaptchaProvider
              reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              scriptProps={{
                async: false,
                defer: true,
                appendTo: "body",
                nonce: undefined
              }}
            >
              <Navigation className={`${robotoHeavyFont.className}`} />
              {children}
            </GoogleReCaptchaProvider>
          </LocalizationContext.Provider>
        </AuthContext.Provider>
      </body>

    </html>
  )
}
