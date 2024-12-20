import React, { useState } from 'react';

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
    case 4: // Multiply and add (e.g., n * 2 + 1)
      const multDiff = sequence[1] - (sequence[0] * 2);
      return sequence[n - 1] * 2 + multDiff;
    case 5: // Square and add (e.g., n² + 2)
      const addDiff = sequence[1] - Math.pow(2, 2);
      return Math.pow(n + 1, 2) + addDiff;
    default:
      return 0;
  }
};

const generateRandomSequences = () => {
  const sequences = [];

  for (let i = 0; i < 10; i++) {
    const type = Math.floor(Math.random() * 6); // Updated to include new types
    const start = Math.floor(Math.random() * 10) + 1;
    let sequence = [];
    let description = '';

    switch (type) {
      case 0:
        const diff = Math.floor(Math.random() * 5) + 1;
        sequence = Array.from({ length: 5 }, (_, idx) => start + idx * diff);
        description = `Arithmetic sequence with difference of ${diff}`;
        break;
      case 1:
        const ratio = Math.floor(Math.random() * 3) + 2;
        sequence = Array.from({ length: 5 }, (_, idx) => start * Math.pow(ratio, idx));
        description = `Geometric sequence with ratio of ${ratio}`;
        break;
      case 2:
        sequence = Array.from({ length: 5 }, (_, idx) => Math.pow(start + idx, 2));
        description = 'Square numbers';
        break;
      case 3:
        const factorial = (n) => (n === 0 || n === 1 ? 1 : n * factorial(n - 1));
        sequence = Array.from({ length: 5 }, (_, idx) => factorial(idx + 1));
        description = 'Factorial sequence';
        break;
      case 4:
        const addNum = Math.floor(Math.random() * 5) + 1;
        sequence = Array.from({ length: 5 }, (_, idx) => (idx + 1) * 3 + addNum);  // Changed multiplier from 2 to 3
        
        description = `Multiply by 3 and add ${addNum}`;  
        
        break;
      case 5:
        const squareAdd = Math.floor(Math.random() * 5) + 1;
        sequence = Array.from({ length: 5 }, (_, idx) => Math.pow(idx + 1, 2) + squareAdd);
        description = `Square number plus ${squareAdd}`;
        break;
    }

    sequences.push({ sequence, type, description });
  }

  return sequences;
};

const SequenceGuessingGame = () => {
  const [sequences] = useState(generateRandomSequences());
  const [guesses, setGuesses] = useState(Array(10).fill(''));
  const [results, setResults] = useState(Array(10).fill(null));

  const handleGuessChange = (index, value) => {
    const newGuesses = [...guesses];
    newGuesses[index] = value;
    setGuesses(newGuesses);
  };

  const checkGuess = (index) => {
    const expectedNext = calculateNextNumber(sequences[index].sequence, sequences[index].type);
    const userGuess = parseFloat(guesses[index]);
    console.log({
      sequence: sequences[index].sequence,
      type: sequences[index].type,
      expectedNext,
      userGuess
    });
    const newResults = [...results];
    newResults[index] = Math.abs(userGuess - expectedNext) < 0.0001;
    setResults(newResults);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#00ff00' }}>Sequence Guessing Game</h1>
      <p style={{ textAlign: 'center' }}>Below are 10 sequences. Can you guess the next number?</p>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {sequences.map((seqData, index) => (
          <li key={index} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #00ff00', borderRadius: '5px' }}>
            {seqData.sequence.join(', ')}
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
                {results[index] ? 'Correct!' : (
                  <>
                    Try again! <br/>
                    <span style={{ fontSize: '0.9em', opacity: '0.8' }}>
                      Hint: This is a {seqData.description}
                    </span>
                  </>
                )}
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