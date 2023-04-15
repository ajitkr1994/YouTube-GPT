import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { ReactMediaRecorder } from "react-media-recorder";

const DynamicComponentWithNoSSR = dynamic(
  () => import('../components/App'),
  { ssr: false }
)

const TestPage = () => {
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

export default TestPage;