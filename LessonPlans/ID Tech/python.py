# a function that takes in a vector, checks it for a value, then returns true or false
def pet_checker(vector):
    if 'dog' in vector:
        return True
    else:
        return False
    
# a function that takes in a dictionary, checks it for a key, then returns the value
def value_checker(dictionary, key):
    if key in dictionary:
        return key + ' ' + dictionary[key]
    else:
        return None

# taking in user input and printing it out
input_val = input('What is your name?')
print('Hello ' + str(input_val) + ', its nice to meet you.')

input_val_num = int(input('Give me a value, and I will add 5 to it:'))
print('5 + ' + str(input_val_num) + ' = ' + str(input_val_num + 5))

# Python collection data-types
#   -List: [ordered, changeable, hold duplicate values. Can use len() on, can be polymorphic]
#   -Tuple: [ordered and unchangeable, hold duplicate values]
#   -Set: {unordered and unchangeable, cannot hold duplicate values}
#   -Dictionary: holds key-value pairs. ordered, changeable, hold duplicate values

# A list to store string values
pets = ['cat', 'fish', 'dog', 'chicken', 'bear']

# A dictionary to store names
nba_names = {
    'Michael': 'Jordan',
    'Scottie': 'Pippen',
    'Lebron': 'James',
    'Nikola': 'Yokic',
    'Ja': 'Morant'
}

# A list of dictionaries to store people information
John = {
    'name': 'John',
    'age': 15,
    'height': 70, #inches
    'favorite food': 'pizza'
}

Abby = {
    'name': 'Abby',
    'age': 17,
    'height': 63, #inches
    'favorite food': 'pasta'
}

Jake = {
    'name': 'Jake',
    'age': 13,
    'height': 74, #inches
    'favorite food': 'burgers'
}

# Putting dictionaries in an array and checking one at a time
people = [John, Abby, Jake]

for person in people:
    print(person['name'] + ' is ' + str(person['age']) + ' years old.')

# Dealing with lists and dictionaries using functions
has_dog = pet_checker(pets)
michael_name = value_checker(nba_names, 'Michael')
ja_name = value_checker(nba_names, 'Ja')

print(michael_name)
print(ja_name)

# trying to write to a file
try:
    write_file = open('new_text.txt', 'w')
    write_file.write('Hello World!\n')

    if has_dog is True:
        write_file.write('They have a dog\n')
    else:
        write_file.write('They do not have a dog\n')

    write_file.close()
except:
    print('Error writing to file.')

# trying to append to a file
try:
    append_file = open('new_text.txt', 'a')
    append_file.write('This is an appended line.')
    append_file.close()
except:
    print('Error appending to file.')

# trying to read from a file
try:
    read_file = open('new_text.txt', 'r')
    print(read_file.read())
    read_file.close()
except FileNotFoundError:
    print('Error reading from file')
