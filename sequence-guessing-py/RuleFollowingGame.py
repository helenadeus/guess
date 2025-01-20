import random
import streamlit as st

# Define the words
words = ['lion', 'tiger', 'bear', 'elephant', 'giraffe', 'zebra', 'hippo']

def handle_relationship(relationship_index, relationships, words, num_slots):
    # Check if the user has already interacted with this relationship
    if relationship_index in st.session_state.user_order:
        # Recover the user's previous selections
        user_selections = st.session_state.user_order[relationship_index]
    else:
        # Initialize an empty dictionary for this relationship
        user_selections = {}
        st.session_state.user_order[relationship_index] = user_selections

    # Display the relationship hint
    st.subheader(f"Relationship {relationship_index + 1}")
    st.write(relationships[relationship_index]['hint'])

    # Create slots for user input
    slots = st.columns(num_slots)

    # Iterate over the slots
    for j, slot in enumerate(slots):
        with slot:
            # Check if the user has already selected an option for this slot
            if j in user_selections:
                # Recover the user's previous selection
                default_value = user_selections[j]
            else:
                default_value = ""

            # Display the dropdown for the user to select an option
            user_selection = st.selectbox(
                f"Slot {j + 1}",
                [""] + words,
                index=words.index(default_value) if default_value in words else 0,
                key=f"slot_{relationship_index}_{j}"
            )

            # Update the user's selection in the session state only if it has changed
            if user_selections.get(j, "") != user_selection:
                user_selections[j] = user_selection
                st.session_state.user_order[relationship_index] = user_selections.copy()

    # Check if the user clicked the "Check" button
    if st.button(f"Check {relationship_index + 1}", key=f"check_{relationship_index}"):
        # Check if the user's selections match the correct order
        if list(user_selections.values()) == relationships[relationship_index]['order']:
            st.success("Correct order!")
        else:
            st.error(f"Incorrect order. The correct order is: {', '.join(relationships[relationship_index]['order'])}")

def generate_2way_relationships(words):
    """
    Generate random two-way relationships between animals.
    """
    relationships = []
    
    for i in range(len(words) - 1):
        word1 = random.choice([w for w in words])
        word2 = random.choice([w for w in words if w != word1])
        hint = f"{word1.capitalize()} must come before {word2.capitalize()}."
        relationships.append({'order': [word1, word2], 'hint': hint})

        # Add the reverse relationship with the correct hint
        hint = f"{word2.capitalize()} must come before {word1.capitalize()}."
        relationships.append({'order': [word2, word1], 'hint': hint})

    return relationships

def generate_3way_relationships_old(words):
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

import random

import random

def generate_3way_relationships(words):
    """
    Generate random three-way relationships between words with more complex hints.
    """
    relationships = []
    for i in range(len(words) - 2):
        word1 = words[i]
        word2, word3 = random.sample([w for w in words if w != word1], 2)
        order = [word1, word2, word3]
        random.shuffle(order)

        # Generate complex hints that always reference all three words
        if order == [word2, word1, word3]:
            hint = (
                f"{word1.capitalize()} is somewhere between {word2.capitalize()} and {word3.capitalize()}. "
                f"The first word alphabetically is not last, and the last word alphabetically is not first. "
                f"{word2.capitalize()} comes before {word3.capitalize()}."
            )
        else:
            hint = (
                f"{order[0].capitalize()} comes earlier than {order[1].capitalize()} and {order[2].capitalize()}. "
                f"The word in the middle alphabetically is not the last in the sequence. "
                f"{order[1].capitalize()} is between {order[0].capitalize()} and {order[2].capitalize()}."
            )

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
    
    #setup
    difficulty2slots = {"Easy":2, "Medium":3, "Hard":4}
    difficulty2fun = {"Easy":generate_2way_relationships
    (words), "Medium":generate_3way_relationships(words), "Hard":generate_4way_relationships(words)}

    
    #if we changed the difficulty, we can refresh, otherwise preserve
    difficulty = st.selectbox("Select difficulty level", ["Easy", "Medium", "Hard"], index=1)
    print("DIFFICULTY",difficulty)
    
    if("difficulty" in st.session_state):
        prev_difficulty = st.session_state.difficulty
    else:
        prev_difficulty=difficulty

   
    if(prev_difficulty!=difficulty):
        for key in st.session_state.keys():
            del st.session_state[key]
    st.session_state.difficulty = difficulty
            
    num_slots = difficulty2slots[st.session_state.difficulty]
    print('number slots start', num_slots)
    
    if("relationships" not in st.session_state):
        


        st.session_state.relationships = difficulty2fun[st.session_state.difficulty]
        relationships = difficulty2fun[st.session_state.difficulty]
        st.session_state.relationships = relationships
    else:
        relationships = st.session_state.relationships

    

    if "user_order" not in st.session_state:
        user_order = {}
        st.session_state.user_order = user_order
    else:
        user_order = st.session_state.user_order 
        
    for relationship_index, relationship in enumerate(relationships):
        

        if relationship_index in st.session_state.user_order:
            # Recover the user's previous selections
            print("sels IN STATE")
            user_selections = st.session_state.user_order[relationship_index]
        else:
            print("sels NOT IN STATE")
            # Initialize an empty dictionary for this relationship with as many keys as slots
            user_selections = {i: "" for i in range(num_slots)}
            print(num_slots, user_selections)
            st.session_state.user_order[relationship_index] = user_selections

        # Display the relationship hint
        st.subheader(f"Relationship {relationship_index + 1}")
        st.write(relationships[relationship_index]['hint'])

        # Create slots for user input
        slots = st.columns(num_slots)
        for j, slot in enumerate(slots):
            with slot:
                default_value = st.session_state.user_order[relationship_index][j]
                print(relationship_index, j, default_value, )
                st.session_state.user_order[relationship_index][j] = st.selectbox(
                        f"Slot {j + 1}",
                        [""] + words,
                        index=0 if default_value == "" else words.index(default_value) + 1,
                        key=f"slot_{relationship_index}_{j}"
                    )
            # Check if the user clicked the "Check" button
        if st.button(f"Check {relationship_index + 1}", key=f"check_{relationship_index}"):
            user_selections = st.session_state.user_order[relationship_index]
            # Check if the user's selections match the correct order
            if list(user_selections.values()) == relationships[relationship_index]['order']:
                st.success("Correct order!")
                

                
            else:
                st.error(f"Incorrect order. The correct order is: {', '.join(relationships[relationship_index]['order'])}")


    
if __name__ == "__main__":
    main()