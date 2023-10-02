import React, { Fragment, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { green, blue } from '@mui/material/colors';

import GuessArea from './page/GuessArea';
import Keyboard from './page/Keyboard';
import MessageCenter from './page/MessageCenter';
import TopBanner from './page/TopBanner';

import { numGuessAreaRows, numGuessAreaColumns } from './utils/sizes';
import boxStyleVariants from './utils/keyboardAndGuessAreaBoxTypes';

const data = require('./utils/fiveLetterWords.json')['words'];
const word = data[Math.floor(Math.random() * data.length)];

function App() {
  console.log(word);

  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const demoKeys = 'qwertyuiopasdfghjklzxcvbnm',
    demoNumKeys = demoKeys.length;
  const keyboardRowOne = 'QWERTYUIOP';
  const keyboardRowTwo = 'ASDFGHJKL';
  const keyboardRowThree = 'ZXCVBNM';

  const finalKeyBoard = () => {
    let rowOne = keyboardRowOne.split('').map((letter) => ({
      ...boxStyleVariants.keyboardUnusedKey,
      letter: letter,
    }));
    let rowTwo = keyboardRowTwo.split('').map((letter) => ({
      ...boxStyleVariants.keyboardUnusedKey,
      letter: letter,
    }));
    let rowThree = keyboardRowThree.split('').map((letter) => ({
      ...boxStyleVariants.keyboardUnusedKey,
      letter: letter,
    }));
    const backspaceKey = {
      ...boxStyleVariants.keyboardUnusedKey, // you should probably create a new variant for backspace and enter keys
      width: 50,
      letter: 'Del',
      isBackspaceKey: true,
    };
    const enterKey = {
      ...boxStyleVariants.keyboardUnusedKey,
      width: 50,
      letter: 'Enter',
      isEnterKey: true,
    };
    rowThree.push(backspaceKey);
    rowThree.unshift(enterKey);

    return [...rowOne, ...rowTwo, ...rowThree];
  };

  const arr_to_string = (arr) => {
    let ret_str = '';
    for (let i = 0; i < 5; i++) {
      ret_str += arr[i]['letter'];
    }
    return ret_str;
  };

  const feedback = (guess_arr, solution_word) => {
    solution_word = solution_word.toUpperCase();
    for (let i = 0; i < 5; i++) {
      if (guess_arr[i]['letter'] === solution_word[i]) {
        guess_arr[i]['backgroundColor'] =
          boxStyleVariants.exactMatch.backgroundColor;
      } else if (solution_word.indexOf(guess_arr[i]['letter']) != -1) {
        guess_arr[i]['backgroundColor'] =
          boxStyleVariants.partialMatch.backgroundColor;
      } else {
        guess_arr[i]['backgroundColor'] =
          boxStyleVariants.noMatch.backgroundColor;
      }
    }
    return guess_arr;
  };

  let [activeRow, setActiveRow] = useState(
    new Array(numGuessAreaColumns).fill(boxStyleVariants.blankBox)
  );
  const [activeRowIdx, setActiveRowIdx] = useState(0); // the index of the first letter that gets added to the active row.
  const [keyboard, setKeyboard] = useState(finalKeyBoard());

  const keyboard_letters = () => {
    let arr = [];
    for (let i = 0; i < keyboard.length; i++) {
      arr.push(keyboard[i]['letter']);
    }
    return arr;
  };

  const changeKeyboard = (keyboard, feedback_arr) => {
    // go through each key in the feedback word
    // change the color of the keyboard key to match the key on the keyboard
    // change the color of the keyboard key to be same color of the guessed letter
    // return modified keyboard keys

    let newKeyboard = [...keyboard];
    let letters = keyboard_letters();

    for (let i = 0; i < 5; i++) {
      let idx = letters.indexOf(feedback_arr[i]['letter']);
      newKeyboard[idx]['backgroundColor'] = feedback_arr[i]['backgroundColor'];
    }

    setKeyboard(newKeyboard);

    return;
  };

  let [completedRows, setCompletedRows] = useState([]);
  let [remainingRows, setRemainingRows] = useState(
    new Array((numGuessAreaRows - 1) * numGuessAreaColumns).fill(
      boxStyleVariants.blankBox
    )
  );

  let allBoxes = [...completedRows, ...activeRow, ...remainingRows];

  const keyboardKeyPressedCallBack = (attrsOfKeyThatUserClicked) => {
    if (
      activeRowIdx === 0 &&
      attrsOfKeyThatUserClicked.isBackspaceKey &&
      !gameOver
    ) {
      return; // activeRow is empty as such, there are no letters to erase.
    }

    if (attrsOfKeyThatUserClicked.isBackspaceKey && !gameOver) {
      const newActiveRow = activeRow.slice();
      newActiveRow[activeRowIdx - 1] = boxStyleVariants.blankBox;
      setActiveRow(newActiveRow);
      setActiveRowIdx(activeRowIdx - 1);
      return;
    }

    if (
      activeRowIdx === numGuessAreaColumns &&
      attrsOfKeyThatUserClicked.isEnterKey &&
      !gameOver
    ) {
      // evaluate user's work that is now in activeRow. The feedback boxes get
      // stored in a 5-element array and get pushed into the completedRows.
      // the activeRow gets reset to 5 blank boxes.
      // the number of elements in remainingRows gets reduced by 5.
      // if the remainingRows is empty, game is over. Display a message in the
      // message center.

      // evaluate -> change colors etc.

      let guess_str = arr_to_string(activeRow);

      if (data.includes(guess_str.toLowerCase())) {
        let newMessage = '';
        setMessage(newMessage);
        let feedback_arr = feedback(activeRow, word);

        let newKeyboard = changeKeyboard(keyboard, activeRow);

        const newCompletedRow = completedRows.slice();
        newCompletedRow.push(...activeRow);
        setCompletedRows(newCompletedRow);

        if (guess_str.toLowerCase() === word) {
          let newMessage = 'Winner';
          setMessage(newMessage);
          setGameOver(true);
        }

        if (remainingRows.length === 0) {
          let newMessage = 'Game Over';
          setMessage(newMessage);
          setGameOver(true);
        }

        const newActiveRow = allBoxes.slice(
          completedRows.length + activeRowIdx,
          completedRows.length + 5 + activeRowIdx
        ); //Array(numGuessAreaColumns).fill(boxStyleVariants.blankBox);
        setActiveRow(newActiveRow);

        setActiveRowIdx(0);

        const newRemaningRows = remainingRows.slice();
        newRemaningRows.splice(0, 5);
        setRemainingRows(newRemaningRows);
        console.log(remainingRows.length);

        return;
      } else {
        let newMessage = 'Enter a Valid Word';
        setMessage(newMessage);
      }
    }

    if (attrsOfKeyThatUserClicked.isEnterKey && !gameOver) {
      // ignore the enter key as there are not enough letters in activeRow
      return;
    }

    if (activeRowIdx === numGuessAreaColumns && !gameOver) {
      // activeRow is already full.
      return;
    }

    if (!gameOver) {
      const newActiveRow = activeRow.slice();
      newActiveRow[activeRowIdx] = {
        ...boxStyleVariants.notEvaluated,
        letter: attrsOfKeyThatUserClicked.letter,
      };
      setActiveRow(newActiveRow);
      setActiveRowIdx(activeRowIdx + 1);
      // console.log(JSON.stringify(activeRow));
      return;
    }
  };

  return (
    <Fragment>
      <Box
        margin="auto"
        sx={{
          height: 600,
          width: 500,
          display: 'flex',
          flexDirection: 'column',
          placeItems: 'center',
          justifyContent: 'flex-top ',
        }}
      >
        <TopBanner />
        <GuessArea guessAreaBoxes={allBoxes} />
        <MessageCenter message={message} />
        <Keyboard
          keyboard={keyboard}
          demoNumKeys={demoNumKeys}
          onClickCallback={keyboardKeyPressedCallBack}
        />
      </Box>
    </Fragment>
  );
}

export default App;
