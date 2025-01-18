import random
import streamlit as st

# Define the words
words = ['lion', 'tiger', 'bear', 'elephant', 'giraffe', 'zebra', 'hippo']

def generate_2way_relationships(words):
    """
    Generate random two-way relationships between animals.
    """
    relationships = []
    for i in range(len(words) - 1):
        word1 = words[i]
        word2 = random.choice([w for w in words if w != word1])
        hint = f"{word1.capitalize()} must come before {word2.capitalize()}."
        relationships.append({'order': [word1, word2], 'hint': hint})

        # Add the reverse relationship
        hint = f"{word2.capitalize()} must come after {word1.capitalize()}."
        relationships.append({'order': [word2, word1], 'hint': hint})

    return relationships

def generate_3way_relationships(words):
    """
    Generate random three-way relationships between animals.
    """
    relationships = []
    for i in range(len(words) - 2):
        word1 = words[i]
        word2, word3 = random.sample([w for w in words if w != word1], 2)
        order = [word1, word2, word3]
        random.shuffle(order)

        if order == [word2, word1, word3]:
            hint = f"{word1.capitalize()} must be between {word2.capitalize()} and {word3.capitalize()}; {word2.capitalize()} must be before {word3.capitalize()}."
        else:
            hint = f"{order[0].capitalize()} must come before {order[1].capitalize()} and {order[2].capitalize()}; {order[1].capitalize()} must be between {order[0].capitalize()} and {order[2].capitalize()}."

        relationships.append({'order': order, 'hint': hint})

    return relationships

def generate_4way_relationships(words):
    """
    Generate random four-way relationships between animals.
    """
    relationships = []
    for i in range(len(words) - 3):
        word1 = words[i]
        word2, word3, word4 = random.sample([w for w in words if w != word1], 3)
        order = [word1, word2, word3, word4]
        random.shuffle(order)

        hint_parts = []
        for j in range(len(order)):
            before_word = order[j-1] if j > 0 else None
            after_word = order[j+1] if j < len(order) - 1 else None
            if before_word and after_word:
                hint_parts.append(f"{order[j].capitalize()} must be between {before_word.capitalize()} and {after_word.capitalize()}")
            elif before_word:
                hint_parts.append(f"{order[j].capitalize()} must come after {before_word.capitalize()}")
            elif after_word:
                hint_parts.append(f"{order[j].capitalize()} must come before {after_word.capitalize()}")

        random.shuffle(hint_parts)
        hint = "; ".join(hint_parts) + "."

        relationships.append({'order': order, 'hint': hint})

    return relationships

def main():
    st.title("Animal Order Puzzle")

    difficulty = st.selectbox("Select difficulty level", ["Easy", "Medium", "Hard"])

    if difficulty == "Easy":
        relationships = generate_2way_relationships(words)
        num_slots = 2
    elif difficulty == "Medium":
        relationships = generate_3way_relationships(words)
        num_slots = 3
    else:
        relationships = generate_4way_relationships(words)
        num_slots = 4

    random.shuffle(relationships)

    if "user_selections" not in st.session_state:
        st.session_state.user_selections = [[None] * num_slots for _ in range(len(relationships))]

    for i, rel in enumerate(relationships[:10]):
        st.subheader(f"Relationship {i+1}")
        st.write(rel['hint'])

        order = rel['order'].copy()
        random.shuffle(order)

        slots = st.columns(num_slots)

        for j, slot in enumerate(slots):
            with slot:
                st.session_state.user_selections[i][j] = st.selectbox(f"Slot {j+1}", order, key=f"slot_{i}_{j}", index=order.index(st.session_state.user_selections[i][j]) if st.session_state.user_selections[i][j] in order else 0)

        if st.button(f"Check {i+1}", key=f"check_{i}"):
            if st.session_state.user_selections[i] == rel['order']:
                st.success("Correct order!")
            else:
                st.error(f"Incorrect order. The correct order is: {', '.join(rel['order'])}")

if __name__ == "__main__":
    main()