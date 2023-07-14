import React from 'react'
import { Box, Text, Tooltip } from '@chakra-ui/react';

const sentimentColors={
    POSITIVE: 'lightgreen',
    NEGATIVE: 'pink',
    NEUTRAL: 'lightgray',
};

const Highlights = ({ text, sentiment, entities }) => {
    // using entities to analyse each word instead of each sentance.
    //entities = [ {text: 'abcdef', entity_type: 'event'}]

    const entityText = entities ? entities.map((e) => e.text) : [];
    const arr = text.split(new RegExp(`(${entityText.join('|')})`, 'g'));
    console.log(arr);

  return (
    <Box as="mark" bg={sentimentColors[sentiment]} mr={1}>
        {arr.map((a) => {
            const match =  entities && entities.find((e) => e.text === a);

            if(match){
                return (
                    <Tooltip label={match.entity_type} key={a}>
                        <Text display="inline" fontSize="xl" fontWeight="bold">
                            {a}
                        </Text>
                    </Tooltip>
                )
            }
            return a;
        })}
    </Box>
  )
}

export default Highlights