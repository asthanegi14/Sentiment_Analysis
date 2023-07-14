import React from 'react'
import { Text } from '@chakra-ui/react';
import Highlights from './Highlights';
import Topics from './Topics';

const Result = ({transcript}) => {
  return (
    <div>
        <Text>{transcript.sentiment_analysis_results.map(result =>(
            <Highlights text={result.text} sentiment={result.sentiment}/>
        ))}
        </Text>
        <Topics transcript={transcript} />
    </div>
  )
}

export default Result