import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

const DynamicComponentWithNoSSR = dynamic(
  () => import('../components/VideoRecorder'),
  { ssr: false }
)

const RecordPage = () => {
  // const [hasWindow, setHasWindow] = useState(false);

  // useEffect(() => {
  //   console.log('useEffect called.');
  //   if (typeof window !== 'undefined') {
  //     console.log('Setting hasWindow to true');
  //     setHasWindow(true);
  //   }
  // }, [hasWindow]);

  return (
    <>
      <DynamicComponentWithNoSSR />
    </>
  )
  
}

export default RecordPage;