import React, { useState } from 'react';

const generateRandomSequences = () => {
  const sequences = [];

  for (let i = 0; i < 10; i++) {
    const type = Math.floor(Math.random() * 4); // Choose a type of sequence
    const start = Math.floor(Math.random() * 10) + 1; // Random starting number
    let sequence = [];

    switch (type) {
      case 0: // Arithmetic progression
        const diff = Math.floor(Math.random() * 5) + 1;
        sequence = Array.from({ length: 5 }, (_, idx) => start + idx * diff);
        break;
      case 1: // Geometric progression
        const ratio = Math.floor(Math.random() * 3) + 2;
        sequence = Array.from({ length: 5 }, (_, idx) => start * Math.pow(ratio, idx));
        break;
      case 2: // Squares
        sequence = Array.from({ length: 5 }, (_, idx) => Math.pow(start + idx, 2));
        break;
      case 3: // Factorials
        const factorial = (n) => (n === 0 || n === 1 ? 1 : n * factorial(n - 1));
        sequence = Array.from({ length: 5 }, (_, idx) => factorial(idx + 1));
        break;
      default:
        break;
    }

    sequences.push(sequence);
  }

  return sequences;
};

const calculateNextNumber = (sequence, type) => {
  const n = sequence.length;
  switch (type) {
    case 0: // Arithmetic
      const diff = sequence[1] - sequence[0];
      return sequence[n - 1] + diff;
    case 1: // Geometric
      const ratio = sequence[1] / sequence[0];
      return sequence[n - 1] * ratio;
    case 2: // Squares
      const root = Math.sqrt(sequence[n - 1]);
      return Math.pow(root + 1, 2);
    case 3: // Factorial
      return sequence[n - 1] * (n + 1);
    default:
      return 0;
  }
};

const SequenceGuessingGame = () => {
  const [sequences] = useState(generateRandomSequences());
  const [guesses, setGuesses] = useState(Array(10).fill(''));
  const [sequenceTypes] = useState(Array(10).fill().map(() => Math.floor(Math.random() * 4)));
  const [results, setResults] = useState(Array(10).fill(null));
  const handleGuessChange = (index, value) => {
    const newGuesses = [...guesses];
    newGuesses[index] = value;
    setGuesses(newGuesses);
  };
  const checkGuess = (index) => {
    const expectedNext = calculateNextNumber(sequences[index], sequenceTypes[index]);
    const userGuess = parseFloat(guesses[index]);
    const newResults = [...results];
    newResults[index] = Math.abs(userGuess - expectedNext) < 0.0001; // Using small epsilon for float comparison
    setResults(newResults);
  };
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#00ff00' }}>Sequence Guessing Game</h1>
      <p style={{ textAlign: 'center' }}>Below are 10 sequences. Can you guess the next number?</p>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {sequences.map((sequence, index) => (
          <li key={index} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #00ff00', borderRadius: '5px' }}>
            {sequence.join(', ')}
            <br />
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
              <input
                type="text"
                placeholder="Your guess for the next number"
                value={guesses[index]}
                onChange={(e) => handleGuessChange(index, e.target.value)}
                style={{ padding: '5px', flexGrow: 1, boxSizing: 'border-box' }}
              />
              <button 
                onClick={() => checkGuess(index)}
                style={{ 
                  padding: '5px 10px', 
                  backgroundColor: '#00ff00', 
                  color: '#000', 
                  border: 'none', 
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Check
              </button>
            </div>
            {results[index] !== null && (
              <div style={{ 
                marginTop: '5px', 
                color: results[index] ? '#00ff00' : '#ff0000' 
              }}>
                {results[index] ? 'Correct!' : 'Try again!'}
              </div>
            )}
          </li>
        ))}
      </ul>
      <p style={{ textAlign: 'center' }}>Refresh the page to get new sequences!</p>
    </div>
  );
};

export default SequenceGuessingGame;
