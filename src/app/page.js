"use client";
import { languages } from "./languages";
import React from "react";
import clsx from "clsx";
import Confetti from 'react-confetti'
import { getRandomWord } from "./word";


export default function Home() {
  // Alphabet
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  // React States
  const [word, setWord] = React.useState(()=>getRandomWord());
  const [guessedLetters, setGuessedLetters] = React.useState([]);

  // Some Status Of The Game
  const wrongGuessNumber = guessedLetters.filter(
    (el) => !word.includes(el)
  ).length;
  const isGameLost = wrongGuessNumber >= languages.length - 1;
  const isGameWon = word.split("").every((el) => guessedLetters.includes(el));
  const isGameOver = isGameWon || isGameLost;

  // newGame
  function newGame() {
    setWord(() => getRandomWord());
    setGuessedLetters([]);
  }

  //gameStatusClass
  const gameStatusClass = clsx("game-status-section", {
    "game-won": isGameWon,
    "game-lost": isGameLost,
  });

  // gameStatus element
  function gameStatus() {
    if (isGameWon) {
      return (
        <>
          <h2>You won!</h2>
          <p>Well done.</p>
        </>
      );
    } else if (isGameLost) {
      return (
        <>
          <h2>You lost!</h2>
          <p>Do not give up.</p>
        </>
      );
    } else {
      return null;
    }
  }


  // Keyboard Click Event
  function handleKeyboardClick(el) {
    setGuessedLetters((prev) => [...new Set([...prev, el])]);
  }

  // Displayed Programming Languages
  const languageElements = languages.map((el, index) => {
    // When guess is wrong, change the style of the language
    const isLangStyleChanged = index < wrongGuessNumber;
    const className = clsx({
      "deleted-language": isLangStyleChanged,
    });
    return (
      <span
        style={{ backgroundColor: el.backgroundColor, color: el.color }}
        key={el.name}
        className={className}
      >
        {el.name}
      </span>
    );
  });

  // Given Word
  const wordElement = word.split("").map((el,index) => {
    const shouldShowLetter = isGameLost || guessedLetters.includes(el);

    const className = clsx({
      "green-letters": (isGameOver && guessedLetters.includes(el)),
      "red-letters": (isGameOver && !guessedLetters.includes(el)),
    });

    return (
      <span className={className} key={index}>
        {shouldShowLetter ? el.toUpperCase() : ""}
      </span>
    );
  });

  // Keyboard
  const keyboardElement = alphabet.split("").map((el) => {
    const isLetterInWord = word.includes(el);
    const isLetterGuessed = guessedLetters.includes(el);

    const className = clsx({
      "correct-guess": isLetterGuessed && isLetterInWord,
      "incorrect-guess": isLetterGuessed && !isLetterInWord,
    });

    return (
      <button
        disabled = {isGameOver}
        key={el}
        className={className}
        onClick={() => handleKeyboardClick(el)}
      >
        {el.toLocaleUpperCase()}
      </button>
    );
  });

  return (
    <main>
      {isGameWon && <Confetti/>}
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word within 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>
      <section className={gameStatusClass}>{gameStatus()}</section>
      <section className="languages-section">{languageElements}</section>
      <section className="word-section">{wordElement}</section>
      <section className="keyboard-section">{keyboardElement}</section>
      {isGameOver ? (
        <button onClick={newGame} className="new-game-button">
          New Game
        </button>
      ) : null}
    </main>
  );
}
