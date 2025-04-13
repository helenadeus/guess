import sys

class LogicPuzzleGame:
    def __init__(self):
        self.puzzles = [
            {
                "available_items": ["Berries", "Peas", "Tomato", "Grapes"],
                "slots": [None, None, None, None],  # 4 positions
                "rules": [
                    {"type": "fixed_position", "item": ["Berries", "Peas"], "position": 2},
                    {"type": "adjacent", "items": ["Carrot", "Tomato"]},
                    {"type": "conditional", "condition": "Grapes in 3", "constraint": "Carrot adjacent to Grapes"}
                ]
            }
        ]
        self.current_puzzle = 0

    def display_puzzle(self):
        puzzle = self.puzzles[self.current_puzzle]
        print("\n--- Puzzle ---")
        print("Available items:", puzzle["available_items"])
        print("Slots:", [item if item else "_" for item in puzzle["slots"]])
        print("Rules:")
        for rule in puzzle["rules"]:
            print(" -", self.describe_rule(rule))

    def describe_rule(self, rule):
        if rule["type"] == "fixed_position":
            return f"{' or '.join(rule['item'])} must be in position {rule['position'] + 1}"
        if rule["type"] == "adjacent":
            return f"{rule['items'][0]} must be next to {rule['items'][1]}"
        if rule["type"] == "conditional":
            return f"If {rule['condition']}, then {rule['constraint']}"
        return "Unknown rule"

    def place_item(self, item, position):
        puzzle = self.puzzles[self.current_puzzle]
        if item not in puzzle["available_items"]:
            print("❌ Item not available!")
            return
        if puzzle["slots"][position - 1] is not None:
            print("❌ Slot already occupied!")
            return

        puzzle["slots"][position - 1] = item
        puzzle["available_items"].remove(item)

    def check_rules(self):
        puzzle = self.puzzles[self.current_puzzle]
        slots = puzzle["slots"]

        for rule in puzzle["rules"]:
            if rule["type"] == "fixed_position":
                if slots[rule["position"]] not in rule["item"]:
                    return False, self.describe_rule(rule)
            elif rule["type"] == "adjacent":
                try:
                    idx1, idx2 = slots.index(rule["items"][0]), slots.index(rule["items"][1])
                    if abs(idx1 - idx2) != 1:
                        return False, self.describe_rule(rule)
                except ValueError:
                    pass  # If item isn't placed yet, we ignore for now
            elif rule["type"] == "conditional":
                condition_met = "Grapes in 3" in rule["condition"] and slots[2] == "Grapes"
                constraint_failed = slots.index("Carrot") not in (1, 3) if "Carrot adjacent to Grapes" in rule["constraint"] else False
                if condition_met and constraint_failed:
                    return False, self.describe_rule(rule)

        return True, None

    def play(self):
        while self.current_puzzle < len(self.puzzles):
            self.display_puzzle()
            item = input("Enter item to place: ")
            position = int(input("Enter position (1-4): "))

            self.place_item(item, position)
            solved, failed_rule = self.check_rules()

            if failed_rule:
                print(f"❌ Rule violated: {failed_rule}")
            elif "_" not in self.puzzles[self.current_puzzle]["slots"]:
                print("✅ Puzzle Solved!")
                self.current_puzzle += 1
                if self.current_puzzle >= len(self.puzzles):
                    print("🎉 All puzzles completed!")
                    sys.exit()

if __name__ == "__main__":
    game = LogicPuzzleGame()
    game.play()
