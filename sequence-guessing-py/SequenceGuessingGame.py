import random
import math
import streamlit as st

def generate_divided_and_added_sequence():
    divisor = random.randint(2, 4)
    start = (random.randint(1, 20) + 1) * divisor
    addend = random.randint(0, 5)

    sequence = [(start + idx * divisor) // divisor + addend for idx in range(5)]
    next_number = (start + 5 * divisor) // divisor + addend
    description = f"Starting at {start}, each number divided by {divisor} plus {addend}"
    formula = f"x[n] = ((({start} + n×{divisor}) ÷ {divisor}) + {addend})"

    return sequence, next_number, description, formula

def generate_geometric_sequence():
    ratio = random.randint(2, 4)
    start = random.randint(-100, 100)
    sequence = [start * ratio ** idx for idx in range(5)]
    next_number = sequence[-1] * ratio
    description = f"Geometric sequence with ratio of {ratio}"
    formula = f"x[n] = {start} × {ratio}^n"

    return sequence, next_number, description, formula

def generate_square_sequence():
    square_const = random.randint(1, 5)
    sequence = [(idx + 1) ** 2 + square_const for idx in range(5)]
    next_number = 6 ** 2 + square_const
    description = f"Square numbers plus {square_const}"
    formula = f"x[n] = n² + {square_const}"

    return sequence, next_number, description, formula

def generate_factorial_sequence():
    factorial_offset = random.randint(1, 5)
    is_add_factorial = random.choice([True, False])
    sequence = [math.factorial(idx + 1) + factorial_offset if is_add_factorial else math.factorial(idx + 1) - factorial_offset for idx in range(5)]
    next_number = math.factorial(6) + factorial_offset if is_add_factorial else math.factorial(6) - factorial_offset
    description = f"Factorial sequence {'plus' if is_add_factorial else 'minus'} {factorial_offset}"
    formula = f"x[n] = n! {'+ ' if is_add_factorial else '- '}{factorial_offset}"

    return sequence, next_number, description, formula

def generate_multiply_and_add_sequence():
    add_num = random.randint(1, 5)
    is_add = random.choice([True, False])
    allow_neg_start = random.random() < 0.3
    min_start_value = 1 if is_add else add_num + 1
    start = random.randint(min_start_value if not allow_neg_start else -30, 50)
    sequence = [start + (idx * 3) + (add_num if is_add else -add_num) for idx in range(5)]
    next_number = start + (5 * 3) + (add_num if is_add else -add_num)
    description = f"Multiply by 3 {'and add' if is_add else 'and subtract'} {add_num}"
    formula = f"x[n] = {start} + 3n {'+ ' if is_add else '- '}{add_num}"

    return sequence, next_number, description, formula

def generate_square_plus_minus_sequence():
    square_add = random.randint(1, 5)
    is_plus = random.choice([True, False])
    start = random.randint(-100, 100)
    sequence = [pow(start + idx + 1, 2) + (square_add if is_plus else -square_add) for idx in range(5)]
    next_number = pow(start + 6, 2) + (square_add if is_plus else -square_add)
    description = f"Square number {'plus' if is_plus else 'minus'} {square_add}"
    formula = f"x[n] = ({start} + n)² {'+ ' if is_plus else '- '}{square_add}"

    return sequence, next_number, description, formula

def generate_cube_sequence():
    cube_const = random.randint(1, 5)
    sequence = [(idx + 1) ** 3 + cube_const for idx in range(5)]
    next_number = 6 ** 3 + cube_const
    description = f"Cube numbers plus {cube_const}"
    formula = f"x[n] = n³ + {cube_const}"

    return sequence, next_number, description, formula

def generate_square_root_sequence():
    offset = random.randint(0, 4)
    sequence = [int(math.sqrt(pow(idx + offset + 1, 2))) for idx in range(5)]
    next_number = int(math.sqrt(pow(5 + offset + 1, 2)))
    description = f"Square root of perfect squares starting from {pow(offset + 1, 2)}"
    formula = f"x[n] = √({'(n+' + str(offset) + ')' if offset > 0 else 'n'}²)"

    return sequence, next_number, description, formula

def generate_fibonacci_sequence():
    fib_sequence = [1, 1]
    for _ in range(21):
        fib_sequence.append(fib_sequence[-1] + fib_sequence[-2])

    # Pick a random starting index between 0 and 1000
    start_index = random.randint(0, 19) 

    # Get the sequence of 5 consecutive Fibonacci numbers starting from the random index
    sequence = fib_sequence[start_index:start_index+5]
    next_number = fib_sequence[start_index+5]
    description = f"Fibonacci sequence starting from the {start_index}th number"
    formula = "x[n] = x[n-1] + x[n-2]"

    return sequence, next_number, description, formula

def generate_starting_number_sequence():
    starting_number = random.randint(-100, 100)
    sequence = [starting_number]
    for idx in range(1, 5):
        sequence.append(sequence[-1] + (idx + 2) * 3)
    next_number = sequence[-1] + (len(sequence) + 2) * 3
    description = "Sequence with a starting number and adding (n + 2) * 3 to the previous number"
    formula = "x[n] = x[n-1] + (n + 2) * 3"

    return sequence, next_number, description, formula

def generate_random_sequences():
    sequence_generators = [
        generate_divided_and_added_sequence,
        generate_geometric_sequence,
        generate_square_sequence,
        generate_factorial_sequence,
        generate_multiply_and_add_sequence,
        generate_square_plus_minus_sequence,
        generate_cube_sequence,
        generate_square_root_sequence,
        generate_fibonacci_sequence,
        generate_starting_number_sequence
    ]

    sequences = []
    used_sequences = set()
    sequence_to_string = lambda seq: ','.join(map(str, seq))

    case_types = list(range(10))
    random.shuffle(case_types)

    for case_type in case_types:
        sequence, next_number, description, formula = sequence_generators[case_type]()
        sequence_string = sequence_to_string(sequence)

        # {{ Check if the sequence is a straight sequence }}
        if len(set(sequence)) == len(sequence) and sequence == list(range(min(sequence), max(sequence)+1)):
            continue  # Skip this sequence and generate a new one
        # {{ /Check if the sequence is a straight sequence }}
        
        if sequence_string not in used_sequences:
            used_sequences.add(sequence_string)
            sequences.append({
                'sequence': sequence,
                'type': case_type,
                'description': description,
                'formula': formula,
                'next_number': next_number
            })

    return sequences

def main():
    st.set_page_config(page_title="Sequence Guessing Game", layout="wide")
    st.title("Sequence Guessing Game")
    st.write("Below are 10 sequences. Can you guess the next number?")

    if "sequences" not in st.session_state:
        st.session_state.sequences = generate_random_sequences()
        st.session_state.user_guesses = [None] * len(st.session_state.sequences)
        st.session_state.formula_shown = [False] * len(st.session_state.sequences)

    sequences = st.session_state.sequences


    for idx, seq_data in enumerate(sequences):
        with st.expander(f"Sequence {idx + 1}"):
            st.write(", ".join(map(str, seq_data['sequence'])))
            user_guess = st.text_input(f"Your guess for the next number", key=f"guess_{idx}", value=str(st.session_state.user_guesses[idx]) if st.session_state.user_guesses[idx] is not None else "")
            attempt_count = sum(1 for prev_guess in st.session_state.user_guesses[:idx+1] if prev_guess is not None)
            if st.button(f"Check Sequence {idx + 1}", key=f"check_{idx}"):
                if not user_guess:
                    st.warning("Please enter a value to check the sequence.")
                else:
                    try:
                        user_guess = float(user_guess)
                        st.session_state.user_guesses[idx] = user_guess
                        if abs(user_guess - seq_data['next_number']) < 0.1:
                            st.success(f"Correct! Formula: {seq_data['formula']}")
                            st.session_state.formula_shown[idx] = True
                        else:
                            if attempt_count < 2:
                                st.error(f"Try again! Hint: This is a {seq_data['description']}")
                            else:
                                st.error(f"Try again! Formula: {seq_data['formula']}")
                                st.session_state.formula_shown[idx] = True
                    except ValueError:
                        st.warning("Please enter a valid number.")


if __name__ == "__main__":
    main()