import React, { useState } from 'react';


const generateRandomSequences = () => {
  const sequences = [];
  const usedSequences = new Set();
  const sequenceToString = (seq) => seq.join(',');

  while (sequences.length < 10) {
    const type = Math.floor(Math.random() * 6);
    const start = Math.floor(Math.random() * 100) + 1;
    let sequence = [];
    let description = '';
    let formula = '';
    let nextNumber = 0; 

    switch (type) {
      case 0:
        const divisor = Math.floor(Math.random() * 3) + 2;
        const adder = Math.floor(Math.random() * 5) + 1;  
        sequence = Array.from({ length: 5 }, (_, idx) => {
          const n = start + idx * divisor;
          const divided = n / divisor;
          const result = divided + adder;
          // If result is an integer, show it as is
          if (Number.isInteger(result)) {
            return result;
          }
          // Otherwise, show as a simplified fraction + adder
          return Math.floor(result) === result ? result : `${n}/${divisor} + ${adder}`;
        });
        nextNumber = (start + 5 * divisor) / divisor + adder;
        description = `Each number divided by ${divisor} plus ${adder}`;
        formula = `x[n] = n ÷ ${divisor} + ${adder}`;
        break;
      case 1:
        const ratio = Math.floor(Math.random() * 3) + 2;
        sequence = Array.from({ length: 5 }, (_, idx) => start * Math.pow(ratio, idx));
        nextNumber = sequence[sequence.length - 1] * ratio;  // Calculate next
        description = `Geometric sequence with ratio of ${ratio}`;
        formula = `x[n] = x[n-1] × ${ratio}`;
        break;
      case 2:
        const squareConst = Math.floor(Math.random() * 5) + 1;
        sequence = Array.from({ length: 5 }, (_, idx) => Math.pow(idx + 1, 2) + squareConst);
        nextNumber = Math.pow(6, 2) + squareConst;  // Calculate next
        description = `Square numbers plus ${squareConst}`;
        formula = `x[n] = n² + ${squareConst}`;
        break;
      case 3:
        const factorial = (n) => (n === 0 || n === 1 ? 1 : n * factorial(n - 1));
        sequence = Array.from({ length: 5 }, (_, idx) => factorial(idx + 1));
        nextNumber = factorial(6);  // Calculate next
        description = 'Factorial sequence';
        formula = `x[n] = n!`;
        break;
      case 4:
        const addNum = Math.floor(Math.random() * 5) + 1;
        sequence = Array.from({ length: 5 }, (_, idx) => (idx + 1) * 3 + addNum);
        nextNumber = 6 * 3 + addNum;  // Calculate next
        description = `Multiply by 3 and add ${addNum}`;
        formula = `x[n] = 3n + ${addNum}`;
        break;
      case 5:
        const squareAdd = Math.floor(Math.random() * 5) + 1;
        sequence = Array.from({ length: 5 }, (_, idx) => Math.pow(idx + 1, 2) + squareAdd);
        nextNumber = Math.pow(6, 2) + squareAdd;  // Calculate next
        description = `Square number plus ${squareAdd}`;
        formula = `x[n] = n² + ${squareAdd}`;
        break;
      default:
        sequence = Array.from({ length: 5 }, (_, idx) => idx + 1);
        nextNumber = 6;
        description = 'Simple counting sequence';
        formula = 'x[n] = n';
        break;
    }

    const sequenceString = sequenceToString(sequence);
    if (!usedSequences.has(sequenceString)) {
      usedSequences.add(sequenceString);
      sequences.push({ 
        sequence, 
        type, 
        description, 
        formula,
        nextNumber 
      });
    }
  }

  return sequences;
};

const SequenceGuessingGame = () => {
  const [sequences] = useState(generateRandomSequences());
  const [guesses, setGuesses] = useState(Array(10).fill(''));
  const [results, setResults] = useState(Array(10).fill(null));
  const [attempts, setAttempts] = useState(Array(10).fill(0)); 

  const handleGuessChange = (index, value) => {
    const newGuesses = [...guesses];
    newGuesses[index] = value;
    setGuesses(newGuesses);
  };

  const evaluateGuess = (input) => {
    // Remove all whitespace
    const sanitizedInput = input.replace(/\s+/g, '');
    
    // Check if input contains only valid mathematical expressions
    const validPattern = /^[0-9+\-*/().]+$/;
    
    if (!validPattern.test(sanitizedInput)) {
      return parseFloat(input); // Return original input if it's not a valid expression
    }
  
    try {
      // Evaluate the expression
      const result = eval(sanitizedInput);
      return typeof result === 'number' && !isNaN(result) ? result : parseFloat(input);
    } catch (error) {
      return parseFloat(input); // Return original input if evaluation fails
    }
  };
  
  const checkGuess = (index) => {
    const userInput = guesses[index];
    const userGuess = evaluateGuess(userInput);
    const expectedNext = sequences[index].nextNumber;  
  
    // Add debugging here
    console.log('Checking sequence:', {
      sequence: sequences[index].sequence,
      type: sequences[index].type,
      description: sequences[index].description,
      formula: sequences[index].formula,
      expectedNext,
      userGuess,
      attempts: attempts[index] + 1
    });
  
    const newResults = [...results];
    const newAttempts = [...attempts];
  
    newAttempts[index]++;
    setAttempts(newAttempts);
  
    newResults[index] = Math.abs(userGuess - expectedNext) < 0.1;
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
                {results[index] ?  (
                    <>
                      Correct! <br/>
                      <span style={{ fontSize: '0.9em', opacity: '0.8' }}>
                        Formula: {seqData.formula}
                      </span>
                    </>
                  ) : (
                  <>
                    Try again! <br/>
                    <span style={{ fontSize: '0.9em', opacity: '0.8' }}>
                    Hint: This is a {seqData.description}
                      {attempts[index] >= 3 && (
                        <>
                          <br/>
                          Formula: {seqData.formula}
                        </>
                      )}
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