'use client'

import { useContext } from 'react';
import { AuthContext } from './layout';
import PageContainer from '@/components/PageContainer';
import t from '@/lib/localization';
import Image from 'next/image';
import { caveat } from './fonts';


export default function Home() {
  const { user, setUser } = useContext(AuthContext);

  return (
    <PageContainer className="h-full">

      <div className="flex flex-col items-center w-[32rem] h-[42rem] bg-[url('/welcome_note.jpg')] bg-contain bg-no-repeat bg-top">
        <div className='p-20'>
          <p className={`text-3xl text-justify text-indigo-900 ${caveat.className}`}>
            Hei ystävä!
            <br /> <br />
            Mukavaa, että olet kirjekaverit.fi sivustolla. Täällä voit lähettää kirjeitä rakkaillesi ja lukea heidän sinulle lähettämiä kirjeitä. Toivottavasti viihdyt kirjekaverit.fi parissa!
          </p>
        </div>
      </div>

    </PageContainer>
  )
}

/*
        <div className=''>
          {t('home_greeting')}
          {user?.id && <div>{`${t('home_welcome')} ${user["email"]}`}</div>}
        </div>
<Image
            src="/welcome_note.jpg"
            width={500}
            height={768}
            alt='Welcome'
          />

          */
