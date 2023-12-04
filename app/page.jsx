'use client'

import { useContext } from 'react';
import { AuthContext } from './layout';
import PageContainer from '@/components/PageContainer';


export default function Home() {
  const { user, setUser } = useContext(AuthContext);
  console.log("user in main page:", user, user.email);
  return (
    <PageContainer>
      <div className=''>
      Main page content
      {user && <div>Welcome {user["email"]}</div>}
      </div>
    </PageContainer>
  )
}
