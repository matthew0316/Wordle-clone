import React, { Fragment } from 'react';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import { green, grey, orange } from '@mui/material/colors';

import { keyboardBoxSizes, keyboardRowsHGap } from '../utils/sizes';

import boxStyleVariants from '../utils/keyboardAndGuessAreaBoxTypes';

const KeyboardLetterBox = (props) => {
  const { keyAttributes } = props;

  // console.log(`keyboardBoxSizes ${JSON.stringify(keyAttributes)}`);

  return (
    <Box
      sx={{
        ...keyboardBoxSizes,
        border: 1,
        ...keyAttributes,
        display: 'grid',
        placeItems: 'center',
        fontSize: 20,
        fontFamily: 'Arial, Helvetica, sans-serif',
        color: 'black',
        borderRadius: '4px',
        fontSize: 18
      }}
    >
      {keyAttributes.letter}
    </Box>
  );
};

const Keyboard = (props) => {
  const { keyboard, onClickCallback } = props;
  const { demoNumKeys } = props;

  // each individual line of the keyboard

  let lineOne = keyboard.slice(0, 10);
  let lineTwo = keyboard.slice(10, 19);
  let lineThree = keyboard.slice(19, 28);

  return (
    <Fragment>
      <Grid // KEY BOARD GRID
        container
        sx={{
          mt: 10,
          width: 'fit-content',
        }}
      >
        {lineOne.map((keyAttributes, idx) => (
          <Grid // INDIVIDUAL KEYS
            item
            key={idx}
            columns={lineOne.length}
            xs={1}
            sx={{
              mb: 1,
              display: 'flex',
              flex: '33%',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
            onClick={() => onClickCallback(keyAttributes)}
          >
            <KeyboardLetterBox keyAttributes={keyAttributes} />
          </Grid>
        ))}

        {lineTwo.map((keyAttributes, idx) => (
          <Grid // INDIVIDUAL KEYS
            item
            columns={lineTwo.length}
            key={idx}
            xs={1}
            sx={{
              mb: 1,
              flex: '33%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
            onClick={() => onClickCallback(keyAttributes)}
          >
            <KeyboardLetterBox keyAttributes={keyAttributes} />
          </Grid>
        ))}

        {lineThree.map((keyAttributes, idx) => (
          <Grid // INDIVIDUAL KEYS
            item
            columns={lineThree.length}
            key={idx}
            xs={1}
            sx={{
              mb: 1,
              flex: '33%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
            onClick={() => onClickCallback(keyAttributes)}
          >
            <KeyboardLetterBox keyAttributes={keyAttributes} />
          </Grid>
        ))}
      </Grid>
    </Fragment>
  );
};

export default Keyboard;
