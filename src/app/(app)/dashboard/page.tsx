import dynamic from 'next/dynamic';
import React from 'react'

const HomeComponent = dynamic(() => import('../../../components/HomeComponent'), {
  ssr: false, // Disable server-side rendering
});
const page = () => {
  return (
    <HomeComponent/>
  )
}

export default page