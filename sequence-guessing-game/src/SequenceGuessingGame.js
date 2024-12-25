import React, { useState } from 'react';


const generateRandomSequences = () => {
  const sequences = [];
  const usedSequences = new Set();
  const sequenceToString = (seq) => seq.join(',');

  while (sequences.length < 10) {
    const type = Math.floor(Math.random() * 6);
    let start = Math.floor(Math.random() * 100) + 1;
    let sequence = [];
    let description = '';
    let formula = '';
    let nextNumber = 0; 

    switch (type) {
      case 0:
        const divisor = Math.floor(Math.random() * 3) + 2;
        const adder = Math.floor(Math.random() * 5) + 1;  
        const isAddition = Math.random() < 0.5;
        const allowNegative = Math.random() < 0.3;
        
        // 70% chance to make some numbers cleanly divisible
        const makeCleanlyDivisible = Math.random() < 0.7;
        // If making cleanly divisible, ensure the step is a multiple of divisor
        const step = makeCleanlyDivisible ? divisor * (Math.floor(Math.random() * 2) + 1) : divisor;
        
        const minStart = allowNegative ? -50 : (isAddition ? 1 : (adder + 1) * divisor);
        start = Math.floor(Math.random() * 50) + minStart;
        
        sequence = Array.from({ length: 5 }, (_, idx) => {
          const n = start + idx * step;
          const divided = n / divisor;
          const result = isAddition ? divided + adder : divided - adder;
          if (Number.isInteger(result)) {
            return result;
          }
          return Math.floor(result) === result ? result : `${n}/${divisor} ${isAddition ? '+' : '-'} ${adder}`;
        });
        nextNumber = (start + 5 * step) / divisor + (isAddition ? adder : -adder);
        description = `Each number divided by ${divisor} ${isAddition ? 'plus' : 'minus'} ${adder}`;
        formula = `x[n] = n ÷ ${divisor} ${isAddition ? '+' : '-'} ${adder}`;
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
        const isAdd = Math.random() < 0.5;
        // 30% chance to allow negative numbers
        const allowNegStart = Math.random() < 0.3;
        const minStartValue = allowNegStart ? -30 : (isAdd ? 1 : addNum + 1);
        start = Math.floor(Math.random() * 50) + minStartValue;
        sequence = Array.from({ length: 5 }, (_, idx) => start + (idx * 3) + (isAdd ? addNum : -addNum));
        nextNumber = start + (5 * 3) + (isAdd ? addNum : -addNum);
        description = `Multiply by 3 ${isAdd ? 'and add' : 'and subtract'} ${addNum}`;
        formula = `x[n] = ${start} + 3n ${isAdd ? '+' : '-'} ${addNum}`;
        break;
      case 5:
        const squareAdd = Math.floor(Math.random() * 5) + 1;
        const isPlus = Math.random() < 0.5; // 50% chance for addition vs subtraction
        sequence = Array.from({ length: 5 }, (_, idx) => Math.pow(idx + 1, 2) + (isPlus ? squareAdd : -squareAdd));
        nextNumber = Math.pow(6, 2) + (isPlus ? squareAdd : -squareAdd);
        description = `Square number ${isPlus ? 'plus' : 'minus'} ${squareAdd}`;
        formula = `x[n] = n² ${isPlus ? '+' : '-'} ${squareAdd}`;
        break;
      case 6:  // Add new case for cubed numbers
        const cubeConst = Math.floor(Math.random() * 5) + 1;
        sequence = Array.from({ length: 5 }, (_, idx) => Math.pow(idx + 1, 3) + cubeConst);
        nextNumber = Math.pow(6, 3) + cubeConst;  // Calculate next
        description = `Cube numbers plus ${cubeConst}`;
        formula = `x[n] = n³ + ${cubeConst}`;
        break;
      case 7:  // Add new case for square root sequence
        const offset = Math.floor(Math.random() * 5);  // Random offset 0-4
        sequence = Array.from({ length: 5 }, (_, idx) => {
          const perfectSquare = Math.pow(idx + offset + 1, 2);  // Generate perfect square
          return Math.sqrt(perfectSquare);
        });
        nextNumber = Math.sqrt(Math.pow(5 + offset + 1, 2));  // Calculate next
        description = `Square root of perfect squares starting from ${Math.pow(offset + 1, 2)}`;
        formula = `x[n] = √(${offset > 0 ? '(n+' + offset + ')' : 'n'}²)`;
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