import { useEffect, useState } from "react";
import axios from 'axios';
import { Box, Divider, Typography } from "@mui/material";

const CreateSession: React.FC = () => {
  const [url, setUrl] = useState("");
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    

  }, [answer]);

  const onSubmit = async (e: any) => {
    e.preventDefault();

    console.log('onSubmit called. Calling backend.');

    const response = await axios.post(`${process.env.API_URL}/api/jobs/getTranscript/`, {
      url
    });

    console.log(response.data);
  };

  const onAsk = async (e: any) => {
    e.preventDefault();

    // const response = await axios.post(`${process.env.API_URL}/api/jobs/answerQuestion/`, {
    //   url,
    //   query
    // });

    setAnswer('abc');
  }

  return (
    <div className="flex h-screen bg-gray-50 min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
    <div className="w-full h-full max-w-md space-y-8">
      <div>
        <img
          className="mx-auto h-12 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Paste Youtube URL and ask any questions about it.
        </h2>
      </div>
      <form className="mt-8 space-y-6" action="#" method="POST">
        <input type="hidden" name="remember" defaultValue="true" />
        <div className="-space-y-px rounded-md shadow-sm">
          <div>
            <label htmlFor="url" className="sr-only">
              Youtube URL
            </label>
            <input
              id="url"
              name="url"
              autoComplete="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="relative block w-full rounded-t-md border-0 px-2 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="YouTube URL"
            />
          </div>          
        </div>

        <div>
          <button
            type="submit"
            className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      </form>
      

      <form className="mt-8 space-y-6" action="#" method="POST">
        <input type="hidden" name="remember" defaultValue="true" />
        <div className="-space-y-px rounded-md shadow-sm">
          <div>
            <label htmlFor="url" className="sr-only">
              Question
            </label>
            <input
              id="query"
              name="query"
              autoComplete="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
              className="relative block w-full rounded-t-md border-0 px-2 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter your question"
            />
          </div>          
        </div>

        <div>
          <button
            type="submit"
            className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={onAsk}
          >
            Ask!!
          </button>
        </div>
      </form>

      
    </div>

    
      {answer && 
      <div style={{display: 'flex', flexDirection: 'row', gap: '50px', marginTop: '50px'}}>
      <Box
        border={1}
        borderColor="grey"
        height={400}
        width={500}
        display="flex"
        // justifyContent="center"
        // alignItems="center"
        color="black"
        fontSize={24}
        flexDirection={'column'}
        padding={2}
      >
        <Typography variant="h5" display={'flex'} justifyContent={'center'} alignItems={'center'}>Script</Typography>
        <Divider />
        <p style={{overflow: 'scroll', fontSize: 'large'}}>
          {answer}
        </p>
      </Box>
      </div>
      }
    
  </div>
  );
};

export default CreateSession;
