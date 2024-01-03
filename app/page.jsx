'use client'

import { useContext } from 'react';
import { AuthContext, LocalizationContext } from './layout';
import PageContainer from '@/components/PageContainer';
import t from '@/lib/localization';
import { caveat } from './fonts';


export default function Home() {
  const { user, setUser } = useContext(AuthContext);
  const { loc, setLoc } = useContext(LocalizationContext);

  return (
    <PageContainer className="h-full">

      <div className="flex flex-col items-center w-[32rem] h-[42rem] bg-[url('/welcome_note.jpg')] bg-contain bg-no-repeat bg-top">
        <div className='p-20'>
          <p className={`text-3xl text-justify text-indigo-900 ${caveat.className}`}>
            {t('home_greeting',loc)}
            <br /> <br />
            {t('home_welcome',loc)}
          </p>
        </div>
      </div>

    </PageContainer>
  )
}
