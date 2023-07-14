import React from 'react';
import { Text, Progress } from '@chakra-ui/react';

const Status = ( { isLoading, status }) => {
  return (
    <div>
        <Text>
            {isLoading ? `${status || 'uploading'}...`:'Upload any audio'}
        </Text>
        <Progress
        size="sm" 
        width={500}
        isIndeterminate={isLoading}
        colorScheme='green'/>
    </div>
  )
}

export default Status