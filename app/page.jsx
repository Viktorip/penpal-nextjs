'use client'

import { useContext } from 'react';
import { LocalizationContext } from './layout';
import PageContainer from '@/components/PageContainer';
import t from '@/lib/localization';
import { caveat } from './fonts';


export default function Home() {
  const { loc, setLoc } = useContext(LocalizationContext);
  
  return (
    <PageContainer className="h-full max-sm:p-1">

      <div className="flex flex-col items-center w-[32rem] h-[42rem] bg-[url('/welcome_note.jpg')] bg-contain bg-no-repeat bg-top">
        <div className='sm:pt-20 sm:px-[4.5rem] max-sm:pt-16 max-sm:px-12'>
          <p className={`max-sm:text-xl sm:text-3xl text-justify text-indigo-900 ${caveat.className}`}>
            {t('home_greeting',loc)}
            <br /> <br />
            {t('home_welcome',loc)}
            <br /> <br /> <br /> <br />
            {t('home_get_started',loc)}
          </p>
        </div>
      </div>

    </PageContainer>
  )
}
