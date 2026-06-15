package com.nextlevelcoder.config;

import com.nextlevelcoder.model.Achievement;
import com.nextlevelcoder.model.CodingProblem;
import com.nextlevelcoder.model.Course;
import com.nextlevelcoder.model.Topic;
import com.nextlevelcoder.model.Question;
import com.nextlevelcoder.repository.AchievementRepository;
import com.nextlevelcoder.repository.UserAchievementRepository;
import com.nextlevelcoder.repository.CodingProblemRepository;
import com.nextlevelcoder.repository.CourseRepository;
import com.nextlevelcoder.repository.SubmissionRepository;
import com.nextlevelcoder.repository.TopicRepository;
import com.nextlevelcoder.repository.QuestionRepository;
import com.nextlevelcoder.repository.QuizSubmissionRepository;
import com.nextlevelcoder.repository.BookmarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CodingProblemRepository codingProblemRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuizSubmissionRepository quizSubmissionRepository;

    @Autowired
    private AchievementRepository achievementRepository;

    @Autowired
    private UserAchievementRepository userAchievementRepository;

    @Autowired
    private BookmarkRepository bookmarkRepository;

    @Override
    public void run(String... args) throws Exception {
        userAchievementRepository.deleteAll();
        achievementRepository.deleteAll();
        bookmarkRepository.deleteAll();
        submissionRepository.deleteAll();
        codingProblemRepository.deleteAll();
        quizSubmissionRepository.deleteAll();
        questionRepository.deleteAll();
        topicRepository.deleteAll();
        courseRepository.deleteAll();

        // Seeding Achievements
        Achievement firstStep = Achievement.builder()
                .name("First Step")
                .description("Solved at least 1 coding problem")
                .criteriaType("PROBLEMS_SOLVED")
                .criteriaValue(1)
                .build();

        Achievement codeWarrior = Achievement.builder()
                .name("Code Warrior")
                .description("Solved 10 programming problems")
                .criteriaType("PROBLEMS_SOLVED")
                .criteriaValue(10)
                .build();

        Achievement xpTycoon = Achievement.builder()
                .name("XP Tycoon")
                .description("Earned 1000+ total XP points")
                .criteriaType("XP_EARNED")
                .criteriaValue(1000)
                .build();

        Achievement hotStreak = Achievement.builder()
                .name("Hot Streak")
                .description("Maintained a 3-day active coding streak")
                .criteriaType("STREAK_DAYS")
                .criteriaValue(3)
                .build();

        achievementRepository.saveAll(Arrays.asList(firstStep, codeWarrior, xpTycoon, hotStreak));

        // ── DIGITS PROBLEMS ───────────────────────────────────────────────────
        CodingProblem d1 = createProblem("Reverse a number", 
            "### Scenario\n"
            + "A time-capsule security device requires entering numeric authorization keys in reverse order to initiate a launch countdown. Write a utility to reverse the digits of a given number.\n"
            + "\n"
            + "### Input Format\n"
            + "A single integer, `N`.\n"
            + "\n"
            + "### Output Format\n"
            + "Print the reversed digits of the integer `N`. If `N` is negative, preserve the negative sign at the front.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `1234` -> **Output:** `4321`\n"
            + "* **Input:** `-56` -> **Output:** `-65`\n", 
            "Easy", "- `N` fits in integer range.\n");

        CodingProblem d2 = createProblem("Check palindrome number", 
            "### Scenario\n"
            + "A delivery drone checks its odometer reading. It only receives bonuses if the reading reads the same forwards and backwards (e.g. palindromic values). Help the drone verify if the odometer reading is a palindrome.\n"
            + "\n"
            + "### Input Format\n"
            + "A single integer, `N`.\n"
            + "\n"
            + "### Output Format\n"
            + "Print `Yes` if the number is a palindrome, otherwise print `No`.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `121` -> **Output:** `Yes` (reads 121 both ways)\n"
            + "* **Input:** `123` -> **Output:** `No` (reads 321 backwards)\n", 
            "Easy", "- `N >= 0`.\n");

        CodingProblem d3 = createProblem("Count digits in a number", 
            "### Scenario\n"
            + "A banking system scanner needs to count the number of digits in an account routing number to ensure it complies with standard bank formatting regulations.\n"
            + "\n"
            + "### Input Format\n"
            + "A single integer, `N`.\n"
            + "\n"
            + "### Output Format\n"
            + "Print the number of digits present in `N`.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `5061` -> **Output:** `4` (since 5, 0, 6, 1 are 4 digits)\n", 
            "Easy", "- `N` is a valid integer.\n");

        CodingProblem d4 = createProblem("Find sum of digits", 
            "### Scenario\n"
            + "A cryptocurrency wallet generates a validation checksum by summing up all the individual digits of a transaction ID.\n"
            + "\n"
            + "### Input Format\n"
            + "A single positive integer, `N`.\n"
            + "\n"
            + "### Output Format\n"
            + "Print the sum of the digits of `N`.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `123` -> **Output:** `6` (1 + 2 + 3 = 6)\n", 
            "Easy", "- Positive integer `N`.\n");

        CodingProblem d5 = createProblem("Find product of digits", 
            "### Scenario\n"
            + "An encryption algorithm scrambles numeric passcodes by calculating the product of their individual digits to generate a salt value.\n"
            + "\n"
            + "### Input Format\n"
            + "A single positive integer, `N`.\n"
            + "\n"
            + "### Output Format\n"
            + "Print the product of all digits of `N`.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `234` -> **Output:** `24` (2 * 3 * 4 = 24)\n", 
            "Easy", "- Positive integer `N`.\n");

        CodingProblem d6 = createProblem("Find largest digit", 
            "### Scenario\n"
            + "A smart thermostat scans all digits in a temperature telemetry packet and isolates the highest single reading digit.\n"
            + "\n"
            + "### Input Format\n"
            + "A single positive integer, `N`.\n"
            + "\n"
            + "### Output Format\n"
            + "Print the largest single digit present in `N`.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `175` -> **Output:** `7` (7 is greater than 1 and 5)\n", 
            "Easy", "- Positive integer `N`.\n");

        CodingProblem d7 = createProblem("Find smallest digit", 
            "### Scenario\n"
            + "A solar energy logger registers voltage readings and wants to isolate the smallest digit recorded in a peak measurement to identify dropouts.\n"
            + "\n"
            + "### Input Format\n"
            + "A single positive integer, `N`.\n"
            + "\n"
            + "### Output Format\n"
            + "Print the smallest single digit present in `N`.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `239` -> **Output:** `2` (2 is smaller than 3 and 9)\n", 
            "Easy", "- Positive integer `N`.\n");

        CodingProblem d8 = createProblem("Check Armstrong number", 
            "### Scenario\n"
            + "A chemistry simulator identifies stable atomic isotopes by checking if the sum of the cubes of a 3-digit atomic number equals the number itself.\n"
            + "\n"
            + "### Input Format\n"
            + "A 3-digit positive integer, `N`.\n"
            + "\n"
            + "### Output Format\n"
            + "Print `Yes` if `N` is an Armstrong number, otherwise `No`.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `153` -> **Output:** `Yes` (1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153)\n", 
            "Easy", "- 3-digit positive integer `N`.\n");

        CodingProblem d9 = createProblem("Check strong number", 
            "### Scenario\n"
            + "A cryptographic key vault accepts access tokens only if they are \"Strong numbers\" (where the sum of the factorials of their digits equals the number itself).\n"
            + "\n"
            + "### Input Format\n"
            + "A positive integer, `N`.\n"
            + "\n"
            + "### Output Format\n"
            + "Print `Yes` if `N` is a Strong number, otherwise `No`.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `145` -> **Output:** `Yes` (1! + 4! + 5! = 1 + 24 + 120 = 145)\n", 
            "Medium", "- Positive integer `N`.\n");

        CodingProblem d10 = createProblem("Print Fibonacci series using digits limit", 
            "### Scenario\n"
            + "A biology lab tracks rabbit population growth patterns. They need to print all Fibonacci numbers that have at most a specified digit length to fit onto their display panel.\n"
            + "\n"
            + "### Input Format\n"
            + "A single integer representing the maximum number of digits, `MaxDigits`.\n"
            + "\n"
            + "### Output Format\n"
            + "Print space-separated Fibonacci numbers starting from 0 that have at most `MaxDigits` digits.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `1` -> **Output:** `0 1 1 2 3 5 8` (13 is skipped as it has 2 digits)\n", 
            "Medium", "- `MaxDigits >= 1`.\n");

        // ── STRING PROBLEMS ───────────────────────────────────────────────────
        CodingProblem s1 = createProblem("Reverse a string", 
            "### Scenario\n"
            + "A text editor needs a utility that flips selected text characters backward to check for symmetric spelling structures.\n"
            + "\n"
            + "### Input Format\n"
            + "A single line string.\n"
            + "\n"
            + "### Output Format\n"
            + "Print the reversed string.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `hello` -> **Output:** `olleh`\n", 
            "Easy", "- String length <= 10^5.\n");

        CodingProblem s2 = createProblem("Check palindrome string", 
            "### Scenario\n"
            + "A DNA sequence scanner checks if a gene sequence is a palindrome (reads the same backwards and forwards) to determine its structural stability.\n"
            + "\n"
            + "### Input Format\n"
            + "A single word string.\n"
            + "\n"
            + "### Output Format\n"
            + "Print `Yes` if the string is a palindrome, otherwise `No`.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `radar` -> **Output:** `Yes`\n", 
            "Easy", "- Input string containing lowercase characters.\n");

        CodingProblem s3 = createProblem("Count vowels and consonants", 
            "### Scenario\n"
            + "A word game processor needs to count the number of vowels and consonants in a word to calculate the player's vocabulary score.\n"
            + "\n"
            + "### Input Format\n"
            + "A single word string.\n"
            + "\n"
            + "### Output Format\n"
            + "Print the count of vowels and the count of consonants separated by a space.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `hello` -> **Output:** `2 3` (Vowels: e, o; Consonants: h, l, l)\n", 
            "Easy", "- Single word containing alphabetic characters.\n");

        CodingProblem s4 = createProblem("Count words in a sentence", 
            "### Scenario\n"
            + "A blog post editor counts the number of words in a title to ensure it fits search engine result page length guidelines.\n"
            + "\n"
            + "### Input Format\n"
            + "A sentence string containing words separated by single spaces.\n"
            + "\n"
            + "### Output Format\n"
            + "Print the count of words in the sentence.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `Hello world from nextlevel` -> **Output:** `4`\n", 
            "Easy", "- Spaces separate words.\n");

        CodingProblem s5 = createProblem("Remove spaces from string", 
            "### Scenario\n"
            + "A URL shortener service cleans up human input by stripping all white spaces from a slug to make it URL-safe.\n"
            + "\n"
            + "### Input Format\n"
            + "A string containing spaces.\n"
            + "\n"
            + "### Output Format\n"
            + "Print the clean string after removing all spaces.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `a b c d` -> **Output:** `abcd`\n", 
            "Easy", "- String with characters and spaces.\n");

        CodingProblem s6 = createProblem("Find duplicate characters", 
            "### Scenario\n"
            + "A compressed data analyzer scans an ID string and reports which characters appear more than once, sorted alphabetically.\n"
            + "\n"
            + "### Input Format\n"
            + "A single word string.\n"
            + "\n"
            + "### Output Format\n"
            + "Print the duplicate characters in alphabetical order, separated by space.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `programming` -> **Output:** `g m r` (g, m, r appear multiple times)\n", 
            "Medium", "- Single word string.\n");

        CodingProblem s7 = createProblem("Find first non-repeating character", 
            "### Scenario\n"
            + "A network switch parses a header stream and isolates the first unique character command that does not repeat.\n"
            + "\n"
            + "### Input Format\n"
            + "A lowercase alphabetic string.\n"
            + "\n"
            + "### Output Format\n"
            + "Print the first non-repeating character. If all characters repeat, print `None`.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `swiss` -> **Output:** `w` (s and i repeat, w is the first unique character)\n", 
            "Medium", "- Lowercase alphabetic string.\n");

        CodingProblem s8 = createProblem("Convert lowercase to uppercase", 
            "### Scenario\n"
            + "A user profile manager formats standard usernames to uppercase letters to display them on a leaderboard header.\n"
            + "\n"
            + "### Input Format\n"
            + "A lowercase string.\n"
            + "\n"
            + "### Output Format\n"
            + "Print the string converted to uppercase.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `nextlevel` -> **Output:** `NEXTLEVEL`\n", 
            "Easy", "- Alphanumeric string.\n");

        CodingProblem s9 = createProblem("Check anagram strings", 
            "### Scenario\n"
            + "A word riddle generator checks if two words are anagrams of each other (rearranging the letters of one word forms the other).\n"
            + "\n"
            + "### Input Format\n"
            + "Two strings separated by a single space.\n"
            + "\n"
            + "### Output Format\n"
            + "Print `Yes` if they are anagrams, otherwise `No`.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `listen silent` -> **Output:** `Yes` (both contain the exact same letter counts)\n", 
            "Easy", "- Two space-separated words.\n");

        CodingProblem s10 = createProblem("Sort characters in a string", 
            "### Scenario\n"
            + "A dictionary indexer sorts the letters of a scrambled word alphabetically to help find matching anagrams in its database.\n"
            + "\n"
            + "### Input Format\n"
            + "A lowercase alphabetic string.\n"
            + "\n"
            + "### Output Format\n"
            + "Print the sorted characters as a single string.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `coder` -> **Output:** `cdeor`\n", 
            "Easy", "- Lowercase string.\n");

        // ── ARRAY PROBLEMS ────────────────────────────────────────────────────
        CodingProblem a1 = createProblem("Find largest element in array", 
            "### Scenario\n"
            + "A sensor hub scans telemetry inputs and finds the maximum peak value recorded in a series of measurements.\n"
            + "\n"
            + "### Input Format\n"
            + "A single line of space-separated integers representing the array.\n"
            + "\n"
            + "### Output Format\n"
            + "Print the largest integer element.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `4 9 2 15 6` -> **Output:** `15`\n", 
            "Easy", "- Non-empty array.\n");

        CodingProblem a2 = createProblem("Find smallest element in array", 
            "### Scenario\n"
            + "A temperature log monitor checks a list of hourly readings to locate the minimum temperature drop.\n"
            + "\n"
            + "### Input Format\n"
            + "A single line of space-separated integers representing the array.\n"
            + "\n"
            + "### Output Format\n"
            + "Print the smallest integer element.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `8 4 11 2 9` -> **Output:** `2`\n", 
            "Easy", "- Non-empty array.\n");

        CodingProblem a3 = createProblem("Find sum and average of array", 
            "### Scenario\n"
            + "An e-commerce dashboard sums up daily orders and calculates the average spend per transaction.\n"
            + "\n"
            + "### Input Format\n"
            + "A single line of space-separated integers representing the array.\n"
            + "\n"
            + "### Output Format\n"
            + "Print the sum and integer average of the elements, separated by a space.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `1 2 3 4 5` -> **Output:** `15 3` (Sum: 15, Avg: 15 / 5 = 3)\n", 
            "Easy", "- Non-empty array.\n");

        CodingProblem a4 = createProblem("Reverse an array", 
            "### Scenario\n"
            + "A media playlist manager flips the play order of songs so the user can hear their most recently added tracks first.\n"
            + "\n"
            + "### Input Format\n"
            + "A single line of space-separated integers representing the array.\n"
            + "\n"
            + "### Output Format\n"
            + "Print the elements in reversed order, separated by spaces.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `1 2 3 4` -> **Output:** `4 3 2 1`\n", 
            "Easy", "- Non-empty array.\n");

        CodingProblem a5 = createProblem("Sort array in ascending order", 
            "### Scenario\n"
            + "A warehouse logistics app sorts package weights in ascending order to load light packages before heavy ones.\n"
            + "\n"
            + "### Input Format\n"
            + "A single line of space-separated integers representing the array.\n"
            + "\n"
            + "### Output Format\n"
            + "Print the sorted elements, separated by spaces.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `5 2 9 1` -> **Output:** `1 2 5 9`\n", 
            "Easy", "- Non-empty array.\n");

        CodingProblem a6 = createProblem("Find second largest element", 
            "### Scenario\n"
            + "A game tournament organizer identifies the runner-up score in a list of leaderboards to award the silver medal.\n"
            + "\n"
            + "### Input Format\n"
            + "A single line of space-separated integers representing the array.\n"
            + "\n"
            + "### Output Format\n"
            + "Print the second largest element in the array.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `12 35 1 10 34` -> **Output:** `34` (Largest is 35, second largest is 34)\n", 
            "Medium", "- Array has at least 2 elements.\n");

        CodingProblem a7 = createProblem("Remove duplicate elements", 
            "### Scenario\n"
            + "An email subscriber list cleans up double entries to avoid sending promotional messages twice to the same user.\n"
            + "\n"
            + "### Input Format\n"
            + "A single line of space-separated integers representing the array.\n"
            + "\n"
            + "### Output Format\n"
            + "Print the unique elements in their original order of appearance, separated by spaces.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `1 2 2 3 4 4 5` -> **Output:** `1 2 3 4 5`\n", 
            "Medium", "- Elements can duplicate.\n");

        CodingProblem a8 = createProblem("Merge two arrays", 
            "### Scenario\n"
            + "An analytical tool merges two sorted databases of user IDs into a single sorted database.\n"
            + "\n"
            + "### Input Format\n"
            + "Two lines of space-separated integers representing two arrays.\n"
            + "\n"
            + "### Output Format\n"
            + "Print the merged, sorted elements of both arrays, separated by spaces.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:**\n"
            + "  `1 3 5`\n"
            + "  `2 4 6`\n"
            + "  -> **Output:** `1 2 3 4 5 6`\n", 
            "Medium", "- Non-empty arrays.\n");

        CodingProblem a9 = createProblem("Search element in array", 
            "### Scenario\n"
            + "A lookup script checks a catalog database of item IDs to check if a specific SKU exists.\n"
            + "\n"
            + "### Input Format\n"
            + "First line: space-separated integers representing the array.\n"
            + "Second line: the search key integer.\n"
            + "\n"
            + "### Output Format\n"
            + "Print the 0-based index of the search key if found, otherwise `-1`.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:**\n"
            + "  `10 20 30 40`\n"
            + "  `30`\n"
            + "  -> **Output:** `2` (30 is at index 2)\n", 
            "Easy", "- Array and search key.\n");

        CodingProblem a10 = createProblem("Count even and odd numbers in array", 
            "### Scenario\n"
            + "A data logger splits sensor packets into parity categories to optimize transmission bandwidth.\n"
            + "\n"
            + "### Input Format\n"
            + "A single line of space-separated integers representing the array.\n"
            + "\n"
            + "### Output Format\n"
            + "Print the count of even and odd numbers, separated by a space.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `1 2 3 4 5` -> **Output:** `2 3` (Even: 2, 4; Odd: 1, 3, 5)\n", 
            "Easy", "- Non-empty array.\n");

        // ── PATTERN PROBLEMS ──────────────────────────────────────────────────
        CodingProblem p1 = createProblem("Print star square pattern", 
            "### Scenario\n"
            + "A retro console rendering subsystem prints a pixel square grid layout of size `N` on the terminal.\n"
            + "\n"
            + "### Input Format\n"
            + "A single integer, `N`.\n"
            + "\n"
            + "### Output Format\n"
            + "Print a star square of size `N * N`.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `3` -> **Output:**\n"
            + "  `***`\n"
            + "  `***`\n"
            + "  `***`\n", 
            "Easy", "- `1 <= N <= 10`.\n");

        CodingProblem p2 = createProblem("Print right triangle star pattern", 
            "### Scenario\n"
            + "An LCD screensaver simulator draws a right-angled triangular design of height `N` using star characters.\n"
            + "\n"
            + "### Input Format\n"
            + "A single integer, `N`.\n"
            + "\n"
            + "### Output Format\n"
            + "Print a right-aligned triangle of stars of height `N`.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `3` -> **Output:**\n"
            + "  `*`\n"
            + "  `**`\n"
            + "  `***`\n", 
            "Easy", "- `1 <= N <= 10`.\n");

        CodingProblem p3 = createProblem("Print inverted triangle pattern", 
            "### Scenario\n"
            + "A CLI drawing tool prints an inverted right-angled star pyramid of height `N`.\n"
            + "\n"
            + "### Input Format\n"
            + "A single integer, `N`.\n"
            + "\n"
            + "### Output Format\n"
            + "Print an inverted triangle of stars of height `N`.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `3` -> **Output:**\n"
            + "  `***`\n"
            + "  `**`\n"
            + "  `*`\n", 
            "Easy", "- `1 <= N <= 10`.\n");

        CodingProblem p4 = createProblem("Print pyramid pattern", 
            "### Scenario\n"
            + "An artistic text formatter draws a symmetrical star pyramid of height `N` for a banner layout.\n"
            + "\n"
            + "### Input Format\n"
            + "A single integer, `N`.\n"
            + "\n"
            + "### Output Format\n"
            + "Print a star pyramid of height `N` using space padding for formatting alignment.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `3` -> **Output:**\n"
            + "  `  *`\n"
            + "  ` ***`\n"
            + "  `*****`\n", 
            "Medium", "- `1 <= N <= 10`.\n");

        CodingProblem p5 = createProblem("Print diamond pattern", 
            "### Scenario\n"
            + "A layout engine renders a diamond-shaped border pattern of half-height `N` using star icons.\n"
            + "\n"
            + "### Input Format\n"
            + "A single integer, `N` (half-height).\n"
            + "\n"
            + "### Output Format\n"
            + "Print a star diamond pattern of size `N`.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `2` -> **Output:**\n"
            + "  ` *`\n"
            + "  `***`\n"
            + "  ` *`\n", 
            "Medium", "- `1 <= N <= 10`.\n");

        CodingProblem p6 = createProblem("Print Floyd’s triangle", 
            "### Scenario\n"
            + "A mathematical display writes Floyd's triangle sequence up to `N` rows using incrementing integers.\n"
            + "\n"
            + "### Input Format\n"
            + "A single integer, `N`.\n"
            + "\n"
            + "### Output Format\n"
            + "Print Floyd's triangle of height `N`.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `3` -> **Output:**\n"
            + "  `1`\n"
            + "  `2 3`\n"
            + "  `4 5 6`\n", 
            "Easy", "- `1 <= N <= 10`.\n");

        CodingProblem p7 = createProblem("Print Pascal triangle", 
            "### Scenario\n"
            + "A statistics software renders Pascal's triangle of height `N` to calculate binomial coefficients.\n"
            + "\n"
            + "### Input Format\n"
            + "A single integer, `N`.\n"
            + "\n"
            + "### Output Format\n"
            + "Print Pascal's triangle of height `N` using space formatting.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `3` -> **Output:**\n"
            + "  `1`\n"
            + "  `1 1`\n"
            + "  `1 2 1`\n", 
            "Medium", "- `1 <= N <= 10`.\n");

        CodingProblem p8 = createProblem("Print number increasing pattern", 
            "### Scenario\n"
            + "A teaching aid CLI draws a triangular grid of ascending numbers of height `N` to help children learn digits.\n"
            + "\n"
            + "### Input Format\n"
            + "A single integer, `N`.\n"
            + "\n"
            + "### Output Format\n"
            + "Print a number increasing triangle pattern of height `N`.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `3` -> **Output:**\n"
            + "  `1`\n"
            + "  `1 2`\n"
            + "  `1 2 3`\n", 
            "Easy", "- `1 <= N <= 10`.\n");

        CodingProblem p9 = createProblem("Print alphabet pattern", 
            "### Scenario\n"
            + "A word processor outputs an alphabet design where each row is composed of repeating characters corresponding to the row index.\n"
            + "\n"
            + "### Input Format\n"
            + "A single integer, `N`.\n"
            + "\n"
            + "### Output Format\n"
            + "Print an alphabet triangle pattern of height `N`.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `3` -> **Output:**\n"
            + "  `A`\n"
            + "  `B B`\n"
            + "  `C C C`\n", 
            "Easy", "- `1 <= N <= 26`.\n");

        CodingProblem p10 = createProblem("Print hollow square pattern", 
            "### Scenario\n"
            + "A screen layout widget prints a hollow border pattern of size `N` to act as a placeholder grid box.\n"
            + "\n"
            + "### Input Format\n"
            + "A single integer, `N`.\n"
            + "\n"
            + "### Output Format\n"
            + "Print a hollow square star pattern of size `N`.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `3` -> **Output:**\n"
            + "  `***`\n"
            + "  `* *`\n"
            + "  `***`\n", 
            "Medium", "- `1 <= N <= 10`.\n");

        CodingProblem sql1 = createSqlProblem("High salary employees",
            "### Scenario\n"
            + "An HR auditing team wants to identify high-earning staff members who make more than 60,000 annually. They need this sorted by highest salary first.\n"
            + "\n"
            + "### Input Format\n"
            + "Table: `employees`\n"
            + "* `id` (INT)\n"
            + "* `name` (VARCHAR)\n"
            + "* `salary` (INT)\n"
            + "* `department_id` (INT)\n"
            + "\n"
            + "### Output Format\n"
            + "A list of employee names and salaries matching the condition, ordered by salary descending.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* High earners earning > 60,000 will be selected and ordered from highest to lowest. \n",
            "Easy",
            "- `salary` is a positive integer.\n",
            "-- Write your SQL query here\nSELECT name, salary FROM employees WHERE ...\n");

        CodingProblem sql2 = createSqlProblem("Department headcounts",
            "### Scenario\n"
            + "A corporate department manager needs to know how many employees work in each department (including departments with no employees).\n"
            + "\n"
            + "### Input Format\n"
            + "Table: `departments`\n"
            + "* `id` (INT)\n"
            + "* `name` (VARCHAR)\n"
            + "\n"
            + "Table: `employees`\n"
            + "* `id` (INT)\n"
            + "* `name` (VARCHAR)\n"
            + "* `salary` (INT)\n"
            + "* `department_id` (INT)\n"
            + "\n"
            + "### Output Format\n"
            + "The department name and its employee headcount, ordered by headcount descending, then alphabetically by department name.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* Departments are joined with employees, counting the occurrences, including departments with 0 headcounts.\n",
            "Medium",
            "- `department_id` references `id` in departments.\n",
            "-- Write your SQL query here\n");

        CodingProblem sql3 = createSqlProblem("Duplicate emails",
            "### Scenario\n"
            + "A newsletter marketing manager wants to clean up duplicate entries in their email subscriber database to prevent double-emailing.\n"
            + "\n"
            + "### Input Format\n"
            + "Table: `users`\n"
            + "* `id` (INT)\n"
            + "* `email` (VARCHAR)\n"
            + "\n"
            + "### Output Format\n"
            + "A list of duplicate email addresses that appear more than once.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* Queries email groupings having count > 1. \n",
            "Easy",
            "- `email` is non-null.\n",
            "-- Write your SQL query here\n");

        CodingProblem d11 = createProblem("Calculate Factorial",
            "### Scenario\n"
            + "A logistics package calculates the total possible permutations of items in a cargo queue of length `N`.\n"
            + "\n"
            + "### Input Format\n"
            + "A single integer, `N`.\n"
            + "\n"
            + "### Output Format\n"
            + "Print the factorial of `N`.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:** `5` -> **Output:** `120` (5 * 4 * 3 * 2 * 1 = 120)\n",
            "Easy", "- `0 <= N <= 12`.\n");

        CodingProblem a11 = createProblem("Binary Search Element",
            "### Scenario\n"
            + "An ultra-fast lookup index scans a pre-sorted dictionary of ID hashes using binary search to minimize memory reads.\n"
            + "\n"
            + "### Input Format\n"
            + "First line: space-separated integers representing the sorted array.\n"
            + "Second line: the target search key.\n"
            + "\n"
            + "### Output Format\n"
            + "Print the 0-based index of the target key if found, otherwise `-1`.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* **Input:**\n"
            + "  `1 3 5 7 9`\n"
            + "  `5`\n"
            + "  -> **Output:** `2`\n",
            "Medium", "- Array is sorted.\n");

        CodingProblem sql4 = createSqlProblem("Find Customers Who Never Ordered",
            "### Scenario\n"
            + "A marketing campaign team wants to identify inactive customers who have registered accounts but have never placed any orders.\n"
            + "\n"
            + "### Input Format\n"
            + "Table: `customers`\n"
            + "* `id` (INT)\n"
            + "* `name` (VARCHAR)\n"
            + "\n"
            + "Table: `orders`\n"
            + "* `id` (INT)\n"
            + "* `customer_id` (INT)\n"
            + "\n"
            + "### Output Format\n"
            + "A list of customer names who have no entries in the orders table.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* Isolates customer IDs not found in the orders list. \n",
            "Easy",
            "- `customer_id` references `id` in customers.\n",
            "-- Write your SQL query here\n");

        CodingProblem sql5 = createSqlProblem("Rank Salaries by Department",
            "### Scenario\n"
            + "A compensation specialist wants to rank employee salaries within each department without leaving gaps in ranks.\n"
            + "\n"
            + "### Input Format\n"
            + "Table: `employees`\n"
            + "* `id` (INT)\n"
            + "* `name` (VARCHAR)\n"
            + "* `salary` (INT)\n"
            + "* `department_id` (INT)\n"
            + "\n"
            + "### Output Format\n"
            + "A list containing `department_id`, `name`, `salary`, and their rank order within their department.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* Calculates ranks partitioned by department and sorted by salary descending.\n",
            "Medium",
            "- Rank should have no gaps (Dense Rank).\n",
            "-- Write your SQL query here\n");

        CodingProblem html1 = CodingProblem.builder()
            .title("Create a Centered Flexbox Card")
            .description("### Scenario\n"
            + "A UI designer has created a login card wireframe. You need to center the login card container dead-center on the screen using CSS Flexbox.\n"
            + "\n"
            + "### Input Format\n"
            + "HTML elements with class `.card` inside a container.\n"
            + "\n"
            + "### Output Format\n"
            + "CSS stylesheet styling centering the card container horizontally and vertically on the viewport.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* The page viewport must align items in the absolute center using flex attributes.\n")
            .difficulty("Easy")
            .constraints("- Flexbox layout rules must be used.\n")
            .javascriptTemplate("<!-- Write your HTML/CSS code here -->\n<div class=\"card\">\n  <h2>Centered Card</h2>\n  <p>Modify this layout to be centered using Flexbox styling.</p>\n</div>\n\n<style>\nbody {\n  /* Set up flexbox here to center the card */\n}\n\n.card {\n  background: #1e293b;\n  color: white;\n  padding: 20px;\n  border-radius: 12px;\n  width: 250px;\n}\n</style>")
            .build();

        CodingProblem html2 = CodingProblem.builder()
            .title("Responsive 3-Column Grid Layout")
            .description("### Scenario\n"
            + "You are building a responsive web dashboard. The card columns should be displayed in a 3-column layout on desktops, but stack in a single vertical column on mobile devices (width < 600px).\n"
            + "\n"
            + "### Input Format\n"
            + "A grid container with class `.grid-container` containing three items.\n"
            + "\n"
            + "### Output Format\n"
            + "CSS rules configuring a grid layout that shifts automatically via media queries.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* Grid columns display as `grid-template-columns: repeat(3, 1fr)` and fall back to a single column on mobile screen bounds.\n")
            .difficulty("Medium")
            .constraints("- Media query breakpoint must trigger at screen widths smaller than 600px.\n")
            .javascriptTemplate("<!-- Create a grid container with 3 columns, dropping to 1 column on screens smaller than 600px -->\n<div class=\"grid-container\">\n  <div class=\"grid-item\">1</div>\n  <div class=\"grid-item\">2</div>\n  <div class=\"grid-item\">3</div>\n</div>\n\n<style>\n.grid-container {\n  /* Add grid container styles here */\n}\n.grid-item {\n  background: #334155;\n  color: white;\n  padding: 30px;\n  text-align: center;\n  border-radius: 8px;\n}\n/* Add media queries below */\n</style>")
            .build();

        CodingProblem html3 = CodingProblem.builder()
            .title("Style a Custom Form Button")
            .description("### Scenario\n"
            + "A signup form requires an eye-catching submit button. Style a standard button element to look modern, using a custom color background and rounded corners.\n"
            + "\n"
            + "### Input Format\n"
            + "An HTML button element with class `.custom-btn`.\n"
            + "\n"
            + "### Output Format\n"
            + "CSS styling defining background-color, border-radius, padding, and hover transitions.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* A button styled with a rounded border and attractive background contrast.\n")
            .difficulty("Easy")
            .constraints("- Rounded corners and background properties must be present.\n")
            .javascriptTemplate("<!-- Create and style a custom form button -->\n<button class=\"custom-btn\">Click Me</button>\n\n<style>\n.custom-btn {\n  /* Style background, text color, padding, and rounded corners here */\n}\n</style>")
            .build();

        CodingProblem html4 = CodingProblem.builder()
            .title("HTML Form with Validation")
            .description("### Scenario\n"
            + "An account signup screen needs a native validated email form to prevent users from submitting incomplete details.\n"
            + "\n"
            + "### Input Format\n"
            + "Form fields for Username and Email.\n"
            + "\n"
            + "### Output Format\n"
            + "Validated HTML5 input elements containing `required` and `type=\"email\"` validations.\n"
            + "\n"
            + "### Sample Case Explanation\n"
            + "* A validation trigger kicks in if the input email does not contain `@` or is submitted empty.\n")
            .difficulty("Medium")
            .constraints("- Valid HTML5 elements and required attributes must be used.\n")
            .javascriptTemplate("<!-- Create a simple login form with validated inputs -->\n<form>\n  <!-- Add input elements for Name and Email here -->\n  \n  <button type=\"submit\">Submit</button>\n</form>\n\n<style>\nform {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  max-width: 300px;\n}\ninput {\n  padding: 8px;\n  border-radius: 6px;\n  border: 1px solid #475569;\n}\n</style>")
            .build();

        codingProblemRepository.saveAll(Arrays.asList(
            d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11,
            s1, s2, s3, s4, s5, s6, s7, s8, s9, s10,
            a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11,
            p1, p2, p3, p4, p5, p6, p7, p8, p9, p10,
            sql1, sql2, sql3, sql4, sql5,
            html1, html2, html3, html4
        ));

        // Seeding Courses
        Course javaFund = Course.builder()
                .title("Java Fundamentals")
                .description("Learn the core concepts of Java programming: variables, syntax, conditionals, loops, and object-oriented principles.")
                .difficulty("Basic")
                .build();

        Course dsa = Course.builder()
                .title("Data Structures & Algorithms")
                .description("Learn memory layouts, complexity analysis (Big O), lists, stacks, queues, trees, search, and sorting algorithms.")
                .difficulty("Medium")
                .build();

        Course systemDesign = Course.builder()
                .title("System Design")
                .description("Master horizontal scaling, load balancers, CDNs, caching layers, SQL vs NoSQL, replication, and high availability.")
                .difficulty("Advanced")
                .build();

        Course htmlCss = Course.builder()
                .title("HTML & CSS")
                .description("Master structuring web pages with semantic HTML and styling them with responsive layouts using CSS Flexbox and media queries.")
                .difficulty("Basic")
                .build();

        Course javascript = Course.builder()
                .title("JavaScript")
                .description("Learn dynamic client-side programming, including functions, control flow, events, DOM manipulation, and essential array/string methods.")
                .difficulty("Medium")
                .build();

        courseRepository.saveAll(Arrays.asList(javaFund, dsa, systemDesign, htmlCss, javascript));

        // Seeding Java Fundamentals Topics
        Topic j1 = Topic.builder()
                .course(javaFund)
                .title("Syntax, Variables & Types")
                .concept("Java is a strongly typed, class-based object-oriented language. Every application begins execution inside the `main` method of a class.\n\n### Key Syntax Rules:\n- Semicolons: Every statement must end with a semicolon `;`.\n- Case Sensitivity: Java is case-sensitive (`myVar` and `myvar` are different).\n- Class Names: Must start with an uppercase letter and match the filename.\n\n### Variables & Primitive Data Types:\nVariables are containers for storing data values. In Java, there are 8 primitive types:\n1. `byte` (1 byte): Stores integers from -128 to 127.\n2. `short` (2 bytes): Stores integers from -32,768 to 32,767.\n3. `int` (4 bytes): Stores integers from -2B to 2B.\n4. `long` (8 bytes): Stores integers for larger ranges (append 'L').\n5. `float` (4 bytes): Stores fractional numbers up to 6-7 decimal digits (append 'f').\n6. `double` (8 bytes): Stores fractional numbers up to 15 decimal digits.\n7. `boolean` (1 bit): Stores `true` or `false` values.\n8. `char` (2 bytes): Stores a single character/ASCII value enclosed in single quotes like 'A'.\n\n### Type Casting:\nType casting is when you assign a value of one primitive data type to another type.\n- **Widening Casting (automatically)**: converting a smaller type to a larger type size.\n  `byte` -> `short` -> `char` -> `int` -> `long` -> `float` -> `double`\n- **Narrowing Casting (manually)**: converting a larger type to a smaller type size.\n  `double` -> `float` -> `long` -> `int` -> `char` -> `short` -> `byte`")
                .examples("public class Main {\n    public static void main(String[] args) {\n        // Variables\n        int myNum = 15;\n        double myDoubleNum = 5.99;\n        char myLetter = 'D';\n        boolean myBool = true;\n        String myText = \"Hello\";\n\n        // Widening Casting\n        int myInt = 9;\n        double castedDouble = myInt; // Automatic casting: int to double\n\n        // Narrowing Casting\n        double myDouble = 9.78d;\n        int castedInt = (int) myDouble; // Manual casting: double to int (value is 9)\n\n        System.out.println(\"Integer: \" + myNum);\n        System.out.println(\"Casted double: \" + castedDouble);\n        System.out.println(\"Casted int: \" + castedInt);\n    }\n}")
                .notes("Non-primitive data types are called reference types because they refer to objects (e.g., Strings, Arrays, Classes).")
                .sequenceOrder(1)
                .build();

        Topic j2 = Topic.builder()
                .course(javaFund)
                .title("Operators & Expressions")
                .concept("Operators are used to perform operations on variables and values. Java groups operators into the following categories:\n\n### 1. Arithmetic Operators:\n- `+` Addition: Adds two values\n- `-` Subtraction: Subtracts one value from another\n- `*` Multiplication: Multiplies two values\n- `/` Division: Divides one value by another (Note: integer division truncates fractions)\n- `%` Modulus: Returns the division remainder\n- `++` Increment: Increases the value of a variable by 1\n- `--` Decrement: Decreases the value of a variable by 1\n\n### 2. Assignment Operators:\n- `=` Assigns values\n- `+=` Add and assign (`x += 3` is equivalent to `x = x + 3`)\n- `-=`, `*=`, `/=`, `%=` similarly.\n\n### 3. Comparison Operators:\n- `==` Equal to\n- `!=` Not equal to\n- `>` Greater than, `<` Less than\n- `>=` Greater than or equal to, `<=` Less than or equal to\n\n### 4. Logical Operators:\n- `&&` Logical AND: Returns true if both statements are true\n- `||` Logical OR: Returns true if one of the statements is true\n- `!` Logical NOT: Reverse the result (returns false if the result is true)")
                .examples("int x = 10;\nint y = 3;\n\nint sum = x + y;       // 13\nint quotient = x / y;  // 3 (integer division)\nint remainder = x % y; // 1\n\nboolean isGreater = x > y;      // true\nboolean checkLogical = (x > 5 && y < 5); // true")
                .notes("Be careful with integer division! To get a decimal value, at least one of the operands must be a double or float: `double result = (double) 10 / 3;`.")
                .sequenceOrder(2)
                .build();

        Topic j3 = Topic.builder()
                .course(javaFund)
                .title("Strings & Common Methods")
                .concept("A `String` in Java is an object that represents a sequence of characters. Strings are immutable, meaning their values cannot be changed once created.\n\n### Common String Methods (w3schools Reference):\n\n| Method | Description | Return Type |\n| :--- | :--- | :--- |\n| `length()` | Returns the number of characters in the string | `int` |\n| `charAt(int index)` | Returns the character at the specified index | `char` |\n| `substring(int start, int end)` | Returns a new string that is a substring of this string | `String` |\n| `indexOf(String str)` | Returns the index of the first occurrence of the specified substring | `int` |\n| `toUpperCase()` / `toLowerCase()` | Converts all characters to uppercase / lowercase | `String` |\n| `replace(char old, char new)` | Returns a string replacing all occurrences of old character with new | `String` |\n| `trim()` | Removes whitespace from both ends of the string | `String` |\n| `equals(Object obj)` | Compares two strings for equality (value comparison) | `boolean` |\n| `equalsIgnoreCase(String str)` | Compares two strings, ignoring case considerations | `boolean` |\n| `contains(CharSequence s)` | Checks if the string contains the specified sequence of characters | `boolean` |")
                .examples("String txt = \"Hello World\";\nSystem.out.println(\"Length: \" + txt.length()); // 11\nSystem.out.println(\"Upper: \" + txt.toUpperCase()); // \"HELLO WORLD\"\nSystem.out.println(\"Char at index 1: \" + txt.charAt(1)); // 'e'\nSystem.out.println(\"Index of 'o': \" + txt.indexOf(\"o\")); // 4\nSystem.out.println(\"Substring [0,5): \" + txt.substring(0, 5)); // \"Hello\"\n\nString s1 = \"java\";\nString s2 = \"Java\";\nSystem.out.println(\"Equals: \" + s1.equals(s2)); // false\nSystem.out.println(\"EqualsIgnoreCase: \" + s1.equalsIgnoreCase(s2)); // true")
                .notes("Always use `.equals()` to compare strings for value equality. Using `==` compares their memory references (object addresses), which can lead to bugs.")
                .sequenceOrder(3)
                .build();

        Topic j4 = Topic.builder()
                .course(javaFund)
                .title("Math Functions & Utilities")
                .concept("The Java Math class has many methods that allow you to perform mathematical tasks on numbers.\n\n### Common Math Methods:\n- `Math.max(x, y)`: Returns the highest value of x and y.\n- `Math.min(x, y)`: Returns the lowest value of x and y.\n- `Math.abs(x)`: Returns the absolute (positive) value of x.\n- `Math.sqrt(x)`: Returns the square root of x.\n- `Math.pow(x, y)`: Returns the value of x raised to the power of y.\n- `Math.round(x)`: Rounds a floating-point number to its nearest integer.\n- `Math.ceil(x)`: Rounds a number UP to the nearest integer.\n- `Math.floor(x)`: Rounds a number DOWN to the nearest integer.\n- `Math.random()`: Returns a random double value greater than or equal to 0.0 and less than 1.0.")
                .examples("int maxVal = Math.max(5, 10);      // 10\ndouble squareRoot = Math.sqrt(64); // 8.0\nint absVal = Math.abs(-47);        // 47\ndouble power = Math.pow(2, 3);     // 8.0\n\n// Generate random number between 0 and 100:\nint randomNum = (int)(Math.random() * 101);")
                .notes("The Math class is part of the `java.lang` package, so you do not need to import it explicitly in your classes.")
                .sequenceOrder(4)
                .build();

        Topic j5 = Topic.builder()
                .course(javaFund)
                .title("Control Flow & Loops")
                .concept("Control structures direct the flow of execution based on logic and conditional states.\n\n### 1. Conditionals:\n- `if-else`: Executes a block if a condition is true, otherwise executes the else block.\n- `switch`: Selects one of many code blocks to be executed, comparing a variable against multiple `case` values.\n\n### 2. Loops:\n- `while`: Loops through a block of code as long as a specified condition is true.\n- `do-while`: Executes the block once before checking the condition, then repeats as long as the condition is true.\n- `for`: Best when you know exactly how many times you want to loop.\n- `for-each` (enhanced for): Used exclusively to loop through elements in an array or collection.\n\n### 3. Loop Control Statements:\n- `break`: Jumps out of a loop/switch completely.\n- `continue`: Skips the current iteration and moves to the next check/loop step.")
                .examples("int day = 4;\nswitch (day) {\n    case 1 -> System.out.println(\"Monday\");\n    case 4 -> System.out.println(\"Thursday\");\n    default -> System.out.println(\"Weekend!\");\n}\n\n// For loop\nfor (int i = 0; i < 5; i++) {\n    if (i == 2) continue; // Skip 2\n    if (i == 4) break;    // Exit loop\n    System.out.print(i + \" \");\n}\n// Output: 0 1 3")
                .notes("Switch statements in modern Java (14+) support arrow syntax `case ->` which automatically breaks and prevents fall-through behavior.")
                .sequenceOrder(5)
                .build();

        Topic j6 = Topic.builder()
                .course(javaFund)
                .title("Arrays & Helper Methods")
                .concept("Arrays are used to store multiple values in a single variable, instead of declaring separate variables for each value.\n\n### Array Fundamentals:\n- Fixed size: Once created, the size of an array cannot be modified.\n- 0-indexed: The first element is at index 0, last is at index `length - 1`.\n- Multidimensional: Arrays of arrays (e.g., a grid/matrix: `int[][] matrix`).\n\n### Common Arrays Helper Methods (`java.util.Arrays`):\n- `Arrays.toString(arr)`: Converts array elements into a readable comma-separated string.\n- `Arrays.sort(arr)`: Sorts elements in ascending order in-place.\n- `Arrays.binarySearch(arr, key)`: Finds index of element (array MUST be sorted first).\n- `Arrays.equals(arr1, arr2)`: Compares if two arrays have equal lengths and matching values at corresponding indexes.\n- `Arrays.copyOf(arr, newLength)`: Copies and resizes array (pads with default values if larger).")
                .examples("import java.util.Arrays;\n\npublic class ArrayDemo {\n    public static void main(String[] args) {\n        String[] cars = {\"Volvo\", \"BMW\", \"Ford\", \"Mazda\"};\n        int[] numbers = {10, 5, 20, 15};\n\n        // Convert array to string for printing\n        System.out.println(Arrays.toString(cars));\n\n        // Sort arrays\n        Arrays.sort(numbers);\n        System.out.println(Arrays.toString(numbers)); // [5, 10, 15, 20]\n\n        // Binary Search\n        int index = Arrays.binarySearch(numbers, 15);\n        System.out.println(\"Index of 15: \" + index); // 2\n    }\n}")
                .notes("Attempting to access an index outside the array bounds will throw an `ArrayIndexOutOfBoundsException` at runtime.")
                .sequenceOrder(6)
                .build();

        Topic j7 = Topic.builder()
                .course(javaFund)
                .title("Methods, Overloading & Scope")
                .concept("A method is a block of code which only runs when it is called. You can pass data (parameters) into a method, and it can return data as a result.\n\n### Key Concepts:\n- **Parameters & Arguments**: Parameters act as variables inside the method. Arguments are the actual values passed to the method when invoked.\n- **Method Overloading**: Multiple methods can have the same name as long as they have a different number or type of parameters (different signature).\n- **Scope**: Variables declared inside a block or method are only accessible inside that block (local variables).\n- **Recursion**: The technique of making a function call itself, useful for breaking down complex mathematical or search problems.")
                .examples("public class MethodDemo {\n    // Overloaded method for integers\n    static int plusMethod(int x, int y) {\n        return x + y;\n    }\n\n    // Overloaded method for doubles\n    static double plusMethod(double x, double y) {\n        return x + y;\n    }\n\n    // Recursive method\n    static int sum(int k) {\n        if (k > 0) {\n            return k + sum(k - 1);\n        } else {\n            return 0;\n        }\n    }\n\n    public static void main(String[] args) {\n        System.out.println(plusMethod(8, 5));      // Calls int version -> 13\n        System.out.println(plusMethod(4.3, 6.26)); // Calls double version -> 10.56\n        System.out.println(sum(10));               // 55\n    }\n}")
                .notes("In Java, arguments are always passed by value, meaning the method receives a copy of the argument's value (or reference address for objects), not the actual variable itself.")
                .sequenceOrder(7)
                .build();

        Topic j8 = Topic.builder()
                .course(javaFund)
                .title("OOP Principles & Classes")
                .concept("Java is an Object-Oriented Programming (OOP) language. OOP divides program designs into blueprint templates (Classes) and functional instances (Objects).\n\n### The 4 Pillars of OOP:\n1. **Inheritance**: A class inherits attributes and methods from another class (using `extends`).\n2. **Polymorphism**: The ability of an object to take on many forms, allowing a subclass to override superclass methods.\n3. **Encapsulation**: Hiding sensitive data from users by making variables `private` and exposing them only via public getter and setter methods.\n4. **Abstraction**: Hiding implementation details and showing only the essential features of an object (using `abstract` classes or `interface` types).\n\n### Core OOP Syntax:\n- **Constructor**: A special method used to initialize objects, called automatically when an object is created using `new`.\n- **Access Modifiers**: `public` (accessible everywhere), `private` (accessible only within the class), `protected` (accessible in the same package and subclasses).")
                .examples("// Class Definition\nclass Animal {\n    public void animalSound() {\n        System.out.println(\"The animal makes a sound\");\n    }\n}\n\n// Inheritance & Polymorphism\nclass Pig extends Animal {\n    @Override\n    public void animalSound() {\n        System.out.println(\"The pig says: wee wee\");\n    }\n}\n\npublic class OOPDemo {\n    public static void main(String[] args) {\n        Animal myAnimal = new Animal();\n        Animal myPig = new Pig();\n        myAnimal.animalSound(); // \"The animal makes a sound\"\n        myPig.animalSound();    // \"The pig says: wee wee\"\n    }\n}")
                .notes("An Interface is a completely abstract class that only contains abstract methods. A class implements an interface using the `implements` keyword.")
                .sequenceOrder(8)
                .build();

        topicRepository.saveAll(Arrays.asList(
                j1, j2, j3, j4, j5, j6, j7, j8
        ));
        topicRepository.saveAll(getSystemDesignTopicsList(systemDesign));
        topicRepository.saveAll(getHtmlCssTopicsList(htmlCss));
        topicRepository.saveAll(getJavascriptTopicsList(javascript));
        topicRepository.saveAll(getDsaTopicsList(dsa));
        System.out.println("Courses and Topics seeded successfully!");

        // Seeding quiz questions
        Question q1 = Question.builder()
                .topic(j1)
                .type("MCQ")
                .title("Java Primitive Types")
                .description("Which of the following is NOT a primitive data type in Java?")
                .options("[\"int\", \"boolean\", \"String\", \"char\"]")
                .correctAnswer("String")
                .difficulty("Easy")
                .xpReward(10)
                .build();

        Question q2 = Question.builder()
                .topic(j1)
                .type("FILL_BLANK")
                .title("Automatic Type Casting")
                .description("Converting a smaller type to a larger type size automatically is called ________ casting (lowercase).")
                .correctAnswer("widening")
                .difficulty("Easy")
                .xpReward(15)
                .build();

        Question q3 = Question.builder()
                .topic(j2)
                .type("MCQ")
                .title("Modulus Operator")
                .description("What is the output of the expression `10 % 3` in Java?")
                .options("[\"3\", \"1\", \"0.33\", \"0\"]")
                .correctAnswer("1")
                .difficulty("Easy")
                .xpReward(10)
                .build();

        Question q4 = Question.builder()
                .topic(j5)
                .type("MCQ")
                .title("Loop Control")
                .description("Which statement is used to skip the current iteration of a loop and continue with the next check?")
                .options("[\"break\", \"continue\", \"skip\", \"return\"]")
                .correctAnswer("continue")
                .difficulty("Easy")
                .xpReward(10)
                .build();

        questionRepository.saveAll(Arrays.asList(q1, q2, q3, q4));
        System.out.println("Questions seeded successfully!");
    }

    private List<Topic> getDsaTopicsList(Course dsa) {
        List<Topic> list = new ArrayList<>();
        
        // --- Module 1: Foundations ---
        list.add(Topic.builder()
                .course(dsa)
                .title("Time Complexity & Big O")
                .concept("Big O notation evaluates the performance and scaling efficiency of your algorithms relative to input size N.\n\n### Common Scales:\n- O(1): Constant Time (e.g., array index lookup)\n- O(log N): Logarithmic Time (e.g., Binary Search)\n- O(N): Linear Time (e.g., single loop scan)\n- O(N log N): Linearithmic Time (e.g., Merge Sort)\n- O(N^2): Quadratic Time (e.g., nested loops, Bubble Sort)")
                .examples("int sum = 0;\nfor (int i = 0; i < N; i++) {\n    sum += i; // Runs N times -> O(N)\n}")
                .notes("Focus on dominant terms and ignore constants. O(2N + 10) simplifies to O(N).")
                .sequenceOrder(1)
                .build());

        list.add(Topic.builder()
                .course(dsa)
                .title("Arrays & Contiguous Memory")
                .concept("Arrays store a fixed-size sequential collection of elements of the same type. Elements are stored in contiguous memory locations.\n\n### Complexity:\n- **Access**: O(1) via direct indexing.\n- **Search**: O(N) linear scan (or O(log N) if sorted).\n- **Insertion/Deletion**: O(N) due to shifting elements.")
                .examples("int[] arr = {1, 2, 3};\nint element = arr[1]; // Accesses index 1 in O(1)")
                .notes("Array capacity cannot be dynamically changed in Java. Use ArrayList for dynamic sizing.")
                .sequenceOrder(2)
                .build());

        list.add(Topic.builder()
                .course(dsa)
                .title("Strings & Char Processing")
                .concept("Strings are sequences of characters. In Java, Strings are immutable objects, meaning modifications create new string objects.\n\n### Key Operations:\n- `charAt(index)`: O(1) character access.\n- `substring(start, end)`: O(N) copy.\n- String Concatenation: O(N) copying overhead.")
                .examples("String str = \"DSA\";\nchar c = str.charAt(0); // 'D'\nStringBuilder sb = new StringBuilder(); // Mutable replacement")
                .notes("Use `StringBuilder` or `StringBuffer` for intensive string manipulation loops to avoid heap overhead.")
                .sequenceOrder(3)
                .build());

        list.add(Topic.builder()
                .course(dsa)
                .title("Recursion & Call Stack")
                .concept("Recursion is a method calling itself to solve smaller subproblems. Every recursive function must contain:\n1. **Base Case**: The condition where recursion stops.\n2. **Recursive Step**: Calling itself with reduced arguments.")
                .examples("int factorial(int n) {\n    if (n <= 1) return 1; // Base case\n    return n * factorial(n - 1); // Recursive call\n}")
                .notes("Excessive recursion depth triggers `StackOverflowError` due to call stack limit exhaustion.")
                .sequenceOrder(4)
                .build());

        list.add(Topic.builder()
                .course(dsa)
                .title("Bit Manipulation")
                .concept("Bitwise operations process numbers at their binary representation level, executing extremely fast on CPU registers.\n\n### Bitwise Operators:\n- `&` AND, `|` OR, `^` XOR\n- `~` NOT (complement)\n- `<<` Left shift (multiply by 2)\n- `>>` Right shift (divide by 2)")
                .examples("int val = 5; // 0101\nint checkOdd = val & 1; // 1 (Odd)\nint doubleVal = val << 1; // 10 (Left Shift)")
                .notes("XORing a number with itself returns 0. Useful for finding the single non-repeating element.")
                .sequenceOrder(5)
                .build());

        // --- Module 2: Linear Data Structures ---
        list.add(Topic.builder()
                .course(dsa)
                .title("Linked List")
                .concept("A Linked List is a linear collection of nodes where each node contains data and a reference (link) pointing to the next node.\n\n### Key Complexities:\n- **Access**: O(N)\n- **Insertion/Deletion at Head**: O(1)\n- **Insertion/Deletion at Tail/Middle**: O(N)")
                .examples("class Node {\n    int data;\n    Node next;\n    Node(int d) { data = d; }\n}")
                .notes("Circular lists and Doubly Linked Lists (having previous pointers) allow bidirectional traversals.")
                .sequenceOrder(6)
                .build());

        list.add(Topic.builder()
                .course(dsa)
                .title("Stack")
                .concept("A Stack operates on Last-In-First-Out (LIFO) order. It matches functions execution nesting, undo histories, and balancing delimiters.")
                .examples("Stack<Integer> st = new Stack<>();\nst.push(10); // Insert O(1)\nint val = st.pop(); // Remove top O(1)")
                .notes("Java's `Deque<Integer> stack = new ArrayDeque<>()` is preferred over the legacy Vector-based `Stack` class.")
                .sequenceOrder(7)
                .build());

        list.add(Topic.builder()
                .course(dsa)
                .title("Queue")
                .concept("A Queue operates on First-In-First-Out (FIFO) ordering. Useful for task buffers, graph BFS, and resource scheduling.")
                .examples("Queue<Integer> q = new LinkedList<>();\nq.offer(10); // Enqueue O(1)\nint val = q.poll(); // Dequeue O(1)")
                .notes("Insertions happen at the back (rear) and removals happen at the front.")
                .sequenceOrder(8)
                .build());

        list.add(Topic.builder()
                .course(dsa)
                .title("Deque")
                .concept("A Deque (Double-Ended Queue) allows element insertions and deletions at both ends (head and tail).\n\n### Key Methods:\n- `addFirst()` / `removeFirst()`\n- `addLast()` / `removeLast()`")
                .examples("Deque<Integer> dq = new ArrayDeque<>();\ndq.addFirst(5);\ndq.addLast(10);")
                .notes("Can act as both a Stack and a Queue simultaneously. Useful for sliding window max/min algorithms.")
                .sequenceOrder(9)
                .build());

        list.add(Topic.builder()
                .course(dsa)
                .title("Hashing & Hash Tables")
                .concept("Hashing maps arbitrary keys to static array indices using a hash function, delivering O(1) average search, insert, and delete times.\n\n### Collision Resolution:\n1. **Chaining**: Linked lists on conflicting buckets.\n2. **Open Addressing**: Linear/quadratic probing.")
                .examples("HashMap<String, Integer> map = new HashMap<>();\nmap.put(\"A\", 10); // O(1) average\nint val = map.get(\"A\"); // O(1) average")
                .notes("Worst-case complexity collapses to O(N) when too many collisions hash keys to the exact same bucket index.")
                .sequenceOrder(10)
                .build());

        // --- Module 3: Searching & Sorting ---
        list.add(Topic.builder()
                .course(dsa)
                .title("Binary Search")
                .concept("Binary Search solves search queries in a sorted collection in O(log N) by repeatedly inspecting the middle element and halving the search scope.")
                .examples("int low = 0, high = len - 1;\nwhile(low <= high) {\n    int mid = low + (high - low)/2;\n    if(arr[mid] == target) return mid;\n    if(arr[mid] < target) low = mid + 1;\n    else high = mid - 1;\n}")
                .notes("Always calculate mid using `low + (high - low)/2` instead of `(low + high)/2` to prevent integer overflow.")
                .sequenceOrder(11)
                .build());

        list.add(Topic.builder()
                .course(dsa)
                .title("Sorting Algorithms")
                .concept("Sorting places data elements in linear order (e.g. ascending).\n\n### Standard Complexities:\n- **Bubble/Insertion**: O(N^2)\n- **Merge Sort / Quick Sort**: O(N log N) average\n- **Merge Sort Space**: O(N) auxiliary space")
                .examples("Arrays.sort(myArr); // Dual-Pivot QuickSort under the hood")
                .notes("Merge Sort is stable (retains order of equal keys), whereas Quick Sort is generally unstable.")
                .sequenceOrder(12)
                .build());

        list.add(Topic.builder()
                .course(dsa)
                .title("Two Pointers")
                .concept("Two Pointers uses two indexing references (pointers) scanning arrays simultaneously, usually inward from borders or slow-fast (like tortoise and hare).")
                .examples("int l = 0, r = arr.length - 1;\nwhile (l < r) {\n    if (arr[l] + arr[r] == target) return true;\n    if (arr[l] + arr[r] < target) l++;\n    else r--;\n}")
                .notes("Particularly powerful for minimizing nested loop structures O(N^2) to simple single-pass linear scans O(N).")
                .sequenceOrder(13)
                .build());

        list.add(Topic.builder()
                .course(dsa)
                .title("Sliding Window")
                .concept("Sliding Window is a two-pointer technique that maintains a subsegment subset of a list to compute dynamic range metrics over contiguous subarrays.")
                .examples("int max_sum = 0, window_sum = 0;\nfor (int i=0; i<k; i++) window_sum += arr[i];\nfor (int i=k; i<n; i++) {\n    window_sum += arr[i] - arr[i-k];\n    max_sum = Math.max(max_sum, window_sum);\n}")
                .notes("Ideal for problems asking for the 'longest', 'shortest', or 'optimal' contiguous subarray meeting constraints.")
                .sequenceOrder(14)
                .build());

        // --- Module 4: Trees ---
        list.add(Topic.builder()
                .course(dsa)
                .title("Binary Tree")
                .concept("A Binary Tree is a non-linear hierarchical data structure where each node has at most 2 children.\n\n### Traversals:\n- **Pre-Order**: Root -> Left -> Right\n- **In-Order**: Left -> Root -> Right\n- **Post-Order**: Left -> Right -> Root")
                .examples("class TreeNode {\n    int val;\n    TreeNode left, right;\n    TreeNode(int x) { val = x; }\n}")
                .notes("In-order traversal of a balanced binary search tree visits nodes in sorted order.")
                .sequenceOrder(15)
                .build());

        list.add(Topic.builder()
                .course(dsa)
                .title("BST (Binary Search Tree)")
                .concept("BST is a binary tree with structural invariants: left subtree values < node value, and right subtree values > node value.\n\n### Time Complexity:\n- **Search/Insert/Delete**: O(log N) average, O(N) worst-case (skewed tree).")
                .examples("TreeNode insert(TreeNode root, int val) {\n    if (root == null) return new TreeNode(val);\n    if (val < root.val) root.left = insert(root.left, val);\n    else root.right = insert(root.right, val);\n    return root;\n}")
                .notes("Balanced BST structures (like AVL or Red-Black Trees) ensure lookup operations remain O(log N) in the worst case.")
                .sequenceOrder(16)
                .build());

        list.add(Topic.builder()
                .course(dsa)
                .title("Heap & Priority Queue")
                .concept("A Heap is a complete binary tree satisfying the heap invariant: parent nodes are always larger/smaller than children (Max/Min Heap).\n\n### PriorityQueue:\n- **Peek Top**: O(1)\n- **Push / Pop**: O(log N)")
                .examples("PriorityQueue<Integer> minHeap = new PriorityQueue<>();\nminHeap.add(10);\nint top = minHeap.poll(); // Returns smallest")
                .notes("Useful for K-way merges, heap-sort, Dijkstra's algorithm, and dynamic top-K tracking.")
                .sequenceOrder(17)
                .build());

        list.add(Topic.builder()
                .course(dsa)
                .title("Trie (Prefix Tree)")
                .concept("A Trie is a tree structure optimized for string retrieval, where vertices represent character matches. Allows searching words by prefix.\n\n### Performance:\n- **Insert/Search**: O(L) where L is word length, independent of tree size.")
                .examples("class TrieNode {\n    TrieNode[] children = new TrieNode[26];\n    boolean isEndOfWord;\n}")
                .notes("Particularly suited for autocomplete boxes, search engines, and spellcheck algorithms.")
                .sequenceOrder(18)
                .build());

        // --- Module 5: Graphs ---
        list.add(Topic.builder()
                .course(dsa)
                .title("Graph Basics")
                .concept("Graphs connect vertices V with edges E. Can be represented by:\n1. **Adjacency Matrix**: V x V grid. Fast edge check, O(V^2) space.\n2. **Adjacency List**: Array of lists. Space efficient O(V + E).")
                .examples("List<List<Integer>> adj = new ArrayList<>(); // Adjacency list representation")
                .notes("Check for cycles and connectedness before designing search or traversal schemes.")
                .sequenceOrder(19)
                .build());

        list.add(Topic.builder()
                .course(dsa)
                .title("BFS (Breadth-First Search)")
                .concept("BFS starts at a root vertex and explores neighbor vertices level-by-level using a Queue.\n\n### Complexity:\n- **Time**: O(V + E)\n- **Space**: O(V) queue buffer")
                .examples("Queue<Integer> q = new LinkedList<>();\nq.add(start);\nwhile(!q.isEmpty()) {\n    int u = q.poll();\n    for(int v : adj.get(u)) {\n        if(!visited[v]) { visited[v]=true; q.add(v); }\n    }\n}")
                .notes("BFS is mathematically guaranteed to find the shortest path in an unweighted graph.")
                .sequenceOrder(20)
                .build());

        list.add(Topic.builder()
                .course(dsa)
                .title("DFS (Depth-First Search)")
                .concept("DFS starts at a root vertex and explores deep along each branch before backtracking, using recursion or an explicit Stack.\n\n### Complexity:\n- **Time**: O(V + E)\n- **Space**: O(V) recursion stack")
                .examples("void dfs(int u, boolean[] visited) {\n    visited[u] = true;\n    for(int v : adj.get(u)) {\n        if(!visited[v]) dfs(v, visited);\n    }\n}")
                .notes("Ideal for checking connectivity, cycle detection, pathfinding, and solving mazes.")
                .sequenceOrder(21)
                .build());

        list.add(Topic.builder()
                .course(dsa)
                .title("Shortest Path (Dijkstra)")
                .concept("Dijkstra's algorithm finds the shortest path between nodes in a weighted graph with non-negative edge weights using a PriorityQueue.\n\n### Complexity:\n- **Time**: O((V + E) log V)")
                .examples("PriorityQueue<Node> pq = new PriorityQueue<>(Comparator.comparingInt(n -> n.dist));")
                .notes("For negative weights, use the Bellman-Ford algorithm; for all-pairs shortest paths, use Floyd-Warshall.")
                .sequenceOrder(22)
                .build());

        list.add(Topic.builder()
                .course(dsa)
                .title("MST (Minimum Spanning Tree)")
                .concept("An MST connects all vertices of a weighted graph without cycles with the minimum possible total edge weight.\n\n### Core Algorithms:\n- **Kruskal**: Sorts edges and connects components (uses Union-Find).\n- **Prim**: Grows tree node-by-node using a PriorityQueue.")
                .examples("// Prim's or Kruskal's algorithm implementations connect network terminals with minimal cabling cost.")
                .notes("The graph must be connected and undirected to find a spanning tree.")
                .sequenceOrder(23)
                .build());

        list.add(Topic.builder()
                .course(dsa)
                .title("Topological Sort")
                .concept("Topological Sort orders vertices of a Directed Acyclic Graph (DAG) linearly such that for every directed edge u -> v, u comes before v.\n\n### Approaches:\n- **Kahn's Algorithm**: Queue-based indegree reduction.\n- **DFS-Based**: DFS traversal pushing nodes to a stack on completion.")
                .examples("// Useful for build systems tracking compilation orders or course curriculum dependencies.")
                .notes("Only works on Directed Acyclic Graphs (DAGs). If a cycle exists, topological sorting is impossible.")
                .sequenceOrder(24)
                .build());

        // --- Module 6: Advanced DSA ---
        list.add(Topic.builder()
                .course(dsa)
                .title("Greedy Algorithms")
                .concept("Greedy algorithms make the locally optimal choice at each stage with the goal of finding a global optimum.\n\n### Examples:\n- Fractional Knapsack\n- Activity Selection\n- Huffman Coding")
                .examples("// Choose the largest coin value first to minimize coin counts (in standard currencies).")
                .notes("Greedy algorithms do not always yield the global optimal solution. Verify correctness with proofs.")
                .sequenceOrder(25)
                .build());

        list.add(Topic.builder()
                .course(dsa)
                .title("Backtracking")
                .concept("Backtracking builds candidate solutions incrementally, and abandons ('backtracks') a candidate path as soon as it determines it cannot yield a valid complete solution.\n\n### Classical Problems:\n- N-Queens\n- Sudoku Solver\n- Subset Sum")
                .examples("void solve(int col) {\n    if (col == N) { printBoard(); return; }\n    for (int row=0; row<N; row++) {\n        if (isSafe(row, col)) { place(row, col); solve(col+1); remove(row, col); }\n    }\n}")
                .notes("Often represented as a depth-first search on a state-space decision tree.")
                .sequenceOrder(26)
                .build());

        list.add(Topic.builder()
                .course(dsa)
                .title("Divide & Conquer")
                .concept("Divide and Conquer breaks a problem into smaller, independent subproblems of the same type, solves them recursively, and combines their results to solve the original problem.\n\n### Process:\n1. **Divide**: Split the problem.\n2. **Conquer**: Solve recursively.\n3. **Combine**: Merge solutions.")
                .examples("// Merge Sort and Quick Sort split arrays, sort recursively, and merge them back.")
                .notes("Recursion stack overhead is high, but can be parallelized since subproblems are independent.")
                .sequenceOrder(27)
                .build());

        list.add(Topic.builder()
                .course(dsa)
                .title("Dynamic Programming")
                .concept("Dynamic Programming (DP) solves complex problems by breaking them down into overlapping subproblems, solving each subproblem once, and storing their results in a lookup table.\n\n### Styles:\n- **Top-Down (Memoization)**: Recursive with a cache.\n- **Bottom-Up (Tabulation)**: Iterative filling of a DP table.")
                .examples("int fib(int n) {\n    int[] dp = new int[n + 1];\n    dp[0] = 0; dp[1] = 1;\n    for(int i=2; i<=n; i++) dp[i] = dp[i-1] + dp[i-2];\n    return dp[n];\n}")
                .notes("Applicable when the problem exhibits: 1. Overlapping Subproblems 2. Optimal Substructure.")
                .sequenceOrder(28)
                .build());

        // --- Module 7: Placement Preparation ---
        list.add(Topic.builder()
                .course(dsa)
                .title("Blind 75")
                .concept("Blind 75 is a globally recognized, curated list of the 75 most essential coding interview questions covering all core patterns and structures.")
                .examples("// Covers Arrays, Strings, Trees, Linked Lists, Hashing, Matrix, Dynamic Programming, Graphs.")
                .notes("Solving these 75 questions builds a solid foundation for most technology company coding rounds.")
                .sequenceOrder(29)
                .build());

        list.add(Topic.builder()
                .course(dsa)
                .title("NeetCode 150")
                .concept("NeetCode 150 expands the Blind 75 list, providing 150 structured practice problems categorized by clear patterns to cover gaps.")
                .examples("// Categorized into: Arrays & Hashing, Two Pointers, Sliding Window, Stack, Binary Search, Linked List, Trees, Heap, Backtracking, Graphs, DP, Greedy, Bit Manipulation.")
                .notes("NeetCode 150 helps developers map algorithms to structured problem-solving paradigms.")
                .sequenceOrder(30)
                .build());

        list.add(Topic.builder()
                .course(dsa)
                .title("Company-wise Questions")
                .concept("Focusing on coding interview trends and frequently asked problems at target companies (like FAANG, Microsoft, Uber, etc.).")
                .examples("// Practice company-specific templates, time-constrained assessments, and specialized requirements.")
                .notes("Many top tier employers rely on specific categories (e.g. Meta emphasizes high-speed medium arrays/strings, Google emphasizes graph/tree variants).")
                .sequenceOrder(31)
                .build());

        list.add(Topic.builder()
                .course(dsa)
                .title("Mock Interviews")
                .concept("Simulating actual coding interviews under strict time pressure, practicing clean coding style, and verbally explaining complexity analysis.")
                .examples("// Run time-bound sessions (45 minutes per coding problem), speaking out loud, and writing clean, dry code.")
                .notes("Communication and problem-solving framework are just as important as writing correct code.")
                .sequenceOrder(32)
                .build());

        return list;
    }

    private List<Topic> getSystemDesignTopicsList(Course systemDesign) {
        List<Topic> list = new ArrayList<>();

        list.add(Topic.builder()
                .course(systemDesign)
                .title("Introduction to Scaling")
                .concept("Scaling is the ability of a system to handle increasing load without sacrificing performance.\n\n### Scaling Types:\n- **Vertical Scaling (Scale-Up)**: Adding resources (CPU, RAM, SSD) to a single server instance. Simple to implement, but faces hardware limits and introduces a Single Point of Failure (SPOF).\n- **Horizontal Scaling (Scale-Out)**: Adding more server instances to the resource pool. Requires a load balancer, but scales horizontally without physical hardware bounds, ensuring high availability.")
                .examples("// Vertical: Upgrading a database server from 16GB RAM to 128GB RAM.\n// Horizontal: Provisioning 5 additional micro VMs behind a Nginx load balancer.")
                .notes("Most startups begin with vertical scaling. High-growth networks switch to horizontal scaling to eliminate server single points of failure.")
                .sequenceOrder(1)
                .build());

        list.add(Topic.builder()
                .course(systemDesign)
                .title("Load Balancers")
                .concept("Load balancers distribute incoming application traffic across multiple backend servers to prevent overload and ensure high availability.\n\n### Algorithms:\n- **Round Robin**: Distributes requests sequentially.\n- **Weighted Round Robin**: Routes traffic proportionally according to server specifications.\n- **Least Connections**: Sends requests to the server with the lowest current workload.\n- **IP Hash**: Maps client IP addresses to determine target server endpoints (ensures session persistence).")
                .examples("Nginx, HAProxy, or AWS ALB (Application Load Balancer) acts as a reverse proxy load balancer distributing traffic to server pools.")
                .notes("Load balancers can also perform SSL termination, rate limiting, and background health checks on backend instances.")
                .sequenceOrder(2)
                .build());

        list.add(Topic.builder()
                .course(systemDesign)
                .title("CDNs & Caching")
                .concept("Caching stores copies of frequently accessed data in fast storage layers to optimize retrieval latency.\n\n### Key Patterns:\n- **In-Memory Cache**: High-speed RAM storage for session details and DB query caches.\n- **CDN (Content Delivery Network)**: Globally distributed proxy edge servers caching static files (JS, CSS, images) physically close to users.\n- **Cache Eviction**: Techniques to purge memory pools when capacity limits are hit (e.g. LRU: Least Recently Used, LFU: Least Frequently Used).")
                .examples("// Using Redis to store session tokens\nString cachedSession = redis.get(\"session:\" + userId);\n\n// Eviction policies configuration\nmaxmemory-policy allkeys-lru")
                .notes("Caching invalidation is a classic computer science challenge. Keep cache lifetimes (TTL) short and bounded to prevent stale client configurations.")
                .sequenceOrder(3)
                .build());

        list.add(Topic.builder()
                .course(systemDesign)
                .title("SQL vs NoSQL Databases")
                .concept("Choosing database structures relies heavily on data relational requirements and write/read scale parameters.\n\n### SQL Databases:\n- Relational, structured tables with strict schemas.\n- **ACID Guarantees**: Atomicity, Consistency, Isolation, Durability. Ideal for financial transactions.\n\n### NoSQL Databases:\n- Non-relational, flexible schema representations.\n- Types: Key-Value (Redis), Document (MongoDB), Wide-Column (Cassandra), Graph (Neo4j).\n- **BASE Model**: Basically Available, Soft state, Eventual consistency. Scales horizontally easily.")
                .examples("// Relational query (SQL):\nSELECT * FROM users JOIN profiles ON users.id = profiles.user_id;\n\n// NoSQL JSON Document (MongoDB):\n{ \"id\": \"u123\", \"name\": \"Alice\", \"preferences\": { \"theme\": \"dark\" } }")
                .notes("Use SQL for transactional tables requiring strong transactional guarantees; use NoSQL for semi-structured log events or rapid, high-scale read/write metrics.")
                .sequenceOrder(4)
                .build());

        list.add(Topic.builder()
                .course(systemDesign)
                .title("Database Replication & Sharding")
                .concept("Scaling datastores horizontally requires duplicating data or partitioning storage ranges.\n\n### Database Replication:\n- Duplicates database tables across multiple slave instances.\n- **Master-Slave**: Master handles writes; slaves handle reads (excellent for read-heavy networks).\n\n### Database Sharding:\n- Horizontally partitions data ranges (shards) across distinct host databases based on a partition key (sharding key).\n- Challenges: Cross-shard joins are disabled; re-sharding when nodes drop/add is complex.")
                .examples("// Sharding key hashing concept:\nint shardId = userId.hashCode() % totalDatabaseShards;")
                .notes("Sharding adds high operational complexity. Avoid sharding until caching and read replication capacities are exhausted.")
                .sequenceOrder(5)
                .build());

        list.add(Topic.builder()
                .course(systemDesign)
                .title("CAP & PACELC Theorems")
                .concept("The CAP theorem states that in a distributed computer system, you can only guarantee two out of three characteristics simultaneously:\n1. **Consistency (C)**: Every read receives the most recent write or an error.\n2. **Availability (A)**: Every request receives a non-error response (without guarantee that it contains the most recent write).\n3. **Partition Tolerance (P)**: The system continues to operate despite arbitrary message loss or system partitions.\n\n### PACELC Extension:\nIf there is a Partition (P), trade-off Availability (A) vs Consistency (C); Else (E), trade-off Latency (L) vs Consistency (C).")
                .examples("// CP-oriented: Google Spanner uses GPS and atomic clocks to guarantee strong global transactions.\n// AP-oriented: Cassandra offers eventual consistency to maximize write availability.")
                .notes("Since network hardware failures (partitions) are inevitable in real-world systems, partition tolerance (P) is mandatory. The active choice is always CP or AP.")
                .sequenceOrder(6)
                .build());

        list.add(Topic.builder()
                .course(systemDesign)
                .title("Message Queues & Event Streaming")
                .concept("Asynchronous architectures decouple long-running server operations from blocking synchronous client request loops.\n\n### Key Paradigms:\n- **Message Queue**: Delivers point-to-point tasks to a worker pool (e.g. RabbitMQ).\n- **Event Streaming Log**: Appends immutable events to partitioned logs, allowing multiple pub/sub subscribers to consume inputs asynchronously (e.g. Kafka).\n- **Benefits**: Provides backpressure buffering, shields DBs from sudden write surges, and decouples domains.")
                .examples("// Decoupled user registration pipeline:\n// 1. Client requests Registration -> 2. Controller publishes event 'USER_CREATED' to Queue -> 3. Controller responds immediately -> 4. Worker consumes event and mails confirmation.")
                .notes("Event streaming systems enable event-sourcing patterns where the state is derived by replaying historic transaction logs.")
                .sequenceOrder(7)
                .build());

        list.add(Topic.builder()
                .course(systemDesign)
                .title("Rate Limiters & API Gateways")
                .concept("API Gateways and Rate Limiters act as entry proxies to secure microservices from resource abuse and coordinate routing.\n\n### API Gateway Core Tasks:\n- Reverse proxy routing, security authentication, CORS validation, metrics log aggregation.\n\n### Rate Limiting Algorithms:\n- **Token Bucket / Leaky Bucket**: Smooths requests using a buffer of tokens or queues.\n- **Sliding Window Log**: Checks timestamp history logs to block requests when exceeding QPS caps.")
                .examples("// Token bucket rate limit policy:\n// If (bucket.tokens > 0) { allowRequest(); bucket.tokens--; } else { return 429; }")
                .notes("API Gateways represent a single entry point for client requests, protecting internal microservice architectures from direct exposure.")
                .sequenceOrder(8)
                .build());

        list.add(Topic.builder()
                .course(systemDesign)
                .title("Consistent Hashing")
                .concept("Consistent Hashing maps both host servers and cached database keys onto a virtual circular hashing ring.\n\n### Why it matters:\n- In standard modulo hashing (`key % N`), adding or removing a cache server invalidates almost all cached keys.\n- Consistent Hashing ensures that when a server node is added or removed, only $1/N$ fraction of keys are redistributed.\n- **Virtual Nodes**: Multiplies hash representations of server instances to balance node distributions and prevent 'hotspots'.")
                .examples("// Maps server ip hashes and object key hashes to positions on a 0 to 2^32 - 1 ring.\n// Keys are routed to the nearest server node scanning clockwise direction.")
                .notes("Consistent hashing is a core building block of massive distributed caches (Memcached clients) and databases (DynamoDB, Cassandra).")
                .sequenceOrder(9)
                .build());

        list.add(Topic.builder()
                .course(systemDesign)
                .title("System Design Interview Blueprint")
                .concept("Tackling ambiguous system design questions in technical interviews requires a structured, step-by-step framework.\n\n### Standard 4-Step Framework:\n1. **Requirements & Scope**: Gather Functional (endpoints) and Non-Functional (QPS, scaling limits, read/write ratio) specs.\n2. **High-Level Design**: Map servers, load balancers, database choices, and queue layouts in block diagrams.\n3. **API & Schema Design**: Outline endpoints, JSON response payloads, and database columns.\n4. **Deep-Dive Scaling**: Analyze bottlenecks, implement caches, explain sharding keys, rate limiters, and single points of failure.")
                .examples("// System design interview blueprint overview:\n// Q: 'Design Twitter'\n// Step 1: Read/Write ratio (100:1 read heavy), active users count (100M/day).\n// Step 2: Push vs Pull models for timeline delivery.")
                .notes("Never start drawing high-level diagrams before aligning with the interviewer on exact QPS constraints and data storage lifetime requirements.")
                .sequenceOrder(10)
                .build());

        return list;
    }

    private List<Topic> getHtmlCssTopicsList(Course htmlCss) {
        List<Topic> list = new ArrayList<>();

        list.add(Topic.builder()
                .course(htmlCss)
                .title("HTML Intro & Structure")
                .concept("HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page semantically.\n\n### Key Elements:\n- `<!DOCTYPE html>`: Declares that the document is HTML5.\n- `<html>`: The root element of an HTML page.\n- `<head>`: Contains meta-information (title, character set, stylesheets).\n- `<body>`: Defines the document's body, containing all visible content like headings, paragraphs, images, links, etc.\n\n### Essential Tags:\n- Headings: `<h1>` to `<h6>` define headings where `<h1>` is the most important.\n- Paragraphs: `<p>` defines a paragraph.\n- Links: `<a href=\"url\">Link Text</a>` defines a hyperlink.\n- Images: `<img src=\"img.jpg\" alt=\"description\" width=\"500\" height=\"600\">` defines an image.")
                .examples("<!DOCTYPE html>\n<html>\n<head>\n    <title>My First Page</title>\n</head>\n<body>\n    <h1>Welcome to Web Dev</h1>\n    <p>This is a paragraph structured in HTML.</p>\n    <a href=\"https://www.w3schools.com\">Visit W3Schools</a>\n</body>\n</html>")
                .notes("HTML tags normally come in pairs like `<p>` and `</p>`. The first tag is the start tag, and the second is the end tag.")
                .sequenceOrder(1)
                .build());

        list.add(Topic.builder()
                .course(htmlCss)
                .title("CSS Styling & Box Model")
                .concept("CSS (Cascading Style Sheets) describes how HTML elements are to be displayed on screen. It saves a lot of work by controlling the layout of multiple web pages all at once.\n\n### CSS Syntax:\nCSS consists of a selector and a declaration block:\n`selector { property: value; }`\n- Selector points to the HTML element (e.g., `p`, `.class-name`, `#id-name`).\n- Declarations are separated by semicolons and contain property name and value separated by a colon.\n\n### CSS Box Model:\nAll HTML elements can be considered as boxes. In CSS, the term \"box model\" is used when talking about design and layout.\n- **Content**: The content of the box, where text and images appear.\n- **Padding**: Clears an area around the content. The padding is transparent.\n- **Border**: A border that goes around the padding and content.\n- **Margin**: Clears an area outside the border. The margin is transparent.")
                .examples("/* CSS Selectors and Declarations */\nh1 {\n    color: #4f46e5;\n    text-align: center;\n}\n\n.card {\n    width: 300px;\n    padding: 20px;\n    border: 1px solid #1e293b;\n    margin: 10px;\n    background-color: #0f172a;\n}")
                .notes("The Box Model calculation: Total element width = width + left padding + right padding + left border + right border + left margin + right margin.")
                .sequenceOrder(2)
                .build());

        list.add(Topic.builder()
                .course(htmlCss)
                .title("Flexbox & Responsive Design")
                .concept("Flexbox is a layout mode that makes it easier to design a flexible, responsive layout structure without using floats or positioning.\n\n### Flex Container Properties:\n- `display: flex;`: Turns the element into a flex container.\n- `flex-direction`: Defines direction of flex items (`row`, `row-reverse`, `column`, `column-reverse`).\n- `justify-content`: Aligns flex items horizontally (`flex-start`, `flex-end`, `center`, `space-between`, `space-around`).\n- `align-items`: Aligns flex items vertically (`stretch`, `center`, `flex-start`, `flex-end`).\n\n### Responsive Media Queries:\nMedia queries allow you to apply different CSS styles depending on the device's characteristics (like screen width).")
                .examples(".container {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n}\n\n/* Responsive Layout for screens smaller than 600px */\n@media screen and (max-width: 600px) {\n    .container {\n        flex-direction: column;\n    }\n}")
                .notes("Always include the `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">` tag in your HTML head for responsive design to work properly on mobile screens.")
                .sequenceOrder(3)
                .build());

        list.add(Topic.builder()
                .course(htmlCss)
                .title("CSS Grid Layout")
                .concept("CSS Grid Layout is a 2D grid-based layout system that controls both columns and rows at the same time, unlike Flexbox which is 1D.\n\n### Grid Properties:\n- `display: grid;`: Defines a grid container.\n- `grid-template-columns` / `grid-template-rows`: Defines sizes of columns and rows.\n- `gap` / `row-gap` / `column-gap`: Sets the size of grid gaps.\n- `grid-column` / `grid-row`: Specifies an item's start/end placement inside the grid.")
                .examples(".grid-container {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    gap: 15px;\n}\n.grid-item-header {\n    grid-column: 1 / 4; /* Span all columns */\n}")
                .notes("Grid is best suited for page-wide layout structures, whereas Flexbox is best for aligning content elements inside containers.")
                .sequenceOrder(4)
                .build());

        list.add(Topic.builder()
                .course(htmlCss)
                .title("Semantic HTML5 Elements")
                .concept("Semantic elements describe their meaning to both the browser and the developer (e.g. `<header>`, `<footer>`, `<article>`, `<section>`, `<nav>`).\n\n### Importance:\n- **Accessibility (a11y)**: Screen readers can navigate the page structure more effectively.\n- **SEO**: Search engines can index page sections according to contextual priority.\n- **Readability**: Code is self-documenting and easier to manage.")
                .examples("<body>\n    <header>\n        <nav>...</nav>\n    </header>\n    <main>\n        <section>\n            <article>...</article>\n        </section>\n    </main>\n    <footer>...</footer>\n</body>")
                .notes("Avoid wrapping everything inside generic `<div>` tags (known as 'divitis') when semantic alternatives exist.")
                .sequenceOrder(5)
                .build());

        list.add(Topic.builder()
                .course(htmlCss)
                .title("HTML Forms & Validations")
                .concept("HTML Forms are used to collect user input. Modern HTML provides built-in attributes for standard validation checks.\n\n### Common Input Attributes:\n- `required`: Field must be completed.\n- `pattern`: RegEx string to match validation.\n- `min` / `max`: Range bounds for numbers or dates.\n- `type`: Specific validation rules (e.g., `email`, `url`, `tel`).")
                .examples("<form action=\"/submit-form\" method=\"POST\">\n    <label for=\"email\">Email:</label>\n    <input type=\"email\" id=\"email\" name=\"email\" required>\n    \n    <label for=\"age\">Age:</label>\n    <input type=\"number\" id=\"age\" name=\"age\" min=\"18\" max=\"99\">\n    \n    <button type=\"submit\">Submit</button>\n</form>")
                .notes("Always sanitize and validate user input on the server side as well, as frontend HTML validation can be easily bypassed.")
                .sequenceOrder(6)
                .build());

        list.add(Topic.builder()
                .course(htmlCss)
                .title("CSS Variables & Custom Properties")
                .concept("CSS Variables (Custom Properties) allow you to store values (like colors or sizes) in one place and reuse them throughout a stylesheet.\n\n### Syntax:\n- Declaring variables: prefix with double dashes `--` inside a selector (commonly `:root`).\n- Using variables: wrap in the `var()` function.")
                .examples(":root {\n    --primary-color: #4f46e5;\n    --font-heading: 'Inter', sans-serif;\n}\n\n.btn-primary {\n    background-color: var(--primary-color);\n    font-family: var(--font-heading);\n}")
                .notes("CSS Variables are dynamic: they cascade down the DOM, respect media queries, and can be read or modified by JavaScript at runtime.")
                .sequenceOrder(7)
                .build());

        list.add(Topic.builder()
                .course(htmlCss)
                .title("CSS Transitions & Animations")
                .concept("Transitions allow you to change property values smoothly over a given duration. Animations provide fine-grained control via `@keyframes` timelines.\n\n### Key Concepts:\n- **Transitions**: Smooth changes triggered by a state change (e.g., `:hover`).\n- **Animations**: Complex state changes defined by percent keyframes (`0%` to `100%`) running automatically.")
                .examples(".btn {\n    transition: background-color 0.3s ease-in-out;\n}\n.btn:hover {\n    background-color: #3b82f6;\n}\n\n@keyframes pulse {\n    0% { transform: scale(1); }\n    50% { transform: scale(1.05); }\n    100% { transform: scale(1); }\n}\n.pulse-card {\n    animation: pulse 2s infinite;\n}")
                .notes("Use transitions and animations sparingly to improve UX. Avoid excessive motion that can cause distraction or physical discomfort.")
                .sequenceOrder(8)
                .build());

        list.add(Topic.builder()
                .course(htmlCss)
                .title("CSS Frameworks & Tailwind")
                .concept("CSS Frameworks accelerate layout creation. **Tailwind CSS** is a utility-first framework where styling is applied via pre-defined class tokens directly in markup.\n\n### Utility Class Philosophy:\n- Fast prototyping: No writing custom stylesheets.\n- Design constraints: Relying on curated scale constants for margins, padding, and colors.\n- Shipped footprint: Built-in compiler purges unused utility strings to minimize production CSS bundle sizes.")
                .examples("<div class=\"flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl\">\n    <p class=\"text-sm font-semibold text-slate-200\">Tailwind styling!</p>\n</div>")
                .notes("Understand vanilla CSS box model and positioning fundamentals before building production web apps with utility-first frameworks.")
                .sequenceOrder(9)
                .build());

        list.add(Topic.builder()
                .course(htmlCss)
                .title("Web Accessibility & Best Practices")
                .concept("Web Accessibility (a11y) ensures that websites can be used by everyone, including people with vision, hearing, motor, or cognitive impairments.\n\n### Key Standards:\n- **Semantic Tags**: Use correct tags (e.g., `<button>` for actions, NOT `<div>` with onClick).\n- **Alt Text**: Images require descriptive `alt` tags.\n- **Contrast Ratio**: Standard text requires a minimum contrast ratio of 4.5:1 against the background.\n- **Aria Roles & Labels**: Use `aria-label` or `role` to supply extra context to screen readers.")
                .examples("<button aria-label=\"Close Menu\" onclick=\"closeMenu()\">\n    <span aria-hidden=\"true\">&times;</span>\n</button>")
                .notes("Keyboard navigation is a core part of accessibility. Ensure all interactive components are focusable using Tab keys.")
                .sequenceOrder(10)
                .build());

        return list;
    }

    private List<Topic> getJavascriptTopicsList(Course javascript) {
        List<Topic> list = new ArrayList<>();

        list.add(Topic.builder()
                .course(javascript)
                .title("JS Syntax & Variables")
                .concept("JavaScript is a lightweight, interpreted programming language with first-class functions. It is most well-known as the scripting language for Web pages.\n\n### Key Variables:\n- `var`: Declares a variable (function-scoped or globally-scoped, outdated).\n- `let`: Declares a block-scoped local variable, can be reassigned.\n- `const`: Declares a block-scoped read-only constant variable, cannot be reassigned.\n\n### JS Data Types:\n- String: `\"John Doe\"`\n- Number: `34.00` or `34`\n- Boolean: `true` or `false`\n- Array: `[\"Apple\", \"Banana\"]`\n- Object: `{firstName:\"John\", lastName:\"Doe\"}`")
                .examples("// Variables\nlet x = 5;\nconst pi = 3.14159;\n\n// Output to Console\nconsole.log(\"Value of x is: \", x);\n\n// Operators\nlet sum = x + 10; // 15\nlet greeting = \"Hello \" + \"World\"; // \"Hello World\"")
                .notes("Always prefer using `const` by default. Only use `let` if you know the variable's value needs to be reassigned.")
                .sequenceOrder(1)
                .build());

        list.add(Topic.builder()
                .course(javascript)
                .title("JS Functions & Events")
                .concept("A JavaScript function is a block of code designed to perform a particular task. It is executed when \"something\" invokes it (calls it).\n\n### Functions Syntax:\n- Declared using the `function` keyword, followed by a name, followed by parentheses `()`.\n- **Arrow Functions**: Introduced in ES6, arrow functions allow writing shorter function syntax.\n\n### HTML Events:\nHTML events are \"things\" that happen to HTML elements. JavaScript can react to these events:\n- `onclick`: The user clicks an HTML element.\n- `onchange`: An HTML element has been changed (e.g. input fields).\n- `onmouseover`: The user moves the mouse over an HTML element.\n- `onload`: The browser has finished loading the page.")
                .examples("// Normal Function\nfunction multiply(a, b) {\n    return a * b;\n}\n\n// Arrow Function\nconst add = (a, b) => a + b;\n\n// Calling function\nlet product = multiply(4, 3); // 12\n\n// Event Handler\nconst button = document.getElementById(\"btn\");\nbutton.onclick = function() {\n    alert(\"Button clicked!\");\n};")
                .notes("Functions can also be passed as arguments to other functions (called callbacks), which is a key concept in asynchronous JavaScript.")
                .sequenceOrder(2)
                .build());

        list.add(Topic.builder()
                .course(javascript)
                .title("Array & String Methods")
                .concept("JavaScript provides powerful built-in methods to manipulate strings and arrays easily.\n\n### Essential String Methods:\n- `length`: Returns the string length.\n- `indexOf(str)`: Returns the index of the first occurrence of substring.\n- `slice(start, end)`: Extracts a part of a string and returns it.\n- `replace(old, new)`: Replaces a specified value with another value.\n\n### Essential Array Methods:\n- `push(element)` / `pop()`: Adds / removes elements at the end.\n- `forEach(callback)`: Calls a function for each array element.\n- `map(callback)`: Creates a new array by performing a function on each array element.\n- `filter(callback)`: Creates a new array with array elements that pass a test condition.")
                .examples("let txt = \"JavaScript\";\nconsole.log(txt.length); // 10\nconsole.log(txt.slice(0, 4)); // \"Java\"\n\nlet numbers = [1, 2, 3, 4, 5];\nnumbers.push(6);\n\n// Using map to double values\nlet doubled = numbers.map(x => x * 2);\nconsole.log(doubled); // [2, 4, 6, 8, 10, 12]\n\n// Using filter to find evens\nlet evens = numbers.filter(x => x % 2 === 0);\nconsole.log(evens); // [2, 4, 6]")
                .notes("Methods like `map` and `filter` do not mutate the original array; they return a brand new array.")
                .sequenceOrder(3)
                .build());

        list.add(Topic.builder()
                .course(javascript)
                .title("DOM Manipulation & Selectors")
                .concept("The Document Object Model (DOM) is an API representing an HTML document. JavaScript is used to dynamically select, add, modify, or delete elements.\n\n### Common Selector Methods:\n- `document.getElementById('id')`: Selects an element by unique ID.\n- `document.querySelector('selector')`: Selects the first element matching CSS selectors.\n- `document.querySelectorAll('selector')`: Selects all elements matching CSS selectors.")
                .examples("const heading = document.getElementById('main-heading');\nheading.textContent = 'Welcome back!';\nheading.style.color = '#4f46e5';\n\n// Creating and appending elements\nconst newPara = document.createElement('p');\nnewPara.textContent = 'Dynamically added paragraph';\ndocument.body.appendChild(newPara);")
                .notes("Altering the DOM can trigger page reflows or repaints. Group modifications where possible for performance.")
                .sequenceOrder(4)
                .build());

        list.add(Topic.builder()
                .course(javascript)
                .title("Asynchronous JS (Promises, Async/Await)")
                .concept("Asynchronous programming allows JavaScript to start a long-running task and continue executing other tasks in the meantime, handling task completions later.\n\n### Key Concepts:\n- **Callback**: Function passed to another to execute once a task is finished (leads to callback hell).\n- **Promise**: Object representing the eventual completion (or failure) of an async operation.\n- **Async/Await**: Syntactic sugar built on top of Promises for writing asynchronous code in a linear, synchronous-looking style.")
                .examples("const fetchData = async () => {\n    try {\n        const response = await fetch('https://api.github.com/users/octocat');\n        const data = await response.json();\n        console.log(data.name);\n    } catch (error) {\n        console.error('Error fetching data:', error);\n    }\n};")
                .notes("JavaScript runs on a single main execution thread (the Event Loop) which uses a callback queue to process asynchronous tasks.")
                .sequenceOrder(5)
                .build());

        list.add(Topic.builder()
                .course(javascript)
                .title("JS Objects & OOP")
                .concept("Objects are key-value stores. JavaScript uses prototypes to inherit properties and methods between objects, which enables object-oriented programming.\n\n### Key Pillars:\n- **Prototype Inheritance**: Objects look up properties on parent objects using the internal prototype chain (`__proto__`).\n- **Classes**: ES6 syntax providing a clean constructor and class definition matching other OOP languages.")
                .examples("class Person {\n    constructor(name, age) {\n        this.name = name;\n        this.age = age;\n    }\n    greet() {\n        return `Hello, my name is ${this.name}`;\n    }\n}\n\nconst user = new Person('Alice', 25);\nconsole.log(user.greet()); // \"Hello, my name is Alice\"")
                .notes("Under the hood, JavaScript classes are syntax sugar over prototype-based inheritance models.")
                .sequenceOrder(6)
                .build());

        list.add(Topic.builder()
                .course(javascript)
                .title("Scope, Closures & Lexical Environment")
                .concept("Scope determines accessibility of variables. Closures allow inner functions to retain access to variables declared in their outer parent scope, even after the parent function completes execution.\n\n### Scope Types:\n- Global Scope: Accessible everywhere.\n- Function Scope: Accessible only within the declaring function (`var`).\n- Block Scope: Accessible only inside braces `{}` (`let`, `const`).")
                .examples("function outer() {\n    let counter = 0;\n    return function inner() {\n        counter++;\n        return counter;\n    };\n}\n\nconst increment = outer();\nconsole.log(increment()); // 1\nconsole.log(increment()); // 2")
                .notes("Closures are heavily used in module patterns to encapsulate private variables and keep state safe from global access.")
                .sequenceOrder(7)
                .build());

        list.add(Topic.builder()
                .course(javascript)
                .title("ES6+ Modern Features")
                .concept("ES6 (ECMAScript 2015) introduced massive enhancements to the JavaScript language, simplifying object creations, iterations, and variable scopes.\n\n### Core Additions:\n- **Destructuring**: Extract values from arrays or objects easily.\n- **Spread/Rest Operator (`...`)**: Expand or collect array/object collections.\n- **Template Literals**: Inline evaluation expressions inside backticks `` `hello ${name}` ``.")
                .examples("const user = { name: 'Bob', age: 30, country: 'USA' };\nconst { name, ...rest } = user;\nconsole.log(name); // 'Bob'\nconsole.log(rest); // { age: 30, country: 'USA' }\n\nconst arr1 = [1, 2];\nconst arr2 = [...arr1, 3, 4]; // [1, 2, 3, 4]")
                .notes("Modern tools (like Babel/Vite) compile ES6+ features back into older formats (ES5) to ensure compatibility in legacy browsers.")
                .sequenceOrder(8)
                .build());

        list.add(Topic.builder()
                .course(javascript)
                .title("Error Handling & try-catch")
                .concept("Error handling prevents applications from crashing on runtime exceptions. The `try-catch-finally` block allows developers to handle errors gracefully.\n\n### Structure:\n- `try`: Run the code that could potentially raise an exception.\n- `catch`: Code block executed if an exception is thrown in the try block.\n- `finally`: Code block executed regardless of the outcome (e.g. closing connections).")
                .examples("try {\n    const num = 10;\n    num.toUpperCase(); // Throws TypeError (number doesn't have toUpperCase)\n} catch (error) {\n    console.warn('Caught expected error:', error.message);\n} finally {\n    console.log('Finished error checks.');\n}")
                .notes("Custom errors can be manually raised using the `throw` keyword followed by an Error object: `throw new Error('Action failed')`.")
                .sequenceOrder(9)
                .build());

        list.add(Topic.builder()
                .course(javascript)
                .title("Web Storage (LocalStorage, SessionStorage)")
                .concept("Web Storage APIs allow browser instances to save key-value pairs locally inside the client's system.\n\n### Storage Types:\n- **LocalStorage**: Persistent storage that remains intact even when closing/reopening browser tabs/windows.\n- **SessionStorage**: Temporary storage that is wiped out completely once the browser tab/window is closed.")
                .examples("// Set and retrieve LocalStorage values\nlocalStorage.setItem('theme', 'dark');\nconst currentTheme = localStorage.getItem('theme');\nconsole.log(currentTheme); // 'dark'\n\n// Remove standard items\nlocalStorage.removeItem('theme');\nlocalStorage.clear(); // Clear all store entries")
                .notes("Both storage options are limited to storing text strings. Store structured JSON arrays or objects by calling `JSON.stringify` and `JSON.parse` values.")
                .sequenceOrder(10)
                .build());

        return list;
    }

    private CodingProblem createProblem(String title, String description, String difficulty, String constraints) {
        return CodingProblem.builder()
                .title(title)
                .description(description)
                .difficulty(difficulty)
                .constraints(constraints)
                .javaTemplate("import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}")
                .javascriptTemplate("const fs = require('fs');\n\nfunction main() {\n    // Write your code here\n    \n}\n\nmain();")
                .build();
    }

    private CodingProblem createSqlProblem(String title, String description, String difficulty, String constraints, String sqlTemplate) {
        return CodingProblem.builder()
                .title(title)
                .description(description)
                .difficulty(difficulty)
                .constraints(constraints)
                .sqlTemplate(sqlTemplate)
                .build();
    }
}
