# Advent Calendar 2023

Source code for an advent calendar event ran by Jake in 2023

## Games
There were a total of 8 different games, below is the explanation of each game and the scoring attached with them.

### Find Santa
**Code name**: `find`

**Description**: Find santa(s) hidden within an image

#### Scoring
```
Base Score = correct guesses * 25
Time Bonus = 
  < 60 seconds: 50
  < 120 seconds: 25
  anything else: 10

Score = Base Score + Time Bonus
```

### Spot the difference
**Code Name**: `diff`

**Description**: Spot the differences between the two images

#### Scoring:
```
Base Score = correct guesses * 25
Time Bonus =
  < 60 seconds: 50
  < 120 seconds: 25
  anything else: 10

Score = Base Score + Time Bonus
```

### Matching Pairs
**Code Name**: `match`

**Description**: Match the pairs to win

#### Scoring
```
Score =
  < 20 seconds: 100
  < 30 seconds: 50
  anything else: 25
```

### Quiz
**Code Name**: `quiz`

**Description**: Answer the questions right to win

#### Scoring
```
Each Question Score:
  Not correct: 0
  < 10 seconds: 50
  < 20 seconds: 25
  anything else: 10

Score = Sum of Each question correct
```

### Riddle
**Code Name**: `riddle`

**Description**: Answer the riddle to win

#### Scoring
```
Score = 
  Not correct: 0
  Was correct: 50
```

### Lucky Wheel
**Code Name**: `wheel`

**Description**: Spin the wheel to win

#### Scoring
Scoring was predetermined based on the which random index was picked from the hardcoded segments.

### Fill the blanks
**Code name**: `word`

**Description**: Fill in the blank letters of the word to win

#### Scoring
```
Base Score: Number of correct * 25

Time Bonus:
  < 60 seconds: 75
  < 90 seconds: 35
  anything else: 25

Score = Base Score + Time Bonus
```

### Wordle
**Code Name**: `wordle`

**Description**: It's wordle, the 2020 hit game

#### Scoring
```
Incorrect OR Over Max Guesses: 0

Word Score: Word Length * 10
Attempt Score = (Word Length * 20) - (Attempts Taken * 20)

Score = Word Score + Attempt Score
```
