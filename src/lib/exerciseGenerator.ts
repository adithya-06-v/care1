import { THERAPY_MODES } from './therapyModes';

// Exercise types
export interface Exercise {
  id: string;
  type: 'pronunciation' | 'breathing' | 'tongue_twister' | 'word_repetition' | 'sentence_reading' | 'minimal_pairs' | 'syllable_drill' | 'intonation';
  title: string;
  instruction: string;
  content: string;
  difficulty: 'beginner' | 'moderate' | 'severe';
  targetGoal: string;
  ageGroup?: string;
}

export interface AdaptiveData {
  weakExercises: string[];
  masteredExercises: string[];
  weakPhonemes: string[];
  currentDifficulty: 'beginner' | 'moderate' | 'severe';
  weakSounds: any[];
}

// 150 Medium to Easy Words
const wordBank: Omit<Exercise, 'id'>[] = [
  { type: 'word_repetition', title: 'Basic Word', instruction: 'Speak clearly', content: 'Cat', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Basic Word', instruction: 'Speak clearly', content: 'Dog', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Basic Word', instruction: 'Speak clearly', content: 'Sun', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Basic Word', instruction: 'Speak clearly', content: 'Moon', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Basic Word', instruction: 'Speak clearly', content: 'Ball', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Basic Word', instruction: 'Speak clearly', content: 'Book', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Basic Word', instruction: 'Speak clearly', content: 'Tree', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Basic Word', instruction: 'Speak clearly', content: 'Fish', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Basic Word', instruction: 'Speak clearly', content: 'Bird', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Basic Word', instruction: 'Speak clearly', content: 'Home', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Color', content: 'Blue', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Color', content: 'Green', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Color', content: 'Red', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Color', content: 'Yellow', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Color', content: 'Purple', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Color', content: 'Orange', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Color', content: 'Pink', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Color', content: 'White', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Color', content: 'Black', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Fruit', content: 'Apple', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Fruit', content: 'Banana', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Fruit', content: 'Orange', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Fruit', content: 'Grape', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Fruit', content: 'Mango', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Fruit', content: 'Peach', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Fruit', content: 'Cherry', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Food', content: 'Bread', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Food', content: 'Rice', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Food', content: 'Pizza', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Food', content: 'Pasta', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Food', content: 'Cake', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Food', content: 'Cookie', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Drink', content: 'Water', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Drink', content: 'Milk', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Drink', content: 'Juice', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Drink', content: 'Tea', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Drink', content: 'Coffee', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Object', content: 'Chair', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Object', content: 'Table', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Object', content: 'Window', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Object', content: 'Door', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Object', content: 'Paper', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Object', content: 'Phone', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Object', content: 'Lamp', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Basic', content: 'Hello', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Basic', content: 'Thanks', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Basic', content: 'Please', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Basic', content: 'Friend', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Basic', content: 'Family', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Number', content: 'One', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Number', content: 'Two', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Number', content: 'Three', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Number', content: 'Four', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Number', content: 'Five', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Number', content: 'Six', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Number', content: 'Seven', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Number', content: 'Eight', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Number', content: 'Nine', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Number', content: 'Ten', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Weather', content: 'Rain', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Weather', content: 'Snow', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Weather', content: 'Wind', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Weather', content: 'Cloud', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Weather', content: 'Light', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Weather', content: 'Storm', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Weather', content: 'Summer', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Weather', content: 'Winter', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Nature', content: 'Leaf', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Nature', content: 'Rock', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Nature', content: 'River', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Nature', content: 'Lake', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Nature', content: 'Mountain', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Nature', content: 'Forest', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Nature', content: 'Flower', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Nature', content: 'Garden', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Body', content: 'Hand', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Body', content: 'Foot', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Body', content: 'Head', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Body', content: 'Eyes', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Body', content: 'Nose', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Body', content: 'Mouth', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Body', content: 'Ear', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Body', content: 'Knee', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Body', content: 'Elbow', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Action', content: 'Run', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Action', content: 'Walk', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Action', content: 'Jump', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Action', content: 'Swim', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Action', content: 'Read', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Action', content: 'Write', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Action', content: 'Think', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Action', content: 'Smile', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Action', content: 'Laugh', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Feeling', content: 'Happy', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Feeling', content: 'Sad', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Feeling', content: 'Angry', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Feeling', content: 'Proud', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Feeling', content: 'Brave', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Feeling', content: 'Calm', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Kitchen', content: 'Spoon', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Kitchen', content: 'Fork', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Kitchen', content: 'Plate', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Kitchen', content: 'Cup', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Academic', content: 'History', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Academic', content: 'Science', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Academic', content: 'Music', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Academic', content: 'Art', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Academic', content: 'School', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Verb', content: 'Believe', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Verb', content: 'Imagine', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Verb', content: 'Create', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Verb', content: 'Develop', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Verb', content: 'Explore', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Adj', content: 'Simple', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Adj', content: 'Better', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Adj', content: 'Special', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Adj', content: 'Perfect', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Adj', content: 'Brilliant', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Adj', content: 'Powerful', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Complex', content: 'Library', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Complex', content: 'Museum', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Complex', content: 'Airport', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Complex', content: 'Hospital', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Complex', content: 'Success', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Complex', content: 'Practice', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Animal', content: 'Tiger', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Animal', content: 'Lion', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Animal', content: 'Elephant', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Animal', content: 'Monkey', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Animal', content: 'Rabbit', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Animal', content: 'Snake', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Animal', content: 'Turtle', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Vehicle', content: 'Car', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Vehicle', content: 'Bike', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Vehicle', content: 'Bus', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Vehicle', content: 'Train', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Vehicle', content: 'Plane', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Vehicle', content: 'Boat', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Value', content: 'Kind', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Value', content: 'Honest', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Value', content: 'Loyal', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Value', content: 'Peace', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Value', content: 'Respect', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Furniture', content: 'Bed', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Furniture', content: 'Rug', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Furniture', content: 'Clock', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
  { type: 'word_repetition', title: 'Furniture', content: 'Shelf', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Speak clearly' },
];

// 150 Medium to Easy Sentences
const sentenceBank: Omit<Exercise, 'id'>[] = [
  { type: 'sentence_reading', title: 'Daily Life', instruction: 'Read naturally', content: 'I like to eat apples', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Observation', instruction: 'Read naturally', content: 'The sun is very bright', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Relationship', instruction: 'Read naturally', content: 'My friend is very kind', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Home', instruction: 'Read naturally', content: 'I live in a house', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Feeling', instruction: 'Read naturally', content: 'The water is so cold', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Activity', instruction: 'Read naturally', content: 'We go to the park', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Observation', instruction: 'Read naturally', content: 'The cat is on the mat', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Hobby', instruction: 'Read naturally', content: 'I love reading new books', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Observation', instruction: 'Read naturally', content: 'It is a beautiful day', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Goal', instruction: 'Read naturally', content: 'I want to learn more', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Daily', content: 'I woke up early today', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Daily', content: 'The breakfast was very delicious', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Daily', content: 'I am going to work now', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Daily', content: 'The coffee is very hot', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Daily', content: 'I will be back soon', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Nature', content: 'The sky is clear blue today', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Nature', content: 'The grass is green and soft', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Nature', content: 'I see a bird in the tree', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Nature', content: 'The rain is falling softly', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Nature', content: 'The mountains are very high', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Home', content: 'The kitchen is clean', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Home', content: 'I am sitting on the sofa', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Home', content: 'The window is open', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Home', content: 'I am reading a story book', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Home', content: 'The bed is very comfortable', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Social', content: 'Hello how are you today', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Social', content: 'It is nice to meet you', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Social', content: 'Thank you for your help', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Social', content: 'Have a great day ahead', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Social', content: 'I hope you are doing well', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Action', content: 'Please pass me the salt', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Action', content: 'I am walking to the park', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Action', content: 'The kids are playing outside', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Action', content: 'I am learning to play guitar', difficulty: 'severe', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Action', content: 'She is singing a beautiful song', difficulty: 'severe', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Short', content: 'I am happy', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Short', content: 'The sun is hot', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Short', content: 'I love my home', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Short', content: 'The water is blue', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Short', content: 'I see a dog', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Food', content: 'I like pizza very much', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Food', content: 'The fruit is fresh', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Food', content: 'I want a cup of tea', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Food', content: 'The cake tastes sweet', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Food', content: 'Healthy food is good', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'School', content: 'The school is very big', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'School', content: 'I have many friends', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'School', content: 'The teacher is kind', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'School', content: 'I am learning new words', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'School', content: 'Practice makes perfect', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Travel', content: 'I want to see the world', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Travel', content: 'The plane is flying high', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Travel', content: 'We are going on a trip', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Travel', content: 'The beach is very sunny', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Travel', content: 'I love to explore places', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Time', content: 'The clock is ticking', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Time', content: 'I will be there on time', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Time', content: 'Morning is my favorite time', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Time', content: 'The night is very quiet', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Time', content: 'Every second counts', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Sport', content: 'I like playing football', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Sport', content: 'The game was exciting', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Sport', content: 'We won the match', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Sport', content: 'I am a fast runner', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Sport', content: 'Teamwork is very important', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Music', content: 'I listen to music daily', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Music', content: 'The melody is very soft', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Music', content: 'I love to dance to the beat', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Music', content: 'The song is very catchy', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Music', content: 'Music makes the world better', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Work', content: 'I have a lot of work', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Work', content: 'The meeting was long', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Work', content: 'I enjoy my job', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Work', content: 'My colleagues are helpful', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Work', content: 'Focus on your goals', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'City', content: 'The city is very crowded', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'City', content: 'I like city life', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'City', content: 'The buildings are very tall', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'City', content: 'Traffic is slow today', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'City', content: 'The park is in the city', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Weather', content: 'The weather is very nice', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Weather', content: 'It is raining outside', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Weather', content: 'The wind is blowing hard', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Weather', content: 'I see a rainbow', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Weather', content: 'The snow is white', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Animal', content: 'The cat is sleeping', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Animal', content: 'The bird is flying', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Animal', content: 'Fish swim in water', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Animal', content: 'I have a pet dog', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Animal', content: 'The lion is king', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Health', content: 'Eat your vegetables', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Health', content: 'Drink plenty of water', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Health', content: 'Get enough sleep', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Health', content: 'Exercise every morning', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Health', content: 'Health is wealth', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Clothing', content: 'I like my new shirt', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Clothing', content: 'The hat is very warm', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Clothing', content: 'These shoes are comfortable', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Clothing', content: 'I wear a red dress', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Clothing', content: 'My coat is long', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Space', content: 'Stars are in the sky', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Space', content: 'The moon is round', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Space', content: 'Sun gives us light', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Space', content: 'The universe is huge', difficulty: 'severe', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Space', content: 'I want to be an astronaut', difficulty: 'severe', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Color', content: 'The sky is blue', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Color', content: 'Grass is green', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Color', content: 'Apples are red', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Color', content: 'Bananas are yellow', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Color', content: 'Grapes are purple', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Hobby', content: 'I like to paint', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Hobby', content: 'I enjoy cooking food', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Hobby', content: 'I love to garden', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Hobby', content: 'I collect old coins', difficulty: 'severe', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Hobby', content: 'I like taking photos', difficulty: 'severe', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Common', content: 'I am here now', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Common', content: 'Where are you going', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Common', content: 'What is your name', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Common', content: 'I can do this', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Common', content: 'Let us start practice', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Social', content: 'Can I join you', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Social', content: 'Let us play together', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Social', content: 'I will help you', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Social', content: 'You are my best friend', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Social', content: 'Share your toys', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Feeling', content: 'I am so excited', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Feeling', content: 'I am feeling sleepy', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Feeling', content: 'I am a bit nervous', difficulty: 'severe', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Feeling', content: 'I feel very strong', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Feeling', content: 'I am so proud of you', difficulty: 'severe', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Nature', content: 'The ocean is vast', difficulty: 'severe', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Nature', content: 'I like the forest', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Nature', content: 'The desert is dry', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Nature', content: 'The stars are bright', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Nature', content: 'Earth is our home', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Daily', content: 'I am eating lunch', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Daily', content: 'I am drinking water', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Daily', content: 'I am going to sleep', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Daily', content: 'I am brushing my teeth', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Daily', content: 'I am washing my hands', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Animal', content: 'The elephant is big', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Animal', content: 'The mouse is small', difficulty: 'beginner', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Animal', content: 'The giraffe is tall', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Animal', content: 'The turtle is slow', difficulty: 'moderate', targetGoal: 'pronunciation', instruction: 'Read naturally' },
  { type: 'sentence_reading', title: 'Animal', content: 'The cheetah is fast', difficulty: 'severe', targetGoal: 'pronunciation', instruction: 'Read naturally' },
];

export const getExerciseVarietyBucket = (
  exercise: Omit<Exercise, 'id'>
): 'word' | 'sentence' | 'long_phrase' => {
  if (
    exercise.type === 'word_repetition' ||
    exercise.type === 'pronunciation' ||
    exercise.type === 'minimal_pairs' ||
    exercise.type === 'syllable_drill'
  ) {
    return 'word';
  }

  const cleanedContent = exercise.content
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  if (cleanedContent.length >= 10) {
    return 'long_phrase';
  }

  return 'sentence';
};


// Generate personalized exercises based on user profile and preference
export const generateExercises = (
  profile: any,
  sessionDurationMinutes: number,
  adaptiveData?: any,
  datasetExercises?: Omit<Exercise, 'id'>[],
  practicePreference?: 'word' | 'sentence',
): Exercise[] => {
  const exercises: Exercise[] = [];
  const therapyMode = profile?.therapy_mode || 'pronunciation';
  
  // Get valid exercise types for this mode
  const modeConfig = THERAPY_MODES[therapyMode] || THERAPY_MODES.pronunciation;
  const allowedTypes = [...modeConfig.exerciseTypes];

  // Add general types to ensure bank is never empty
  if (!allowedTypes.includes('word_repetition')) allowedTypes.push('word_repetition');
  if (!allowedTypes.includes('sentence_reading')) allowedTypes.push('sentence_reading');

  // Combine banks - Always include hardcoded banks as fallbacks/additions
  let fullBank: Omit<Exercise, 'id'>[] = [...wordBank, ...sentenceBank];
  
  // If we have dataset exercises, add them to the pool
  if (datasetExercises && datasetExercises.length > 0) {
    fullBank = [...datasetExercises, ...fullBank];
  }

  // Filter out mastered exercises ("Never Repeat" system)
  const masteredTexts = adaptiveData?.masteredExercises || [];
  if (masteredTexts.length > 0) {
    const unmasteredBank = fullBank.filter(ex => !masteredTexts.includes(ex.content));
    // Only use unmastered bank if it's not empty, otherwise we'd have no exercises
    if (unmasteredBank.length > 0) {
      fullBank = unmasteredBank;
    }
  }

  // Filter bank by therapy mode's allowed types
  let filteredBank = fullBank.filter(ex => allowedTypes.includes(ex.type));

  // If filtered bank is too small, fallback to full bank (even if it contains mastered items)
  // to ensure the user ALWAYS has content to practice
  if (filteredBank.length < 5) {
    filteredBank = [...fullBank];
  }

  // Filter by practice preference if specified
  if (practicePreference === 'word') {
    const wordsOnly = filteredBank.filter(ex => getExerciseVarietyBucket(ex) === 'word');
    if (wordsOnly.length > 0) filteredBank = wordsOnly;
  } else if (practicePreference === 'sentence') {
    const sentencesOnly = filteredBank.filter(ex => getExerciseVarietyBucket(ex) !== 'word');
    if (sentencesOnly.length > 0) filteredBank = sentencesOnly;
  }

  // Shuffle and select
  const shuffled = [...filteredBank].sort(() => Math.random() - 0.5);
  
  // Provide plenty of exercises so they don't run out before time expires
  // Aiming for a large buffer to ensure variety
  const count = Math.min(filteredBank.length, Math.max(30, sessionDurationMinutes * 10));
  const selected = shuffled.slice(0, count);

  // Apply mode-specific instructions
  selected.forEach((ex, i) => {
    let customInstruction = ex.instruction;
    
    // Customize instructions based on therapy mode
    if (therapyMode === 'fluency' || therapyMode === 'confidence') {
      if (ex.type === 'sentence_reading') {
        customInstruction = "Read with a steady rhythm and focused breathing";
      } else {
        customInstruction = "Speak gently and take your time";
      }
    } else if (therapyMode === 'accent') {
      customInstruction = "Focus on the melody and intonation of the phrase";
    } else if (therapyMode === 'child_development') {
      customInstruction = "Try to say this clearly and loudly!";
    }

    exercises.push({
      ...ex,
      instruction: customInstruction,
      id: `exercise-${i}-${Date.now()}`,
    });
  });

  return exercises;
};

// Get exercise type display name
export const getExerciseTypeName = (type: Exercise['type']): string => {
  const names: Record<Exercise['type'], string> = {
    pronunciation: 'Pronunciation',
    breathing: 'Breathing Exercise',
    tongue_twister: 'Tongue Twister',
    word_repetition: 'Word Practice',
    sentence_reading: 'Reading Aloud',
    minimal_pairs: 'Minimal Pairs',
    syllable_drill: 'Syllable Drill',
    intonation: 'Intonation Practice',
  };
  return names[type] || type;
};

// Get exercise icon
export const getExerciseIcon = (type: Exercise['type']): string => {
  const icons: Record<Exercise['type'], string> = {
    pronunciation: '🗣️',
    breathing: '🌬️',
    tongue_twister: '👅',
    word_repetition: '🔄',
    sentence_reading: '📖',
    minimal_pairs: '👂',
    syllable_drill: '🎵',
    intonation: '🎭',
  };
  return icons[type] || '🎯';
};
