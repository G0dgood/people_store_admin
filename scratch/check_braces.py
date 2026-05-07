
def check_balance(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    for i, char in enumerate(content):
        if char in '({[':
            stack.append((char, i))
        elif char in ')}]':
            if not stack:
                print(f"Unexpected {char} at index {i}")
                continue
            top, pos = stack.pop()
            if top != pairs[char]:
                print(f"Mismatched {char} at index {i}, matches {top} from index {pos}")
    
    while stack:
        char, pos = stack.pop()
        print(f"Unclosed {char} from index {pos}")

check_balance('/Users/godwin/Desktop/Store/people_store_web/app/components/Admin/ViewProductModal.tsx')
