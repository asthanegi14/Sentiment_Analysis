import React, { useState, useEffect } from 'react';
import {
  Avatar,
  ChakraProvider,
  Box,
  VStack,
  Grid,
  theme,
  Flex,
} from '@chakra-ui/react';
import S1 from "./assets/s1.jpeg";
import S2 from "./assets/s2.jpeg";
import S3 from "./assets/s3.jpeg";
import { ColorModeSwitcher } from './ColorModeSwitcher';import { Recorder } from 'react-voice-recorder';
import 'react-voice-recorder/dist/index.css';
import Status from './components/Status';
import axios from 'axios';
import Result from './components/Result';
const assemblyApi = axios.create({
  baseURL: 'https://api.assemblyai.com/v2',
  headers: {
    authorization: process.env.REACT_APP_ASSEMBLY_API_KEY,
    'content-type': 'application/json',
  },
});

const initialState = {
  url : null,
  blob: null,
  chunks: null,
  duration: {
    h: 0,
    m: 0,
    s:0,
  },
}

function App() {

  const [audioDetails, setAudioDetails] = useState(initialState);
  const [transcript, setTranscript] = useState({id: ''});
  const [isLoading, setLoading] = useState(false);

  useEffect(()=>{
    const interval = setInterval(async()=>{
      if(transcript.id && transcript.status !== 'completed' && isLoading){
        try{
          const { data: transcriptData } = await assemblyApi.get(
            `/transcript/${transcript.id}`
          );
          setTranscript({ ...transcript, ...transcriptData }); //complete status
        }

        catch(err){
          console.error(err);
        }
      }
      else{
        setLoading(false);
        clearInterval(interval);
      }
    }, 1000);
    return ()=> clearInterval(interval);
  }, [isLoading, transcript]);


  const handleAudioStop = data => {
    setAudioDetails(data);
  };

  const handleReset = () =>{
    setAudioDetails({ ...initialState });
    setTranscript({ id: '' });
  };

  const handleAudioUpload = async (audioFile) =>{
    setLoading(true);

    const { data: uploadResponse } = await assemblyApi.post('/upload', audioFile);

    const { data } = await assemblyApi.post('/transcript', {
      audio_url: uploadResponse.upload_url,
      sentiment_analysis: true,
      entity_detection: true,
      iab_categories: true,
    });

    setTranscript({ id: data.id });
  };

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>

          {/* light and dark mode button */}
          <ColorModeSwitcher justifySelf="flex-end" />
          <VStack spacing={6}>
            <Flex gap={4}>
            <Avatar size="md" name="avatar" src={S1}/>
            <Avatar size="md" name="avatar" src={S2}/>
            <Avatar size="md" name="avatar" src={S3}/>
            </Flex>
            {/* <Box>This is a sentiment analyser which can detect your sentiments through your voice.</Box> */}
            <Box>
            {transcript.text && transcript.status === 'completed' ? (<Result transcript={transcript}/>) : (<Status isLoading={isLoading} status={transcript.status}/>)}
            </Box>
            <Box width={800}>
              <Recorder  
              record={true} 
              audioURL={audioDetails.url} 
              handleAudioStop={handleAudioStop} handleAudioUpload={handleAudioUpload} 
              handleReset={handleReset} />
            </Box>
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
