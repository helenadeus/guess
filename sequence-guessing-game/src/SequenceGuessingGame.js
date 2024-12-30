import React, { useState } from 'react';


const generateRandomSequences = () => {
  const sequences = [];
  const usedSequences = new Set();
  const sequenceToString = (seq) => seq.join(',');
  const numCases = 10;
  const caseTypes = Array.from({ length: numCases }, (_, i) => i);

  // Shuffle the case types
  for (let i = caseTypes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [caseTypes[i], caseTypes[j]] = [caseTypes[j], caseTypes[i]];
  }

  for (const type of caseTypes) {
    
    let sequence = [];
    let description = '';
    let formula = '';
    let nextNumber = 0; 
    

    switch (type) {
      case 0:
        {
          let divisor = Math.floor(Math.random() * 3) + 2;
          let addend = Math.floor(Math.random() * 6);
          let start = (Math.floor(Math.random() * 20) + 1) * divisor;
      
          sequence = Array.from({ length: 5 }, (_, idx) => {
            const n = start + idx * divisor;
            return (n / divisor) + addend;
          });
          nextNumber = (start + 5 * divisor) / divisor + addend;
          description = `Starting at ${start}, each number divided by ${divisor} plus ${addend}`;
          formula = `x[n] = ((${start} + n×${divisor}) ÷ ${divisor}) + ${addend}`;
        }
        break;
      case 1:
        {
        const start = Math.floor(Math.random() * 201) - 100;
        const ratio = Math.floor(Math.random() * 3) + 2;
        sequence = Array.from({ length: 5 }, (_, idx) => start * Math.pow(ratio, idx));
        nextNumber = sequence[sequence.length - 1] * ratio;  // Calculate next
        description = `Geometric sequence with ratio of ${ratio}`;
        formula = `x[n] = x[n-1] × ${ratio}`;
        }
        break;
      case 2:
        {
          const start = Math.floor(Math.random() * 201) - 100;
          const squareConst = Math.floor(Math.random() * 5) + 1;
          sequence = Array.from({ length: 5 }, (_, idx) => Math.pow(idx + 1, 2) + squareConst);
          nextNumber = Math.pow(6, 2) + squareConst;  // Calculate next
          description = `Square numbers plus ${squareConst}`;
          formula = `x[n] = n² + ${squareConst}`;
        }
        break;
      case 3:
        {
          const start = Math.floor(Math.random() * 201) - 100;
          const factorial = (n) => (n === 0 || n === 1 ? 1 : n * factorial(n - 1));
          const isAddFactorial = Math.random() < 0.5; // 50% chance for addition vs subtraction
          const factorialOffset = Math.floor(Math.random() * 5) + 1;
          
          sequence = Array.from({ length: 5 }, (_, idx) => {
            const fact = factorial(idx + 1);
            return isAddFactorial ? fact + factorialOffset : fact - factorialOffset;
          });
          nextNumber = isAddFactorial ? factorial(6) + factorialOffset : factorial(6) - factorialOffset;
          description = `Factorial sequence ${isAddFactorial ? 'plus' : 'minus'} ${factorialOffset}`;
          formula = `x[n] = n! ${isAddFactorial ? '+' : '-'} ${factorialOffset}`;
        }
        break;
      case 4:
        {
          const start = Math.floor(Math.random() * 201) - 100;
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
        }
        break;
      case 5:
        {
          const squareAdd = Math.floor(Math.random() * 5) + 1;
          const isPlus = Math.random() < 0.5; 
          const start = Math.floor(Math.random() * 201) - 100; 

          const sequence = Array.from({ length: 5 }, (_, idx) => Math.pow(start + idx + 1, 2) + (isPlus ? squareAdd : -squareAdd));
          const nextNumber = Math.pow(start + 6, 2) + (isPlus ? squareAdd : -squareAdd);
    
          const description = `Square number ${isPlus ? 'plus' : 'minus'} ${squareAdd}`;
          const formula = `x[n] = (${start} + n)² ${isPlus ? '+' : '-'} ${squareAdd}`;
        }
        break;
      case 6:  
        {
          let start = Math.floor(Math.random() * 201) - 100;
          let cubeConst = Math.floor(Math.random() * 5) + 1;
          let sequence = Array.from({ length: 5 }, (_, idx) => Math.pow(idx + 1, 3) + cubeConst);
          let nextNumber = Math.pow(6, 3) + cubeConst;  // Calculate next
          let description = `Cube numbers plus ${cubeConst}`;
          let formula = `x[n] = n³ + ${cubeConst}`;
        }
        break;
      case 7:  // Add new case for square root sequence
        {
          const offset = Math.floor(Math.random() * 5); // Random offset 0-4
          sequence = Array.from({ length: 5 }, (_, idx) => {
            const perfectSquare = Math.pow(idx + offset + 1, 2); // Generate perfect square
            return Math.sqrt(perfectSquare);
          });
          nextNumber = Math.sqrt(Math.pow(5 + offset + 1, 2)); // Calculate next
          description = `Square root of perfect squares starting from ${Math.pow(offset + 1, 2)}`;
          formula = `x[n] = √(${offset > 0 ? '(n+' + offset + ')' : 'n'}²)`;
        }
        break;
      case 8: 
        {
        // Generate random start between -1000 and 1000
        const fibStart = Math.floor(Math.random() * 2001) - 1000;        
        const fibSecond = fibStart + (Math.floor(Math.random() * 21) - 10);

        
        sequence = [fibStart, fibSecond];
        // Generate next 3 numbers in Fibonacci-style (each number is sum of previous two)
        for (let i = 2; i < 5; i++) {
          sequence.push(sequence[i-1] + sequence[i-2]);
        }
        nextNumber = sequence[sequence.length - 1] + sequence[sequence.length - 2];
        description = `Fibonacci-style sequence starting at ${fibStart}`;
        formula = `x[n] = x[n-1] + x[n-2]`;
        }
        break;
      case 9: // New case for a + [(n + 2) * 3]
        {
          const startingNumber = Math.floor(Math.random() * 201) - 100; // Random number between -100 and 100
        sequence = [startingNumber];
        for (let i = 1; i < 5; i++) {
          sequence.push(sequence[i - 1] + ((i + 2) * 3));
        }
        nextNumber = sequence[sequence.length - 1] + ((sequence.length + 2) * 3);
        description = 'Sequence with a starting number and adding (n + 2) * 3 to the previous number';
        formula = `x[n] = x[n-1] + (n + 2) * 3`;
        }
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