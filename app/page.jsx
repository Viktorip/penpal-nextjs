'use client'

import { useContext } from 'react';
import { AuthContext } from './layout';
import PageContainer from '@/components/PageContainer';
import t from '@/lib/localization';
import Image from 'next/image';


export default function Home() {
  const { user, setUser } = useContext(AuthContext);

  return (
    <PageContainer>
      <div className='space-y-8'>
        <div>
          <Image
            src="/letter_logo.jpg"
            width={300}
            height={192}
            alt='Logo'
          />
        </div>
        <div className=''>
          {t('home_greeting')}
          {user?.id && <div>{`${t('home_welcome')} ${user["email"]}`}</div>}
        </div>
      </div>
    </PageContainer>
  )
}
