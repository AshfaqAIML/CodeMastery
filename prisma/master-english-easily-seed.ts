import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

// ============================================================
// Master English Easily - imported by scripts/import-course/pipeline.py
// Idempotent via upsert. Regenerate with the pipeline, never hand-edit.
// ============================================================

const subject = {
  slug: "master-english-easily",
  name: "Master English Easily",
  tagline: "Master English easily — 40 chapters of practical language building.",
  description: "Learn English in a simple way with grammar, vocabulary, speaking and practice lessons.",
  icon: "Briefcase",
  color: "oklch(0.75 0.16 85)",
  category: "Career",
  order: 76,
  modules: [
    {
      slug: "part-1",
      title: "Part 1 — Chapters 1–12",
      summary: "Chapters 1 to 12 of Master English Easily.",
      order: 1,
      difficulty: "beginner",
      estimatedMinutes: 360,
      tutorials: [
    {
      slug: "chapter-1-introduction-to-english",
      title: "Introduction to English",
      summary: "English is a language.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 0,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Introduction to English

## What is English?

English is a language.

People use it to talk, write, and understand each other.

### Example:

- English is an international language.

### انگریزی ایک بین الاقوامی زبان ہے

- People speak English all over the world.

### لوگ پوری دنیا میں انگریزی بولتے ہیں

## Why Learn English?

English is very important in daily life.

### You need English for:

- Education

- Jobs

- Communication

- Internet

### Examples:

- I want to learn English.

### میں انگریزی سیکھنا چاہتا ہوں

- English helps me get a job.

### انگریزی مجھے نوکری حاصل کرنے میں مدد دیتی ہے

- I can talk to people in English.

### میں لوگوں سے انگریزی میں بات کر سکتا ہوں

## Where Do We Use English?

### We use English in many places:

### At Home

- I am eating food.

### میں کھانا کھا رہا ہوں

### At School/College

- I am studying English.

### میں انگریزی پڑھ رہا ہوں

### In Market

- How much is this?

### یہ کتنے کا ہے؟

### At Work

- I am doing my work.

### میں اپنا کام کر رہا ہوں

## Basic English Sentences

English sentences are simple.

### Structure:

### Subject + Verb + Object

### Examples:

- I eat food.

### میں کھانا کھاتا ہوں

- She reads a book.

### وہ کتاب پڑھتی ہے

- They play cricket.

### وہ کرکٹ کھیلتے ہیں

- He drinks water.

### وہ پانی پیتا ہے

- We learn English.

### ہم انگریزی سیکھتے ہیں

## Types of Simple Sentences

### Positive Sentence

- I am happy.

### میں خوش ہوں

- She is my friend.

### وہ میری دوست ہے

### Negative Sentence

- I am not sad.

### میں اداس نہیں ہوں

- He is not here.

### وہ یہاں نہیں ہے

### Question Sentence

- Are you ready?

### کیا تم تیار ہو؟

- Where are you going?

### تم کہاں جا رہے ہو؟

## Tips to Learn English Fast

### Tip 1: Speak daily

- I speak English every day.

### میں روز انگریزی بولتا ہوں

### Tip 2: Listen carefully

- I listen to English.

### میں انگریزی سنتا ہوں

### Tip 3: Practice simple sentences

- I practice daily.

### میں روز مشق کرتا ہوں

### Tip 4: Do not fear mistakes

- I am not afraid of mistakes.

### میں غلطیوں سے نہیں ڈرتا

## Daily Use Mini Conversations

### Person A: What is your name?

### تمہارا نام کیا ہے؟

Person B: My name is Ali.

### میرا نام علی ہے

### Person A: Do you speak English?

### کیا تم انگریزی بولتے ہو؟

Person B: Yes, I speak a little.

### ہاں، میں تھوڑی بولتا ہوں

### Person A: Why are you learning English?

### تم انگریزی کیوں سیکھ رہے ہو؟

Person B: I want a good job.

### میں اچھی نوکری چاہتا ہوں

## Practice Section

### Fill in the blanks:

- I ___ English.

- She ___ a book.

- They ___ cricket.

### Translate into English:

- میں انگریزی سیکھتا ہوں

- وہ پانی پیتا ہے

- ہم سکول جاتے ہیں

### Make your own sentences:

- I ______

- She ______

- We ______

## Chapter Summary (Quick Revision)

- English is a global language

- It is used in daily life

- Sentence structure is simple

- Practice daily to improve

### Final Tip:

- I will learn English step by step.

### میں انگریزی مرحلہ وار سیکھوں گا`,
    },
    {
      slug: "chapter-2-english-sentence-structure",
      title: "English Sentence Structure",
      summary: "A sentence is a group of words that gives a complete meaning.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 1,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: ["Sentence = complete meaning", "Structure = Subject + Verb + Object", "3 types: Positive, Negative, Question", "Final Tip:", "I make simple sentences daily.", "میں روز سادہ جملے بناتا ہوں"],
      selfAssessment: [],
      content: `# English Sentence Structure

## What is a Sentence?

A sentence is a group of words that gives a complete meaning.

### Examples:

- I eat food.

### میں کھانا کھاتا ہوں

- She is happy.

### وہ خوش ہے

- They play cricket.

### وہ کرکٹ کھیلتے ہیں

These sentences are complete. They have meaning.

## Basic Structure of a Sentence

### Formula:

### Subject + Verb + Object

### Subject (Who?)

The subject tells who is doing the action.

### Examples:

- I eat food.

### میں کھانا کھاتا ہوں

### "I" is subject

- She reads a book.

### وہ کتاب پڑھتی ہے

### "She" is subject

### Verb (Action)

The verb tells what action is happening.

### Examples:

- I eat food.

### میں کھانا کھاتا ہوں

- He runs fast.

### وہ تیزی سے دوڑتا ہے

### Object (What?)

The object tells what is receiving the action.

### Examples:

- I eat food.

### میں کھانا کھاتا ہوں

- She reads a book.

### وہ کتاب پڑھتی ہے

## More Examples of Structure

- I drink water.

### میں پانی پیتا ہوں

- He plays football.

### وہ فٹبال کھیلتا ہے

- We watch TV.

### ہم ٹی وی دیکھتے ہیں

- She cooks food.

### وہ کھانا پکاتی ہے

- They open the door.

### وہ دروازہ کھولتے ہیں

## Types of Sentences

### Positive (Affirmative) Sentences

These sentences tell something.

### Examples:

- I am a student.

### میں ایک طالب علم ہوں

- She is my sister.

### وہ میری بہن ہے

- They are happy.

### وہ خوش ہیں

### Negative Sentences

These sentences show "no" or "not".

### Use: not

### Examples:

- I am not tired.

### میں تھکا ہوا نہیں ہوں

- He is not at home.

### وہ گھر پر نہیں ہے

- They are not ready.

### وہ تیار نہیں ہیں

### Question Sentences

These sentences ask something.

### Examples:

- Are you happy?

### کیا تم خوش ہو؟

- Is he your friend?

### کیا وہ تمہارا دوست ہے؟

- Where are you going?

### تم کہاں جا رہے ہو؟

## Sentence Pattern Practice

### Pattern 1:

- I eat food.

### میں کھانا کھاتا ہوں

### Pattern 2:

- I do not eat food.

### میں کھانا نہیں کھاتا

### Pattern 3:

- Do I eat food?

### کیا میں کھانا کھاتا ہوں؟

## Real-Life Usage

### At Home

- I am eating.

### میں کھا رہا ہوں

- She is cooking.

### وہ کھانا بنا رہی ہے

### In Market

- I want this item.

### مجھے یہ چیز چاہیے

- Do you have this?

### کیا آپ کے پاس یہ ہے؟

### At School

- I am learning English.

### میں انگریزی سیکھ رہا ہوں

- The teacher is teaching.

### استاد پڑھا رہا ہے

## Common Mistakes

### ❌ Wrong: I eating food

### ✔ Correct: I am eating food

### میں کھانا کھا رہا ہوں

### ❌ Wrong: He go school

### ✔ Correct: He goes to school

### وہ سکول جاتا ہے

## Practice Section

### ✏️ Fill in the blanks:

- I ___ food.

- She ___ a book.

- They ___ cricket.

### Make Negative Sentences:

- I am happy → ______

- She is ready → ______

### Make Questions:

- You are tired → ______?

- He is at home → ______?

### Translate into English:

- میں پانی پیتا ہوں

- وہ کتاب پڑھتی ہے

- ہم سکول جاتے ہیں

## Chapter Summary`,
    },
    {
      slug: "chapter-3-parts-of-speech",
      title: "Parts of Speech",
      summary: "Parts of speech are the basic building blocks of English.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 2,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Parts of Speech

### What are Parts of Speech?

Parts of speech are the basic building blocks of English.

They tell us how words are used in a sentence.

### Simple idea:

Each word has a job in a sentence.

### Example:

- Ali is a good boy.

### علی ایک اچھا لڑکا ہے

### Here:

### Ali = Noun

### is = Verb

### good = Adjective

### boy = Noun

### Noun (Name of person, place, thing, or idea)

A noun is a name.

### Examples:

- Ali is my friend.

### علی میرا دوست ہے

- This is a book.

### یہ ایک کتاب ہے

- Kashmir is beautiful.

### کشمیر خوبصورت ہے

- I have a car.

### میرے پاس ایک گاڑی ہے

### Pronoun (Used instead of noun)

A pronoun replaces a noun.

### Examples:

- Ali is my friend. He is kind.

### علی میرا دوست ہے۔ وہ مہربان ہے

- Sara is happy. She is smiling.

### سارہ خوش ہے۔ وہ مسکرا رہی ہے

- This is my book. It is new.

### یہ میری کتاب ہے۔ یہ نئی ہے

### Verb (Action word)

A verb shows action or state.

### Examples:

- I run fast.

### میں تیزی سے دوڑتا ہوں

- She eats food.

### وہ کھانا کھاتی ہے

- He is happy.

### وہ خوش ہے

### Adjective (Describes a noun)

An adjective gives more information about a noun.

### Examples:

- It is a big house.

### یہ ایک بڑا گھر ہے

- She is a smart girl.

### وہ ایک ذہین لڑکی ہے

- I have a red car.

### میرے پاس ایک سرخ گاڑی ہے

### Adverb (Describes a verb)

An adverb tells how, when, or where.

### Examples:

- He runs quickly.

### وہ تیزی سے دوڑتا ہے

- She speaks softly.

### وہ آہستہ بولتی ہے

- I wake up early.

### میں جلدی اٹھتا ہوں

### Preposition (Shows position)

A preposition shows place or position.

### Examples:

- The book is on the table.

### کتاب میز پر ہے

- The cat is under the chair.

### بلی کرسی کے نیچے ہے

- He is in the room.

### وہ کمرے میں ہے

### Conjunction (Joins words or sentences)

A conjunction connects words or sentences.

### Examples:

- I like tea and coffee.

### مجھے چائے اور کافی پسند ہے

- She is tired but happy.

### وہ تھکی ہوئی ہے لیکن خوش ہے

### Interjection (Shows emotion)

An interjection shows sudden feeling.

### Examples:

- Wow! This is amazing.

### واہ! یہ حیرت انگیز ہے

- Oh! I forgot.

### اوہ! میں بھول گیا

### Easy Way to Remember

### Noun = Name

### Pronoun = Replace name

### Verb = Action

### Adjective = Describe noun

### Adverb = Describe verb

### Preposition = Position

### Conjunction = Join

### Interjection = Emotion

### Real-Life Usage

### At Home

- My mother cooks delicious food.

### میری ماں مزیدار کھانا پکاتی ہے

### In Market

- This is a cheap product.

### یہ ایک سستی چیز ہے

### At School

- The teacher explains clearly.

### استاد واضح طور پر سمجھاتا ہے

### Practice Section

### Fill in the blanks:

- ___ is my friend. (Pronoun)

- She ___ food. (Verb)

- This is a ___ car. (Adjective)

### Identify parts of speech:

- She runs fast.

- The book is on the table.

- He is a good boy.

### Make your own sentences:

- Use a noun

- Use a verb

- Use an adjective

### Translate into English:

- وہ تیزی سے دوڑتا ہے

- یہ ایک بڑی کتاب ہے

- وہ کمرے میں ہے

### Chapter Summary

Parts of speech are the building blocks of English.

Each word has a job.

Learning them helps you make correct sentences.

### Final Tip:

- I learn one part daily.

### میں روز ایک حصہ سیکھتا ہوں`,
    },
    {
      slug: "chapter-4-basic-speaking-patterns",
      title: "Basic Speaking Patterns",
      summary: "Speaking patterns are simple sentence forms that we use again and again in daily life.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 3,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Basic Speaking Patterns

### What are Speaking Patterns?

Speaking patterns are simple sentence forms that we use again and again in daily life.

If you learn these patterns, you can speak English easily.

### Simple idea:

Learn one pattern and use it with many words.

### Example:

- I am happy.

### میں خوش ہوں

### You can change words:

- I am tired.

### میں تھکا ہوا ہوں

- I am ready.

### میں تیار ہوں

### Pattern: I am + word

Use this pattern to talk about yourself.

### Examples:

- I am happy.

### میں خوش ہوں

- I am sad.

### میں اداس ہوں

- I am tired.

### میں تھکا ہوا ہوں

- I am ready.

### میں تیار ہوں

- I am busy.

### میں مصروف ہوں

- I am hungry.

### میں بھوکا ہوں

- I am learning English.

### میں انگریزی سیکھ رہا ہوں

- I am at home.

### میں گھر پر ہوں

### Pattern: I have + noun

Use this pattern to show possession.

### Examples:

- I have a book.

### میرے پاس ایک کتاب ہے

- I have a pen.

### میرے پاس ایک قلم ہے

- I have a car.

### میرے پاس ایک گاڑی ہے

- I have time.

### میرے پاس وقت ہے

- I have work.

### میرے پاس کام ہے

- I have a problem.

### میرے پاس ایک مسئلہ ہے

### Pattern: I want + noun / verb

Use this to express desire.

### Examples:

- I want water.

### مجھے پانی چاہیے

- I want food.

### مجھے کھانا چاہیے

- I want a job.

### مجھے نوکری چاہیے

- I want to learn English.

### میں انگریزی سیکھنا چاہتا ہوں

- I want to go home.

### میں گھر جانا چاہتا ہوں

- I want to sleep.

### میں سونا چاہتا ہوں

### Pattern: I can + verb

Use this to show ability.

### Examples:

- I can speak English.

### میں انگریزی بول سکتا ہوں

- I can drive a car.

### میں گاڑی چلا سکتا ہوں

- I can help you.

### میں آپ کی مدد کر سکتا ہوں

- I can understand.

### میں سمجھ سکتا ہوں

- I can do this work.

### میں یہ کام کر سکتا ہوں

### Pattern: I like + noun / verb

Use this to show liking.

### Examples:

- I like tea.

### مجھے چائے پسند ہے

- I like coffee.

### مجھے کافی پسند ہے

- I like cricket.

### مجھے کرکٹ پسند ہے

- I like reading.

### مجھے پڑھنا پسند ہے

- I like learning English.

### مجھے انگریزی سیکھنا پسند ہے

### Pattern: I don’t + verb

Use this for negative sentences.

### Examples:

- I do not like tea.

### مجھے چائے پسند نہیں ہے

- I do not understand.

### میں نہیں سمجھتا

- I do not go there.

### میں وہاں نہیں جاتا

- I do not eat junk food.

### میں فاسٹ فوڈ نہیں کھاتا

- I do not watch TV.

### میں ٹی وی نہیں دیکھتا

### Pattern: Do you + verb?

Use this to ask questions.

### Examples:

- Do you understand?

### کیا تم سمجھتے ہو؟

- Do you speak English?

### کیا تم انگریزی بولتے ہو؟

- Do you like tea?

### کیا تمہیں چائے پسند ہے؟

- Do you work here?

### کیا تم یہاں کام کرتے ہو؟

- Do you study daily?

### کیا تم روز پڑھتے ہو؟

### Pattern: Where / What / Why questions

Use these to ask information.

### Examples:

- Where are you going?

### تم کہاں جا رہے ہو؟

- What are you doing?

### تم کیا کر رہے ہو؟

- Why are you late?

### تم دیر سے کیوں آئے ہو؟

- When will you come?

### تم کب آؤ گے؟

- Who is he?

### وہ کون ہے؟

### Real-Life Usage

### At Home

- I am tired.

### میں تھکا ہوا ہوں

- I want food.

### مجھے کھانا چاہیے

### In Market

- I want this item.

### مجھے یہ چیز چاہیے

- Do you have this?

### کیا آپ کے پاس یہ ہے؟

### With Friends

- I like cricket.

### مجھے کرکٹ پسند ہے

- Where are you going?

### تم کہاں جا رہے ہو؟

### Mini Conversations

### Person A: What are you doing?

### تم کیا کر رہے ہو؟

Person B: I am studying.

### میں پڑھ رہا ہوں

### Person A: Do you like tea?

### کیا تمہیں چائے پسند ہے؟

Person B: Yes, I like tea.

### ہاں، مجھے چائے پسند ہے

### Person A: Where are you going?

### تم کہاں جا رہے ہو؟

Person B: I am going home.

### میں گھر جا رہا ہوں

### Practice Section

### Fill in the blanks:

- I ___ happy.

- I ___ a book.

- I ___ to learn English.

### Make sentences:

- I am ______

- I want ______

- I can ______

### Make questions:

- You speak English → ______?

- You like tea → ______?

### Translate into English:

- مجھے پانی چاہیے

- میں انگریزی سیکھ سکتا ہوں

- تم کہاں جا رہے ہو

### Chapter Summary

Speaking patterns help you speak quickly.

Learn one pattern and use many words.

### Final Tip:

- I practice speaking patterns daily.

### میں روز بولنے کے انداز کی مشق کرتا ہوں`,
    },
    {
      slug: "chapter-5-present-indefinite-tense",
      title: "Present Indefinite Tense",
      summary: "This tense tells what we do regularly.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 4,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Present Indefinite Tense

### What is Present Indefinite Tense?

### Present Indefinite Tense is used for:

- Daily routine

- Habits

- General facts

### Simple idea:

This tense tells what we do regularly.

### Example:

- I go to school.

### میں سکول جاتا ہوں

### Structure (Formula)

### Subject + Verb (1st form) + Object

### For he/she/it → add s / es with verb

### Use of Present Indefinite

### Use this tense for:

### Daily routine

- I wake up early.

### میں جلدی اٹھتا ہوں

### Habits

- She drinks tea daily.

### وہ روز چائے پیتی ہے

### General truth

- The sun rises in the east.

### سورج مشرق سے نکلتا ہے

### Examples (Affirmative Sentences)

- I eat food.

### میں کھانا کھاتا ہوں

- She reads a book.

### وہ کتاب پڑھتی ہے

- He plays cricket.

### وہ کرکٹ کھیلتا ہے

- They watch TV.

### وہ ٹی وی دیکھتے ہیں

- We learn English.

### ہم انگریزی سیکھتے ہیں

- I drink water.

### میں پانی پیتا ہوں

- She cooks food.

### وہ کھانا پکاتی ہے

- He goes to school.

### وہ سکول جاتا ہے

- They work hard.

### وہ محنت کرتے ہیں

- We help others.

### ہم دوسروں کی مدد کرتے ہیں

- I write a letter.

### میں خط لکھتا ہوں

- She sings a song.

### وہ گانا گاتی ہے

### Negative Sentences

### Structure:

### Subject + do/does + not + verb (base form)

### Examples:

- I do not eat junk food.

### میں فاسٹ فوڈ نہیں کھاتا

- She does not like tea.

### اسے چائے پسند نہیں ہے

- He does not play cricket.

### وہ کرکٹ نہیں کھیلتا

- They do not watch TV.

### وہ ٹی وی نہیں دیکھتے

- We do not waste time.

### ہم وقت ضائع نہیں کرتے

### Question Sentences

### Structure:

### Do/Does + Subject + Verb?

### Examples:

- Do you speak English?

### کیا تم انگریزی بولتے ہو؟

- Does she read books?

### کیا وہ کتابیں پڑھتی ہے؟

- Do they play cricket?

### کیا وہ کرکٹ کھیلتے ہیں؟

- Does he go to school?

### کیا وہ سکول جاتا ہے؟

- Do you understand me?

### کیا تم مجھے سمجھتے ہو؟

### Important Rule

### For he/she/it → use does in questions and negatives

### Verb stays in base form

### Example:

- She plays → Does she play?

### کیا وہ کھیلتی ہے؟

### Daily Conversation Examples

### Person A: Do you go to college?

### کیا تم کالج جاتے ہو؟

Person B: Yes, I go daily.

### ہاں، میں روز جاتا ہوں

### Person A: Does she work here?

### کیا وہ یہاں کام کرتی ہے؟

Person B: Yes, she works here.

### ہاں، وہ یہاں کام کرتی ہے

### Person A: Do you drink tea?

### کیا تم چائے پیتے ہو؟

Person B: No, I do not drink tea.

### نہیں، میں چائے نہیں پیتا

### Real-Life Usage

### At Home

- I clean my room.

### میں اپنا کمرہ صاف کرتا ہوں

### At School

- I study English daily.

### میں روز انگریزی پڑھتا ہوں

### In Market

- I buy vegetables.

### میں سبزیاں خریدتا ہوں

### Practice Section

### Fill in the blanks:

- I ___ (eat) food.

- She ___ (read) a book.

- He ___ (play) cricket.

### Make negative sentences:

- I like tea → ______

- She plays cricket → ______

### Make questions:

- You speak English → ______?

- He goes to school → ______?

### Translate into English:

- میں سکول جاتا ہوں

- وہ چائے پیتی ہے

- ہم کرکٹ کھیلتے ہیں

### Chapter Summary

Present Indefinite is used for daily routine and habits.

Use base verb and add s/es for he/she/it.

### Final Tip:

- I practice daily sentences.

### میں روز جملوں کی مشق کرتا ہوں`,
    },
    {
      slug: "chapter-6-present-continuous-tense",
      title: "Present Continuous Tense",
      summary: "Present Continuous Tense is used for actions happening right now.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 5,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Present Continuous Tense

### What is Present Continuous Tense?

Present Continuous Tense is used for actions happening right now.

### Simple idea:

This tense tells what is happening at this moment.

### Example:

- I am eating food.

### میں کھانا کھا رہا ہوں

### Structure (Formula)

### Subject + is/am/are + Verb + ing

### Use:

- I → am

- He/She/It → is

- You/We/They → are

### Use of Present Continuous

### Use this tense for:

### Actions happening now

- She is reading a book.

### وہ کتاب پڑھ رہی ہے

### Temporary actions

- I am living here.

### میں یہاں رہ رہا ہوں

### Examples (Affirmative Sentences)

- I am eating food.

### میں کھانا کھا رہا ہوں

- She is reading a book.

### وہ کتاب پڑھ رہی ہے

- He is playing cricket.

### وہ کرکٹ کھیل رہا ہے

- They are watching TV.

### وہ ٹی وی دیکھ رہے ہیں

- We are learning English.

### ہم انگریزی سیکھ رہے ہیں

- I am drinking water.

### میں پانی پی رہا ہوں

- She is cooking food.

### وہ کھانا بنا رہی ہے

- He is going to school.

### وہ سکول جا رہا ہے

- They are working hard.

### وہ محنت کر رہے ہیں

- We are helping others.

### ہم دوسروں کی مدد کر رہے ہیں

- I am writing a letter.

### میں خط لکھ رہا ہوں

- She is singing a song.

### وہ گانا گا رہی ہے

### Negative Sentences

### Structure:

### Subject + is/am/are + not + Verb + ing

### Examples:

- I am not eating food.

### میں کھانا نہیں کھا رہا

- She is not reading a book.

### وہ کتاب نہیں پڑھ رہی

- He is not playing cricket.

### وہ کرکٹ نہیں کھیل رہا

- They are not watching TV.

### وہ ٹی وی نہیں دیکھ رہے

- We are not wasting time.

### ہم وقت ضائع نہیں کر رہے

### Question Sentences

### Structure:

### Is/Am/Are + Subject + Verb + ing?

### Examples:

- Are you eating food?

### کیا تم کھانا کھا رہے ہو؟

- Is she reading a book?

### کیا وہ کتاب پڑھ رہی ہے؟

- Is he playing cricket?

### کیا وہ کرکٹ کھیل رہا ہے؟

- Are they watching TV?

### کیا وہ ٹی وی دیکھ رہے ہیں؟

- Are you learning English?

### کیا تم انگریزی سیکھ رہے ہو؟

### Important Rules

### Add ing to the verb

- eat → eating

- play → playing

### Some verbs double the last letter

- run → running

- sit → sitting

### Daily Conversation Examples

### Person A: What are you doing?

### تم کیا کر رہے ہو؟

Person B: I am studying.

### میں پڑھ رہا ہوں

### Person A: Are you watching TV?

### کیا تم ٹی وی دیکھ رہے ہو؟

Person B: No, I am reading a book.

### نہیں، میں کتاب پڑھ رہا ہوں

### Person A: Is she cooking?

### کیا وہ کھانا بنا رہی ہے؟

Person B: Yes, she is cooking.

### ہاں، وہ کھانا بنا رہی ہے

### Real-Life Usage

### At Home

- I am cleaning my room.

### میں اپنا کمرہ صاف کر رہا ہوں

### At School

- I am listening to the teacher.

### میں استاد کی بات سن رہا ہوں

### In Market

- I am buying vegetables.

### میں سبزیاں خرید رہا ہوں

### Practice Section

### Fill in the blanks:

- I ___ (eat) food.

- She ___ (read) a book.

- They ___ (play) cricket.

### Make negative sentences:

- I am watching TV → ______

- She is cooking → ______

### Make questions:

- You are studying → ______?

- He is playing → ______?

### Translate into English:

- میں پانی پی رہا ہوں

- وہ کتاب پڑھ رہی ہے

- ہم کرکٹ کھیل رہے ہیں

### Chapter Summary

Present Continuous is used for actions happening now.

Use is/am/are + verb + ing.

### Final Tip:

- I speak what I am doing.

### میں وہی بولتا ہوں جو میں کر رہا ہوں`,
    },
    {
      slug: "chapter-7-present-perfect-tense",
      title: "Present Perfect Tense",
      summary: "Present Perfect Tense is used for actions that are completed recently or have a result in the present.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 6,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Present Perfect Tense

### What is Present Perfect Tense?

Present Perfect Tense is used for actions that are completed recently or have a result in the present.

### Simple idea:

This tense tells that something has already happened.

### Example:

- I have eaten food.

### میں کھانا کھا چکا ہوں

### Structure (Formula)

### Subject + has/have + Verb (3rd form)

### Use:

- I/You/We/They → have

- He/She/It → has

### Use of Present Perfect

### Use this tense for:

### Completed actions

- She has finished her work.

### وہ اپنا کام مکمل کر چکی ہے

### Recent actions

- I have just arrived.

### میں ابھی آیا ہوں

### Experience

- I have seen this movie.

### میں یہ فلم دیکھ چکا ہوں

### Examples (Affirmative Sentences)

- I have eaten food.

### میں کھانا کھا چکا ہوں

- She has read the book.

### وہ کتاب پڑھ چکی ہے

- He has played cricket.

### وہ کرکٹ کھیل چکا ہے

- They have watched TV.

### وہ ٹی وی دیکھ چکے ہیں

- We have learned English.

### ہم انگریزی سیکھ چکے ہیں

- I have drunk water.

### میں پانی پی چکا ہوں

- She has cooked food.

### وہ کھانا پکا چکی ہے

- He has gone to school.

### وہ سکول جا چکا ہے

- They have worked hard.

### وہ محنت کر چکے ہیں

- We have helped others.

### ہم دوسروں کی مدد کر چکے ہیں

- I have written a letter.

### میں خط لکھ چکا ہوں

- She has sung a song.

### وہ گانا گا چکی ہے

### Negative Sentences

### Structure:

### Subject + has/have + not + Verb (3rd form)

### Examples:

- I have not eaten food.

### میں نے کھانا نہیں کھایا

- She has not read the book.

### وہ کتاب نہیں پڑھ چکی

- He has not played cricket.

### وہ کرکٹ نہیں کھیل چکا

- They have not watched TV.

### وہ ٹی وی نہیں دیکھ چکے

- We have not finished work.

### ہم نے کام مکمل نہیں کیا

### Question Sentences

### Structure:

### Has/Have + Subject + Verb (3rd form)?

### Examples:

- Have you eaten food?

### کیا تم نے کھانا کھایا ہے؟

- Has she read the book?

### کیا وہ کتاب پڑھ چکی ہے؟

- Has he played cricket?

### کیا وہ کرکٹ کھیل چکا ہے؟

- Have they watched TV?

### کیا وہ ٹی وی دیکھ چکے ہیں؟

- Have you finished your work?

### کیا تم نے اپنا کام مکمل کیا ہے؟

### Important Rules

### Use 3rd form of verb

- eat → eaten

- go → gone

- write → written

### Use "has" for he/she/it

### Use "have" for others

### Daily Conversation Examples

### Person A: Have you eaten food?

### کیا تم نے کھانا کھایا ہے؟

Person B: Yes, I have eaten.

### ہاں، میں کھا چکا ہوں

### Person A: Has she finished work?

### کیا اس نے کام مکمل کیا ہے؟

Person B: Yes, she has finished.

### ہاں، اس نے مکمل کر لیا ہے

### Person A: Have you seen this movie?

### کیا تم نے یہ فلم دیکھی ہے؟

Person B: No, I have not seen it.

### نہیں، میں نے یہ نہیں دیکھی

### Real-Life Usage

### At Home

- I have cleaned my room.

### میں اپنا کمرہ صاف کر چکا ہوں

### At School

- I have completed my homework.

### میں اپنا ہوم ورک مکمل کر چکا ہوں

### In Market

- I have bought vegetables.

### میں سبزیاں خرید چکا ہوں

### Practice Section

### Fill in the blanks:

- I ___ (eat) food.

- She ___ (read) the book.

- They ___ (finish) work.

### Make negative sentences:

- I have eaten food → ______

- She has finished work → ______

### Make questions:

- You have completed work → ______?

- He has gone home → ______?

### Translate into English:

- میں کھانا کھا چکا ہوں

- وہ کتاب پڑھ چکی ہے

- ہم کام مکمل کر چکے ہیں

### Chapter Summary

Present Perfect is used for completed actions.

Use has/have + 3rd form of verb.

### Final Tip:

- I use this tense for completed work.

### میں اس زمانے کو مکمل کام کے لیے استعمال کرتا ہوں`,
    },
    {
      slug: "chapter-8-present-perfect-continuous-tense",
      title: "Present Perfect Continuous Tense",
      summary: "Present Perfect Continuous Tense is used for actions that started in the past and are still continuing now.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 7,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Present Perfect Continuous Tense

### What is Present Perfect Continuous Tense?

Present Perfect Continuous Tense is used for actions that started in the past and are still continuing now.

### Simple idea:

This tense tells that something started before and is still going on.

### Example:

- I have been studying for two hours.

### میں دو گھنٹے سے پڑھ رہا ہوں

### Structure (Formula)

### Subject + has/have been + Verb + ing

### Use:

- I/You/We/They → have been

- He/She/It → has been

### Use of Present Perfect Continuous

### Use this tense for:

### Actions continuing from past until now

- She has been reading since morning.

### وہ صبح سے پڑھ رہی ہے

### Duration (for/since)

- I have been working for two hours.

### میں دو گھنٹے سے کام کر رہا ہوں

### Use of "Since" and "For"

### Since = specific time (since morning, since 2 PM)

### For = duration (for two hours, for many days)

### Examples:

- I have been studying since morning.

### میں صبح سے پڑھ رہا ہوں

- She has been working for two hours.

### وہ دو گھنٹے سے کام کر رہی ہے

### Examples (Affirmative Sentences)

- I have been studying for two hours.

### میں دو گھنٹے سے پڑھ رہا ہوں

- She has been reading since morning.

### وہ صبح سے پڑھ رہی ہے

- He has been playing cricket for a long time.

### وہ کافی دیر سے کرکٹ کھیل رہا ہے

- They have been watching TV for one hour.

### وہ ایک گھنٹے سے ٹی وی دیکھ رہے ہیں

- We have been learning English for many days.

### ہم کئی دنوں سے انگریزی سیکھ رہے ہیں

- I have been working since 9 AM.

### میں صبح 9 بجے سے کام کر رہا ہوں

- She has been cooking for one hour.

### وہ ایک گھنٹے سے کھانا بنا رہی ہے

- He has been sleeping for two hours.

### وہ دو گھنٹے سے سو رہا ہے

- They have been talking for a long time.

### وہ کافی دیر سے بات کر رہے ہیں

- We have been waiting since morning.

### ہم صبح سے انتظار کر رہے ہیں

- I have been writing for one hour.

### میں ایک گھنٹے سے لکھ رہا ہوں

- She has been singing for a long time.

### وہ کافی دیر سے گا رہی ہے

### Negative Sentences

### Structure:

### Subject + has/have not been + Verb + ing

### Examples:

- I have not been studying.

### میں پڑھ نہیں رہا ہوں

- She has not been reading.

### وہ نہیں پڑھ رہی ہے

- He has not been working.

### وہ کام نہیں کر رہا ہے

- They have not been watching TV.

### وہ ٹی وی نہیں دیکھ رہے ہیں

- We have not been waiting long.

### ہم زیادہ دیر سے انتظار نہیں کر رہے

### Question Sentences

### Structure:

### Has/Have + Subject + been + Verb + ing?

### Examples:

- Have you been studying?

### کیا تم پڑھ رہے ہو؟

- Has she been reading since morning?

### کیا وہ صبح سے پڑھ رہی ہے؟

- Has he been playing cricket?

### کیا وہ کرکٹ کھیل رہا ہے؟

- Have they been watching TV?

### کیا وہ ٹی وی دیکھ رہے ہیں؟

- Have you been working since morning?

### کیا تم صبح سے کام کر رہے ہو؟

### Important Rules

### Use "been" in every sentence

### Use verb + ing

### Use "since" or "for" to show time

### Daily Conversation Examples

### Person A: What have you been doing?

### تم کیا کر رہے ہو (کچھ وقت سے)؟

Person B: I have been studying.

### میں پڑھ رہا ہوں

### Person A: Have you been working since morning?

### کیا تم صبح سے کام کر رہے ہو؟

Person B: Yes, I have been working.

### ہاں، میں کام کر رہا ہوں

### Person A: Has she been waiting long?

### کیا وہ کافی دیر سے انتظار کر رہی ہے؟

Person B: Yes, she has been waiting.

### ہاں، وہ انتظار کر رہی ہے

### Real-Life Usage

### At Home

- I have been cleaning my room for one hour.

### میں ایک گھنٹے سے اپنا کمرہ صاف کر رہا ہوں

### At School

- I have been studying English since morning.

### میں صبح سے انگریزی پڑھ رہا ہوں

### In Market

- I have been standing here for a long time.

### میں کافی دیر سے یہاں کھڑا ہوں

### Practice Section

### Fill in the blanks:

- I ___ been studying.

- She ___ been reading.

- They ___ been working.

### Make negative sentences:

- I have been studying → ______

- She has been cooking → ______

### Make questions:

- You have been working → ______?

- He has been playing → ______?

### Translate into English:

- میں دو گھنٹے سے پڑھ رہا ہوں

- وہ صبح سے کام کر رہی ہے

- ہم کافی دیر سے انتظار کر رہے ہیں

### Chapter Summary

Present Perfect Continuous is used for actions continuing from past until now.

Use has/have been + verb + ing.

### Final Tip:

- I use since and for correctly.

### میں since اور for کو درست استعمال کرتا ہوں`,
    },
    {
      slug: "chapter-9-past-indefinite-tense",
      title: "Past Indefinite Tense",
      summary: "Past Indefinite Tense is used for actions that happened in the past and are finished.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 8,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Past Indefinite Tense

### What is Past Indefinite Tense?

Past Indefinite Tense is used for actions that happened in the past and are finished.

### Simple idea:

This tense tells what happened yesterday, before, or in the past.

### Example:

- I went to school.

### میں سکول گیا

### Structure (Formula)

### Subject + Verb (2nd form) + Object

### Use of Past Indefinite

### Use this tense for:

### Completed actions in the past

- She finished her work.

### اس نے اپنا کام مکمل کیا

### Past events

- I watched a movie yesterday.

### میں نے کل فلم دیکھی

### Examples (Affirmative Sentences)

- I ate food.

### میں نے کھانا کھایا

- She read a book.

### اس نے کتاب پڑھی

- He played cricket.

### اس نے کرکٹ کھیلی

- They watched TV.

### انہوں نے ٹی وی دیکھا

- We learned English.

### ہم نے انگریزی سیکھی

- I drank water.

### میں نے پانی پیا

- She cooked food.

### اس نے کھانا پکایا

- He went to school.

### وہ سکول گیا

- They worked hard.

### انہوں نے محنت کی

- We helped others.

### ہم نے دوسروں کی مدد کی

- I wrote a letter.

### میں نے خط لکھا

- She sang a song.

### اس نے گانا گایا

### Negative Sentences

### Structure:

### Subject + did not + Verb (base form)

### Examples:

- I did not eat food.

### میں نے کھانا نہیں کھایا

- She did not read the book.

### اس نے کتاب نہیں پڑھی

- He did not play cricket.

### اس نے کرکٹ نہیں کھیلی

- They did not watch TV.

### انہوں نے ٹی وی نہیں دیکھا

- We did not finish work.

### ہم نے کام مکمل نہیں کیا

### Question Sentences

### Structure:

### Did + Subject + Verb (base form)?

### Examples:

- Did you eat food?

### کیا تم نے کھانا کھایا؟

- Did she read the book?

### کیا اس نے کتاب پڑھی؟

- Did he play cricket?

### کیا اس نے کرکٹ کھیلی؟

- Did they watch TV?

### کیا انہوں نے ٹی وی دیکھا؟

- Did you complete your work?

### کیا تم نے اپنا کام مکمل کیا؟

### Important Rules

### Use 2nd form of verb in positive sentences

### Use base form after "did"

### Example:

- She went → Did she go?

### کیا وہ گئی؟

### Daily Conversation Examples

### Person A: Did you go to school yesterday?

### کیا تم کل سکول گئے تھے؟

Person B: Yes, I went to school.

### ہاں، میں سکول گیا تھا

### Person A: Did she finish her work?

### کیا اس نے اپنا کام مکمل کیا؟

Person B: Yes, she finished her work.

### ہاں، اس نے اپنا کام مکمل کیا

### Person A: Did you watch the movie?

### کیا تم نے فلم دیکھی؟

Person B: No, I did not watch it.

### نہیں، میں نے یہ نہیں دیکھی

### Real-Life Usage

### At Home

- I cleaned my room.

### میں نے اپنا کمرہ صاف کیا

### At School

- I completed my homework.

### میں نے اپنا ہوم ورک مکمل کیا

### In Market

- I bought vegetables.

### میں نے سبزیاں خریدیں

### Practice Section

### Fill in the blanks:

- I ___ (eat) food.

- She ___ (read) a book.

- They ___ (play) cricket.

### Make negative sentences:

- I ate food → ______

- She finished work → ______

### Make questions:

- You went home → ______?

- He played cricket → ______?

### Translate into English:

- میں نے کھانا کھایا

- اس نے کتاب پڑھی

- ہم سکول گئے

### Chapter Summary

Past Indefinite is used for finished actions in the past.

Use 2nd form of verb.

### Final Tip:

- I talk about yesterday using this tense.

### میں اس زمانے کو کل کے بارے میں بات کرنے کے لیے استعمال کرتا ہوں`,
    },
    {
      slug: "chapter-10-past-continuous-tense",
      title: "Past Continuous Tense",
      summary: "Past Continuous Tense is used for actions that were happening in the past at a specific time.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 9,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Past Continuous Tense

### What is Past Continuous Tense?

Past Continuous Tense is used for actions that were happening in the past at a specific time.

### Simple idea:

This tense tells what was going on in the past.

### Example:

- I was eating food.

### میں کھانا کھا رہا تھا

### Structure (Formula)

### Subject + was/were + Verb + ing

### Use:

- I/He/She/It → was

- You/We/They → were

### Use of Past Continuous

### Use this tense for:

### Actions happening in the past

- She was reading a book.

### وہ کتاب پڑھ رہی تھی

### Two actions in the past

- I was studying when he came.

### میں پڑھ رہا تھا جب وہ آیا

### Examples (Affirmative Sentences)

- I was eating food.

### میں کھانا کھا رہا تھا

- She was reading a book.

### وہ کتاب پڑھ رہی تھی

- He was playing cricket.

### وہ کرکٹ کھیل رہا تھا

- They were watching TV.

### وہ ٹی وی دیکھ رہے تھے

- We were learning English.

### ہم انگریزی سیکھ رہے تھے

- I was drinking water.

### میں پانی پی رہا تھا

- She was cooking food.

### وہ کھانا بنا رہی تھی

- He was going to school.

### وہ سکول جا رہا تھا

- They were working hard.

### وہ محنت کر رہے تھے

- We were helping others.

### ہم دوسروں کی مدد کر رہے تھے

- I was writing a letter.

### میں خط لکھ رہا تھا

- She was singing a song.

### وہ گانا گا رہی تھی

### Negative Sentences

### Structure:

### Subject + was/were + not + Verb + ing

### Examples:

- I was not eating food.

### میں کھانا نہیں کھا رہا تھا

- She was not reading a book.

### وہ کتاب نہیں پڑھ رہی تھی

- He was not playing cricket.

### وہ کرکٹ نہیں کھیل رہا تھا

- They were not watching TV.

### وہ ٹی وی نہیں دیکھ رہے تھے

- We were not working.

### ہم کام نہیں کر رہے تھے

### Question Sentences

### Structure:

### Was/Were + Subject + Verb + ing?

### Examples:

- Were you eating food?

### کیا تم کھانا کھا رہے تھے؟

- Was she reading a book?

### کیا وہ کتاب پڑھ رہی تھی؟

- Was he playing cricket?

### کیا وہ کرکٹ کھیل رہا تھا؟

- Were they watching TV?

### کیا وہ ٹی وی دیکھ رہے تھے؟

- Were you studying?

### کیا تم پڑھ رہے تھے؟

### Important Rules

### Always use verb + ing

### Use was/were correctly

### Daily Conversation Examples

### Person A: What were you doing?

### تم کیا کر رہے تھے؟

Person B: I was studying.

### میں پڑھ رہا تھا

### Person A: Were you watching TV?

### کیا تم ٹی وی دیکھ رہے تھے؟

Person B: No, I was reading a book.

### نہیں، میں کتاب پڑھ رہا تھا

### Person A: Was she cooking?

### کیا وہ کھانا بنا رہی تھی؟

Person B: Yes, she was cooking.

### ہاں، وہ کھانا بنا رہی تھی

### Real-Life Usage

### At Home

- I was cleaning my room.

### میں اپنا کمرہ صاف کر رہا تھا

### At School

- I was listening to the teacher.

### میں استاد کی بات سن رہا تھا

### In Market

- I was buying vegetables.

### میں سبزیاں خرید رہا تھا

### Practice Section

### Fill in the blanks:

- I ___ (eat) food.

- She ___ (read) a book.

- They ___ (play) cricket.

### Make negative sentences:

- I was watching TV → ______

- She was cooking → ______

### Make questions:

- You were studying → ______?

- He was playing → ______?

### Translate into English:

- میں پانی پی رہا تھا

- وہ کتاب پڑھ رہی تھی

- ہم کرکٹ کھیل رہے تھے

### Chapter Summary

Past Continuous is used for actions happening in the past.

Use was/were + verb + ing.

### Final Tip:

- I describe past situations using this tense.

### میں اس زمانے کو ماضی کے حالات بیان کرنے کے لیے استعمال کرتا ہوں`,
    },
    {
      slug: "chapter-11-past-perfect-tense",
      title: "Past Perfect Tense",
      summary: "Past Perfect Tense is used for an action that was completed before another action in the past.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 10,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Past Perfect Tense

### What is Past Perfect Tense?

Past Perfect Tense is used for an action that was completed before another action in the past.

### Simple idea:

One action happened first, then another action happened.

### Example:

- I had finished my work before he came.

### میں اس کے آنے سے پہلے اپنا کام مکمل کر چکا تھا

### Structure (Formula)

### Subject + had + Verb (3rd form)

### Use of Past Perfect

### Use this tense for:

### An earlier past action

- She had left before I arrived.

### وہ میرے پہنچنے سے پہلے جا چکی تھی

### Two past actions (first action uses past perfect)

- I had eaten food before going out.

### میں باہر جانے سے پہلے کھانا کھا چکا تھا

### Examples (Affirmative Sentences)

- I had eaten food.

### میں کھانا کھا چکا تھا

- She had read the book.

### وہ کتاب پڑھ چکی تھی

- He had played cricket.

### وہ کرکٹ کھیل چکا تھا

- They had watched TV.

### وہ ٹی وی دیکھ چکے تھے

- We had learned English.

### ہم انگریزی سیکھ چکے تھے

- I had drunk water.

### میں پانی پی چکا تھا

- She had cooked food.

### وہ کھانا پکا چکی تھی

- He had gone to school.

### وہ سکول جا چکا تھا

- They had worked hard.

### وہ محنت کر چکے تھے

- We had helped others.

### ہم دوسروں کی مدد کر چکے تھے

- I had written a letter.

### میں خط لکھ چکا تھا

- She had sung a song.

### وہ گانا گا چکی تھی

### Negative Sentences

### Structure:

### Subject + had not + Verb (3rd form)

### Examples:

- I had not eaten food.

### میں نے کھانا نہیں کھایا تھا

- She had not read the book.

### وہ کتاب نہیں پڑھ چکی تھی

- He had not played cricket.

### وہ کرکٹ نہیں کھیل چکا تھا

- They had not watched TV.

### وہ ٹی وی نہیں دیکھ چکے تھے

- We had not finished work.

### ہم نے کام مکمل نہیں کیا تھا

### Question Sentences

### Structure:

### Had + Subject + Verb (3rd form)?

### Examples:

- Had you eaten food?

### کیا تم نے کھانا کھایا تھا؟

- Had she read the book?

### کیا وہ کتاب پڑھ چکی تھی؟

- Had he played cricket?

### کیا وہ کرکٹ کھیل چکا تھا؟

- Had they watched TV?

### کیا وہ ٹی وی دیکھ چکے تھے؟

- Had you finished your work?

### کیا تم نے اپنا کام مکمل کیا تھا؟

### Important Rules

### Use "had" with all subjects

### Always use 3rd form of verb

### Two Actions Example (Very Important)

- I had finished my work before he came.

### میں اس کے آنے سے پہلے اپنا کام مکمل کر چکا تھا

- She had left when I reached.

### جب میں پہنچا تو وہ جا چکی تھی

### Daily Conversation Examples

### Person A: Had you completed your work before the meeting?

### کیا تم نے میٹنگ سے پہلے اپنا کام مکمل کیا تھا؟

Person B: Yes, I had completed it.

### ہاں، میں مکمل کر چکا تھا

### Person A: Had she left before you arrived?

### کیا وہ تمہارے پہنچنے سے پہلے جا چکی تھی؟

Person B: Yes, she had left.

### ہاں، وہ جا چکی تھی

### Person A: Had you eaten food before going out?

### کیا تم باہر جانے سے پہلے کھانا کھا چکے تھے؟

Person B: No, I had not eaten.

### نہیں، میں نے نہیں کھایا تھا

### Real-Life Usage

### At Home

- I had cleaned my room before guests arrived.

### میں نے مہمانوں کے آنے سے پہلے کمرہ صاف کر لیا تھا

### At School

- I had completed my homework before class.

### میں نے کلاس سے پہلے ہوم ورک مکمل کر لیا تھا

### In Market

- I had bought vegetables before going home.

### میں نے گھر جانے سے پہلے سبزیاں خرید لی تھیں

### Practice Section

### Fill in the blanks:

- I ___ (eat) food before he came.

- She ___ (read) the book before the exam.

- They ___ (finish) work before evening.

### Make negative sentences:

- I had eaten food → ______

- She had finished work → ______

### Make questions:

- You had completed work → ______?

- He had gone home → ______?

### Translate into English:

- میں کھانا کھا چکا تھا

- وہ کتاب پڑھ چکی تھی

- ہم کام مکمل کر چکے تھے

### Chapter Summary

Past Perfect is used for an action completed before another past action.

Use had + 3rd form of verb.

### Final Tip:

- I use this tense for two past actions.

### میں اس زمانے کو دو ماضی کے کاموں کے لیے استعمال کرتا ہوں`,
    },
    {
      slug: "chapter-12-past-perfect-continuous-tense",
      title: "Past Perfect Continuous Tense",
      summary: "Past Perfect Continuous Tense is used for actions that started in the past, continued for some time, and then stopped before another past action.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 11,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Past Perfect Continuous Tense

### What is Past Perfect Continuous Tense?

Past Perfect Continuous Tense is used for actions that started in the past, continued for some time, and then stopped before another past action.

### Simple idea:

An action was going on for some time in the past before something else happened.

### Example:

- I had been studying for two hours before he came.

### میں اس کے آنے سے پہلے دو گھنٹے سے پڑھ رہا تھا

### Structure (Formula)

### Subject + had been + Verb + ing

### Use of Past Perfect Continuous

### Use this tense for:

### Duration before another past action

- She had been working for two hours before the meeting started.

### وہ میٹنگ شروع ہونے سے پہلے دو گھنٹے سے کام کر رہی تھی

### Long actions in the past

- I had been waiting since morning before the bus arrived.

### میں بس آنے سے پہلے صبح سے انتظار کر رہا تھا

### Use of "Since" and "For"

### Since = specific time (since morning, since 5 PM)

### For = duration (for two hours, for many days)

### Examples:

- I had been studying since morning.

### میں صبح سے پڑھ رہا تھا

- She had been working for two hours.

### وہ دو گھنٹے سے کام کر رہی تھی

### Examples (Affirmative Sentences)

- I had been studying for two hours.

### میں دو گھنٹے سے پڑھ رہا تھا

- She had been reading since morning.

### وہ صبح سے پڑھ رہی تھی

- He had been playing cricket for a long time.

### وہ کافی دیر سے کرکٹ کھیل رہا تھا

- They had been watching TV for one hour.

### وہ ایک گھنٹے سے ٹی وی دیکھ رہے تھے

- We had been learning English for many days.

### ہم کئی دنوں سے انگریزی سیکھ رہے تھے

- I had been working since 9 AM.

### میں صبح 9 بجے سے کام کر رہا تھا

- She had been cooking for one hour.

### وہ ایک گھنٹے سے کھانا بنا رہی تھی

- He had been sleeping for two hours.

### وہ دو گھنٹے سے سو رہا تھا

- They had been talking for a long time.

### وہ کافی دیر سے بات کر رہے تھے

- We had been waiting since morning.

### ہم صبح سے انتظار کر رہے تھے

- I had been writing for one hour.

### میں ایک گھنٹے سے لکھ رہا تھا

- She had been singing for a long time.

### وہ کافی دیر سے گا رہی تھی

### Negative Sentences

### Structure:

### Subject + had not been + Verb + ing

### Examples:

- I had not been studying.

### میں پڑھ نہیں رہا تھا

- She had not been reading.

### وہ نہیں پڑھ رہی تھی

- He had not been working.

### وہ کام نہیں کر رہا تھا

- They had not been watching TV.

### وہ ٹی وی نہیں دیکھ رہے تھے

- We had not been waiting long.

### ہم زیادہ دیر سے انتظار نہیں کر رہے تھے

### Question Sentences

### Structure:

### Had + Subject + been + Verb + ing?

### Examples:

- Had you been studying?

### کیا تم پڑھ رہے تھے؟

- Had she been reading since morning?

### کیا وہ صبح سے پڑھ رہی تھی؟

- Had he been playing cricket?

### کیا وہ کرکٹ کھیل رہا تھا؟

- Had they been watching TV?

### کیا وہ ٹی وی دیکھ رہے تھے؟

- Had you been working since morning?

### کیا تم صبح سے کام کر رہے تھے؟

### Important Rules

### Always use "had been"

### Use verb + ing

### Use "since" or "for" for time

### Two Actions Example

- I had been studying for two hours before he came.

### میں اس کے آنے سے پہلے دو گھنٹے سے پڑھ رہا تھا

- She had been waiting since morning before the bus arrived.

### وہ بس آنے سے پہلے صبح سے انتظار کر رہی تھی

### Daily Conversation Examples

### Person A: What had you been doing before I called you?

### تم میرے فون کرنے سے پہلے کیا کر رہے تھے؟

Person B: I had been studying.

### میں پڑھ رہا تھا

### Person A: Had you been working before the meeting started?

### کیا تم میٹنگ شروع ہونے سے پہلے کام کر رہے تھے؟

Person B: Yes, I had been working.

### ہاں، میں کام کر رہا تھا

### Person A: Had she been waiting long before you arrived?

### کیا وہ تمہارے پہنچنے سے پہلے کافی دیر سے انتظار کر رہی تھی؟

Person B: Yes, she had been waiting.

### ہاں، وہ انتظار کر رہی تھی

### Real-Life Usage

### At Home

- I had been cleaning my room before guests arrived.

### میں مہمانوں کے آنے سے پہلے کمرہ صاف کر رہا تھا

### At School

- I had been studying English before the test started.

### میں ٹیسٹ شروع ہونے سے پہلے انگریزی پڑھ رہا تھا

### In Market

- I had been standing there before the shop opened.

### میں دکان کھلنے سے پہلے وہاں کھڑا تھا

### Practice Section

### Fill in the blanks:

- I ___ been studying.

- She ___ been reading.

- They ___ been working.

### Make negative sentences:

- I had been studying → ______

- She had been cooking → ______

### Make questions:

- You had been working → ______?

- He had been playing → ______?

### Translate into English:

- میں دو گھنٹے سے پڑھ رہا تھا

- وہ صبح سے کام کر رہی تھی

- ہم کافی دیر سے انتظار کر رہے تھے

### Chapter Summary

Past Perfect Continuous is used for long actions in the past before another action.

Use had been + verb + ing.

### Final Tip:

- I use this tense for duration in past.

### میں اس زمانے کو ماضی میں دورانیہ ظاہر کرنے کے لیے استعمال کرتا ہوں`,
    },
      ],
    },
    {
      slug: "part-2",
      title: "Part 2 — Chapters 13–24",
      summary: "Chapters 13 to 24 of Master English Easily.",
      order: 2,
      difficulty: "beginner",
      estimatedMinutes: 360,
      tutorials: [
    {
      slug: "chapter-13-future-indefinite-tense",
      title: "Future Indefinite Tense",
      summary: "Future Indefinite Tense is used for actions that will happen in the future.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 12,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Future Indefinite Tense

### What is Future Indefinite Tense?

Future Indefinite Tense is used for actions that will happen in the future.

### Simple idea:

This tense tells what will happen later.

### Example:

- I will go to school.

### میں سکول جاؤں گا

### Structure (Formula)

### Subject + will + Verb (base form)

### Use of Future Indefinite

### Use this tense for:

### Future plans

- I will study tomorrow.

### میں کل پڑھوں گا

### Decisions

- I will help you.

### میں تمہاری مدد کروں گا

### Promises

- I will call you.

### میں تمہیں فون کروں گا

### Examples (Affirmative Sentences)

- I will eat food.

### میں کھانا کھاؤں گا

- She will read a book.

### وہ کتاب پڑھے گی

- He will play cricket.

### وہ کرکٹ کھیلے گا

- They will watch TV.

### وہ ٹی وی دیکھیں گے

- We will learn English.

### ہم انگریزی سیکھیں گے

- I will drink water.

### میں پانی پیوں گا

- She will cook food.

### وہ کھانا پکائے گی

- He will go to school.

### وہ سکول جائے گا

- They will work hard.

### وہ محنت کریں گے

- We will help others.

### ہم دوسروں کی مدد کریں گے

- I will write a letter.

### میں خط لکھوں گا

- She will sing a song.

### وہ گانا گائے گی

### Negative Sentences

### Structure:

### Subject + will not + Verb

### Examples:

- I will not eat junk food.

### میں فاسٹ فوڈ نہیں کھاؤں گا

- She will not read the book.

### وہ کتاب نہیں پڑھے گی

- He will not play cricket.

### وہ کرکٹ نہیں کھیلے گا

- They will not watch TV.

### وہ ٹی وی نہیں دیکھیں گے

- We will not waste time.

### ہم وقت ضائع نہیں کریں گے

### Question Sentences

### Structure:

### Will + Subject + Verb?

### Examples:

- Will you eat food?

### کیا تم کھانا کھاؤ گے؟

- Will she read the book?

### کیا وہ کتاب پڑھے گی؟

- Will he play cricket?

### کیا وہ کرکٹ کھیلے گا؟

- Will they watch TV?

### کیا وہ ٹی وی دیکھیں گے؟

- Will you help me?

### کیا تم میری مدد کرو گے؟

### Important Rules

### Use "will" with all subjects

### Use base form of verb

### Daily Conversation Examples

### Person A: Will you go to college tomorrow?

### کیا تم کل کالج جاؤ گے؟

Person B: Yes, I will go.

### ہاں، میں جاؤں گا

### Person A: Will she complete her work?

### کیا وہ اپنا کام مکمل کرے گی؟

Person B: Yes, she will complete it.

### ہاں، وہ مکمل کرے گی

### Person A: Will you help me?

### کیا تم میری مدد کرو گے؟

Person B: Yes, I will help you.

### ہاں، میں تمہاری مدد کروں گا

### Real-Life Usage

### At Home

- I will clean my room.

### میں اپنا کمرہ صاف کروں گا

### At School

- I will study for the exam.

### میں امتحان کے لیے پڑھوں گا

### In Market

- I will buy vegetables.

### میں سبزیاں خریدوں گا

### Practice Section

### Fill in the blanks:

- I ___ (eat) food.

- She ___ (read) a book.

- They ___ (play) cricket.

### Make negative sentences:

- I will eat food → ______

- She will go to school → ______

### Make questions:

- You will help me → ______?

- He will play cricket → ______?

### Translate into English:

- میں کل سکول جاؤں گا

- وہ کتاب پڑھے گی

- ہم کام کریں گے

### Chapter Summary

Future Indefinite is used for future actions.

Use will + base form of verb.

### Final Tip:

- I talk about future using this tense.

### میں اس زمانے کو مستقبل کے لیے استعمال کرتا ہوں`,
    },
    {
      slug: "chapter-14-future-continuous-tense",
      title: "Future Continuous Tense",
      summary: "Future Continuous Tense is used for actions that will be happening at a specific time in the future.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 13,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Future Continuous Tense

### What is Future Continuous Tense?

Future Continuous Tense is used for actions that will be happening at a specific time in the future.

### Simple idea:

This tense tells what will be going on in the future.

### Example:

- I will be studying.

### میں پڑھ رہا ہوں گا

### Structure (Formula)

### Subject + will be + Verb + ing

### Use of Future Continuous

### Use this tense for:

### Actions in progress in future

- She will be reading a book.

### وہ کتاب پڑھ رہی ہوگی

### Planned future actions

- I will be working tomorrow.

### میں کل کام کر رہا ہوں گا

### Examples (Affirmative Sentences)

- I will be eating food.

### میں کھانا کھا رہا ہوں گا

- She will be reading a book.

### وہ کتاب پڑھ رہی ہوگی

- He will be playing cricket.

### وہ کرکٹ کھیل رہا ہوگا

- They will be watching TV.

### وہ ٹی وی دیکھ رہے ہوں گے

- We will be learning English.

### ہم انگریزی سیکھ رہے ہوں گے

- I will be drinking water.

### میں پانی پی رہا ہوں گا

- She will be cooking food.

### وہ کھانا بنا رہی ہوگی

- He will be going to school.

### وہ سکول جا رہا ہوگا

- They will be working hard.

### وہ محنت کر رہے ہوں گے

- We will be helping others.

### ہم دوسروں کی مدد کر رہے ہوں گے

- I will be writing a letter.

### میں خط لکھ رہا ہوں گا

- She will be singing a song.

### وہ گانا گا رہی ہوگی

### Negative Sentences

### Structure:

### Subject + will not be + Verb + ing

### Examples:

- I will not be eating food.

### میں کھانا نہیں کھا رہا ہوں گا

- She will not be reading a book.

### وہ کتاب نہیں پڑھ رہی ہوگی

- He will not be playing cricket.

### وہ کرکٹ نہیں کھیل رہا ہوگا

- They will not be watching TV.

### وہ ٹی وی نہیں دیکھ رہے ہوں گے

- We will not be wasting time.

### ہم وقت ضائع نہیں کر رہے ہوں گے

### Question Sentences

### Structure:

### Will + Subject + be + Verb + ing?

### Examples:

- Will you be eating food?

### کیا تم کھانا کھا رہے ہو گے؟

- Will she be reading a book?

### کیا وہ کتاب پڑھ رہی ہوگی؟

- Will he be playing cricket?

### کیا وہ کرکٹ کھیل رہا ہوگا؟

- Will they be watching TV?

### کیا وہ ٹی وی دیکھ رہے ہوں گے؟

- Will you be studying tomorrow?

### کیا تم کل پڑھ رہے ہو گے؟

### Important Rules

### Always use "will be"

### Use verb + ing

### Daily Conversation Examples

### Person A: What will you be doing tomorrow?

### تم کل کیا کر رہے ہو گے؟

Person B: I will be studying.

### میں پڑھ رہا ہوں گا

### Person A: Will you be working tomorrow?

### کیا تم کل کام کر رہے ہو گے؟

Person B: Yes, I will be working.

### ہاں، میں کام کر رہا ہوں گا

### Person A: Will she be coming to the party?

### کیا وہ پارٹی میں آ رہی ہوگی؟

Person B: Yes, she will be coming.

### ہاں، وہ آ رہی ہوگی

### Real-Life Usage

### At Home

- I will be cleaning my room.

### میں اپنا کمرہ صاف کر رہا ہوں گا

### At School

- I will be studying English.

### میں انگریزی پڑھ رہا ہوں گا

### In Market

- I will be buying vegetables.

### میں سبزیاں خرید رہا ہوں گا

### Practice Section

### Fill in the blanks:

- I ___ be eating food.

- She ___ be reading a book.

- They ___ be playing cricket.

### Make negative sentences:

- I will be watching TV → ______

- She will be cooking → ______

### Make questions:

- You will be studying → ______?

- He will be playing → ______?

### Translate into English:

- میں کل پڑھ رہا ہوں گا

- وہ کتاب پڑھ رہی ہوگی

- ہم کام کر رہے ہوں گے

### Chapter Summary

Future Continuous is used for actions happening in the future.

Use will be + verb + ing.

### Final Tip:

- I use this tense for future plans.

### میں اس زمانے کو مستقبل کے منصوبوں کے لیے استعمال کرتا ہوں`,
    },
    {
      slug: "chapter-15-future-perfect-tense",
      title: "Future Perfect Tense",
      summary: "Future Perfect Tense is used for actions that will be completed before a specific time in the future.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 14,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Future Perfect Tense

### What is Future Perfect Tense?

Future Perfect Tense is used for actions that will be completed before a specific time in the future.

### Simple idea:

This tense tells that something will be finished in the future.

### Example:

- I will have finished my work.

### میں اپنا کام مکمل کر چکا ہوں گا

### Structure (Formula)

### Subject + will have + Verb (3rd form)

### Use of Future Perfect

### Use this tense for:

### Actions completed before a future time

- She will have finished her work by evening.

### وہ شام تک اپنا کام مکمل کر چکی ہوگی

### Deadlines

- I will have completed my homework by 8 PM.

### میں رات 8 بجے تک اپنا ہوم ورک مکمل کر چکا ہوں گا

### Examples (Affirmative Sentences)

- I will have eaten food.

### میں کھانا کھا چکا ہوں گا

- She will have read the book.

### وہ کتاب پڑھ چکی ہوگی

- He will have played cricket.

### وہ کرکٹ کھیل چکا ہوگا

- They will have watched TV.

### وہ ٹی وی دیکھ چکے ہوں گے

- We will have learned English.

### ہم انگریزی سیکھ چکے ہوں گے

- I will have drunk water.

### میں پانی پی چکا ہوں گا

- She will have cooked food.

### وہ کھانا پکا چکی ہوگی

- He will have gone to school.

### وہ سکول جا چکا ہوگا

- They will have worked hard.

### وہ محنت کر چکے ہوں گے

- We will have helped others.

### ہم دوسروں کی مدد کر چکے ہوں گے

- I will have written a letter.

### میں خط لکھ چکا ہوں گا

- She will have sung a song.

### وہ گانا گا چکی ہوگی

### Negative Sentences

### Structure:

### Subject + will not have + Verb (3rd form)

### Examples:

- I will not have eaten food.

### میں کھانا نہیں کھا چکا ہوں گا

- She will not have read the book.

### وہ کتاب نہیں پڑھ چکی ہوگی

- He will not have played cricket.

### وہ کرکٹ نہیں کھیل چکا ہوگا

- They will not have watched TV.

### وہ ٹی وی نہیں دیکھ چکے ہوں گے

- We will not have finished work.

### ہم کام مکمل نہیں کر چکے ہوں گے

### Question Sentences

### Structure:

### Will + Subject + have + Verb (3rd form)?

### Examples:

- Will you have eaten food?

### کیا تم کھانا کھا چکے ہو گے؟

- Will she have read the book?

### کیا وہ کتاب پڑھ چکی ہوگی؟

- Will he have played cricket?

### کیا وہ کرکٹ کھیل چکا ہوگا؟

- Will they have watched TV?

### کیا وہ ٹی وی دیکھ چکے ہوں گے؟

- Will you have completed your work?

### کیا تم اپنا کام مکمل کر چکے ہو گے؟

### Important Rules

### Always use "will have"

### Use 3rd form of verb

### Use time expressions like:

### by tomorrow, by evening, by next week

### Daily Conversation Examples

### Person A: Will you have completed your work by tomorrow?

### کیا تم کل تک اپنا کام مکمل کر چکے ہو گے؟

Person B: Yes, I will have completed it.

### ہاں، میں مکمل کر چکا ہوں گا

### Person A: Will she have finished the project by evening?

### کیا وہ شام تک پراجیکٹ مکمل کر چکی ہوگی؟

Person B: Yes, she will have finished it.

### ہاں، وہ مکمل کر چکی ہوگی

### Person A: Will you have reached home by 8 PM?

### کیا تم رات 8 بجے تک گھر پہنچ چکے ہو گے؟

Person B: No, I will not have reached.

### نہیں، میں نہیں پہنچ چکا ہوں گا

### Real-Life Usage

### At Home

- I will have cleaned my room by evening.

### میں شام تک اپنا کمرہ صاف کر چکا ہوں گا

### At School

- I will have completed my homework by tomorrow.

### میں کل تک اپنا ہوم ورک مکمل کر چکا ہوں گا

### In Market

- I will have bought vegetables before going home.

### میں گھر جانے سے پہلے سبزیاں خرید چکا ہوں گا

### Practice Section

### Fill in the blanks:

- I ___ have eaten food.

- She ___ have read the book.

- They ___ have finished work.

### Make negative sentences:

- I will have eaten food → ______

- She will have completed work → ______

### Make questions:

- You will have finished work → ______?

- He will have gone home → ______?

### Translate into English:

- میں کام مکمل کر چکا ہوں گا

- وہ کتاب پڑھ چکی ہوگی

- ہم کام کر چکے ہوں گے

### Chapter Summary

Future Perfect is used for completed actions in the future.

Use will have + 3rd form of verb.

### Final Tip:

- I use this tense for deadlines.

### میں اس زمانے کو ڈیڈ لائن کے لیے استعمال کرتا ہوں`,
    },
    {
      slug: "chapter-16-future-perfect-continuous-tense",
      title: "Future Perfect Continuous Tense",
      summary: "Future Perfect Continuous Tense is used for actions that will continue for a period of time until a certain point in the future.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 15,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Future Perfect Continuous Tense

### What is Future Perfect Continuous Tense?

Future Perfect Continuous Tense is used for actions that will continue for a period of time until a certain point in the future.

### Simple idea:

This tense tells that something will be happening for some time in the future.

### Example:

- I will have been studying for two hours.

### میں دو گھنٹے سے پڑھ رہا ہوں گا

### Structure (Formula)

### Subject + will have been + Verb + ing

### Use of Future Perfect Continuous

### Use this tense for:

### Duration in the future

- She will have been working for two hours by evening.

### وہ شام تک دو گھنٹے سے کام کر رہی ہوگی

### Long actions continuing in future

- I will have been waiting for you for one hour.

### میں ایک گھنٹے سے تمہارا انتظار کر رہا ہوں گا

### Use of "Since" and "For"

### Since = specific time (since morning, since 5 PM)

### For = duration (for two hours, for many days)

### Examples:

- I will have been studying since morning.

### میں صبح سے پڑھ رہا ہوں گا

- She will have been working for two hours.

### وہ دو گھنٹے سے کام کر رہی ہوگی

### Examples (Affirmative Sentences)

- I will have been studying for two hours.

### میں دو گھنٹے سے پڑھ رہا ہوں گا

- She will have been reading since morning.

### وہ صبح سے پڑھ رہی ہوگی

- He will have been playing cricket for a long time.

### وہ کافی دیر سے کرکٹ کھیل رہا ہوگا

- They will have been watching TV for one hour.

### وہ ایک گھنٹے سے ٹی وی دیکھ رہے ہوں گے

- We will have been learning English for many days.

### ہم کئی دنوں سے انگریزی سیکھ رہے ہوں گے

- I will have been working since 9 AM.

### میں صبح 9 بجے سے کام کر رہا ہوں گا

- She will have been cooking for one hour.

### وہ ایک گھنٹے سے کھانا بنا رہی ہوگی

- He will have been sleeping for two hours.

### وہ دو گھنٹے سے سو رہا ہوگا

- They will have been talking for a long time.

### وہ کافی دیر سے بات کر رہے ہوں گے

- We will have been waiting since morning.

### ہم صبح سے انتظار کر رہے ہوں گے

- I will have been writing for one hour.

### میں ایک گھنٹے سے لکھ رہا ہوں گا

- She will have been singing for a long time.

### وہ کافی دیر سے گا رہی ہوگی

### Negative Sentences

### Structure:

### Subject + will not have been + Verb + ing

### Examples:

- I will not have been studying.

### میں پڑھ نہیں رہا ہوں گا

- She will not have been reading.

### وہ نہیں پڑھ رہی ہوگی

- He will not have been working.

### وہ کام نہیں کر رہا ہوگا

- They will not have been watching TV.

### وہ ٹی وی نہیں دیکھ رہے ہوں گے

- We will not have been waiting long.

### ہم زیادہ دیر سے انتظار نہیں کر رہے ہوں گے

### Question Sentences

### Structure:

### Will + Subject + have been + Verb + ing?

### Examples:

- Will you have been studying?

### کیا تم پڑھ رہے ہو گے؟

- Will she have been reading since morning?

### کیا وہ صبح سے پڑھ رہی ہوگی؟

- Will he have been playing cricket?

### کیا وہ کرکٹ کھیل رہا ہوگا؟

- Will they have been watching TV?

### کیا وہ ٹی وی دیکھ رہے ہوں گے؟

- Will you have been working since morning?

### کیا تم صبح سے کام کر رہے ہو گے؟

### Important Rules

### Always use "will have been"

### Use verb + ing

### Use "since" or "for" for time

### Daily Conversation Examples

### Person A: What will you have been doing by tomorrow?

### تم کل تک کیا کر رہے ہو گے؟

Person B: I will have been studying.

### میں پڑھ رہا ہوں گا

### Person A: Will you have been working for two hours by evening?

### کیا تم شام تک دو گھنٹے سے کام کر رہے ہو گے؟

Person B: Yes, I will have been working.

### ہاں، میں کام کر رہا ہوں گا

### Person A: Will she have been waiting long before you arrive?

### کیا وہ تمہارے پہنچنے سے پہلے کافی دیر سے انتظار کر رہی ہوگی؟

Person B: Yes, she will have been waiting.

### ہاں، وہ انتظار کر رہی ہوگی

### Real-Life Usage

### At Home

- I will have been cleaning my room for one hour.

### میں ایک گھنٹے سے اپنا کمرہ صاف کر رہا ہوں گا

### At School

- I will have been studying English for two hours.

### میں دو گھنٹے سے انگریزی پڑھ رہا ہوں گا

### In Market

- I will have been standing there for a long time.

### میں کافی دیر سے وہاں کھڑا ہوں گا

### Practice Section

### Fill in the blanks:

- I ___ have been studying.

- She ___ have been reading.

- They ___ have been working.

### Make negative sentences:

- I will have been studying → ______

- She will have been cooking → ______

### Make questions:

- You will have been working → ______?

- He will have been playing → ______?

### Translate into English:

- میں دو گھنٹے سے پڑھ رہا ہوں گا

- وہ صبح سے کام کر رہی ہوگی

- ہم کافی دیر سے انتظار کر رہے ہوں گے

### Chapter Summary

Future Perfect Continuous is used for duration in the future.

Use will have been + verb + ing.

### Final Tip:

- I use this tense for long future actions.

### میں اس زمانے کو مستقبل میں طویل کاموں کے لیے استعمال کرتا ہوں`,
    },
    {
      slug: "chapter-17-conversations-at-home",
      title: "Conversations at Home",
      summary: "In this chapter, you will learn how to speak English at home.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 16,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Conversations at Home

### Introduction

In this chapter, you will learn how to speak English at home.

These are simple and daily sentences used with family members.

### Simple idea:

Learn these conversations and practice daily at home.

### Conversation: Morning Routine

Person A: Good morning.

### صبح بخیر

Person B: Good morning.

### صبح بخیر

### Person A: Did you wake up early?

### کیا تم جلدی اٹھے؟

Person B: Yes, I woke up early.

### ہاں، میں جلدی اٹھا

### Person A: Did you brush your teeth?

### کیا تم نے دانت صاف کیے؟

Person B: Yes, I brushed my teeth.

### ہاں، میں نے دانت صاف کیے

### Conversation: Breakfast Time

### Person A: Are you hungry?

### کیا تم بھوکے ہو؟

Person B: Yes, I am very hungry.

### ہاں، میں بہت بھوکا ہوں

### Person A: What do you want to eat?

### تم کیا کھانا چاہتے ہو؟

Person B: I want tea and bread.

### مجھے چائے اور روٹی چاہیے

Person A: The food is ready.

### کھانا تیار ہے

Person B: I am coming.

### میں آ رہا ہوں

### Conversation: Asking for Help

### Person A: Can you help me?

### کیا تم میری مدد کر سکتے ہو؟

Person B: Yes, I can help you.

### ہاں، میں تمہاری مدد کر سکتا ہوں

Person A: Please bring water.

### براہ کرم پانی لے آؤ

Person B: Okay, I will bring it.

### ٹھیک ہے، میں لے آتا ہوں

### Conversation: Watching TV

### Person A: What are you watching?

### تم کیا دیکھ رہے ہو؟

Person B: I am watching TV.

### میں ٹی وی دیکھ رہا ہوں

Person A: Change the channel.

### چینل بدل دو

Person B: Okay, I will change it.

### ٹھیک ہے، میں بدل دیتا ہوں

### Conversation: Study Time

### Person A: Are you studying?

### کیا تم پڑھ رہے ہو؟

Person B: Yes, I am studying English.

### ہاں، میں انگریزی پڑھ رہا ہوں

Person A: Do your homework.

### اپنا ہوم ورک کرو

Person B: I will do it now.

### میں ابھی کرتا ہوں

### Conversation: Night Routine

### Person A: Are you tired?

### کیا تم تھکے ہوئے ہو؟

Person B: Yes, I am tired.

### ہاں، میں تھکا ہوا ہوں

Person A: Go to sleep.

### سو جاؤ

Person B: Good night.

### شب بخیر

### Common Daily Sentences at Home

- I am at home.

### میں گھر پر ہوں

- I am cleaning my room.

### میں اپنا کمرہ صاف کر رہا ہوں

- I am cooking food.

### میں کھانا بنا رہا ہوں

- I am watching TV.

### میں ٹی وی دیکھ رہا ہوں

- I am going to sleep.

### میں سونے جا رہا ہوں

- Please close the door.

### براہ کرم دروازہ بند کرو

- Open the window.

### کھڑکی کھولو

- Bring me water.

### مجھے پانی لاؤ

- Call him.

### اسے بلاؤ

- Wait for me.

### میرا انتظار کرو

### Practice Section

### Fill in the blanks:

- Good ___

- I am ___ food

- Please ___ the door

### Make your own conversation:

- Morning conversation

- Dinner conversation

### Translate into English:

- کیا تم بھوکے ہو؟

- مجھے پانی چاہیے

- میں سونے جا رہا ہوں

### Chapter Summary

You learned daily conversations used at home.

Practice these sentences every day with family.

### Final Tip:

- I speak English at home daily.

### میں گھر میں روز انگریزی بولتا ہوں`,
    },
    {
      slug: "chapter-18-conversations-in-market",
      title: "Conversations in Market",
      summary: "In this chapter, you will learn how to speak English in the market.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 17,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Conversations in Market

### Introduction

In this chapter, you will learn how to speak English in the market.

These sentences help you in buying, selling, and asking about things.

### Simple idea:

Use these sentences when you go to a shop or market.

### Conversation: Asking Price

### Person A: How much is this?

### یہ کتنے کا ہے؟

Person B: It is 200 rupees.

### یہ 200 روپے کا ہے

Person A: It is too expensive.

### یہ بہت مہنگا ہے

Person B: I will give you a discount.

### میں آپ کو رعایت دوں گا

### Conversation: Buying Something

Person A: I want to buy this shirt.

### میں یہ شرٹ خریدنا چاہتا ہوں

### Person B: What size do you want?

### آپ کو کون سا سائز چاہیے؟

Person A: I want medium size.

### مجھے درمیانہ سائز چاہیے

Person B: Here you go.

### یہ لیجیے

### Conversation: Asking for Item

### Person A: Do you have this item?

### کیا آپ کے پاس یہ چیز ہے؟

Person B: Yes, we have it.

### ہاں، ہمارے پاس ہے

Person A: Show me please.

### براہ کرم مجھے دکھائیں

Person B: Here it is.

### یہ رہا

### Conversation: Bargaining

### Person A: Can you reduce the price?

### کیا آپ قیمت کم کر سکتے ہیں؟

Person B: No, this is the final price.

### نہیں، یہ آخری قیمت ہے

Person A: Please give some discount.

### براہ کرم کچھ رعایت دیں

Person B: Okay, I will reduce 20 rupees.

### ٹھیک ہے، میں 20 روپے کم کر دیتا ہوں

### Conversation: Payment

### Person A: How can I pay?

### میں کیسے ادائیگی کر سکتا ہوں؟

Person B: You can pay in cash or online.

### آپ نقد یا آن لائن ادائیگی کر سکتے ہیں

Person A: I will pay in cash.

### میں نقد ادائیگی کروں گا

Person B: Thank you.

### شکریہ

### Conversation: Returning Item

Person A: I want to return this item.

### میں یہ چیز واپس کرنا چاہتا ہوں

### Person B: What is the problem?

### مسئلہ کیا ہے؟

Person A: It is damaged.

### یہ خراب ہے

Person B: Okay, we will replace it.

### ٹھیک ہے، ہم اسے بدل دیں گے

### Common Market Sentences

- I want this item.

### مجھے یہ چیز چاہیے

- Show me this.

### مجھے یہ دکھائیں

- Do you have another color?

### کیا آپ کے پاس کوئی اور رنگ ہے؟

- This is cheap.

### یہ سستا ہے

- This is expensive.

### یہ مہنگا ہے

- Give me a discount.

### مجھے رعایت دیں

- Pack this item.

### اس چیز کو پیک کریں

- I do not like this.

### مجھے یہ پسند نہیں ہے

- I will take this.

### میں یہ لے لوں گا

- Thank you.

### شکریہ

### Practice Section

### Fill in the blanks:

- How ___ is this?

- I want to ___ this item

- Give me a ___

### Make your own conversation:

- Buying clothes

- Buying vegetables

### Translate into English:

- یہ کتنے کا ہے؟

- مجھے یہ چیز چاہیے

- کیا آپ قیمت کم کر سکتے ہیں؟

### Chapter Summary

You learned how to speak in the market.

These sentences help in buying and selling.

### Final Tip:

- I speak English in the market.

### میں بازار میں انگریزی بولتا ہوں`,
    },
    {
      slug: "chapter-19-conversations-with-friends",
      title: "Conversations with Friends",
      summary: "In this chapter, you will learn how to speak English with your friends.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 18,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Conversations with Friends

### Introduction

In this chapter, you will learn how to speak English with your friends.

These are simple and natural conversations used in daily life.

### Simple idea:

Speak freely and comfortably with friends.

### Conversation: Meeting a Friend

### Person A: Hi, how are you?

### ہیلو، تم کیسے ہو؟

### Person B: I am fine. What about you?

### میں ٹھیک ہوں، تم کیسے ہو؟

Person A: I am also fine.

### میں بھی ٹھیک ہوں

### Conversation: Talking About Day

### Person A: What are you doing?

### تم کیا کر رہے ہو؟

Person B: I am studying.

### میں پڑھ رہا ہوں

### Person A: How was your day?

### تمہارا دن کیسا تھا؟

Person B: It was good.

### یہ اچھا تھا

### Conversation: Making Plans

### Person A: Do you want to go out?

### کیا تم باہر جانا چاہتے ہو؟

Person B: Yes, I want to go.

### ہاں، میں جانا چاہتا ہوں

### Person A: Where will we go?

### ہم کہاں جائیں گے؟

Person B: Let’s go to the park.

### چلو پارک چلتے ہیں

### Conversation: Talking About Studies

### Person A: Are you studying for the exam?

### کیا تم امتحان کی تیاری کر رہے ہو؟

Person B: Yes, I am studying.

### ہاں، میں پڑھ رہا ہوں

### Person A: Is it difficult?

### کیا یہ مشکل ہے؟

Person B: No, it is easy.

### نہیں، یہ آسان ہے

### Conversation: Asking for Help

### Person A: Can you help me with this?

### کیا تم اس میں میری مدد کر سکتے ہو؟

Person B: Yes, I can help you.

### ہاں، میں تمہاری مدد کر سکتا ہوں

Person A: Thank you.

### شکریہ

Person B: You are welcome.

### خوش آمدید

### Conversation: Talking About Likes

### Person A: What do you like?

### تمہیں کیا پسند ہے؟

Person B: I like cricket.

### مجھے کرکٹ پسند ہے

Person A: I like football.

### مجھے فٹبال پسند ہے

### Common Sentences with Friends

- Let’s go out.

### چلو باہر چلتے ہیں

- Call me later.

### مجھے بعد میں فون کرنا

- Wait for me.

### میرا انتظار کرو

- I am coming.

### میں آ رہا ہوں

- I will meet you tomorrow.

### میں تم سے کل ملوں گا

- Don’t worry.

### فکر نہ کرو

- That’s great.

### یہ بہت اچھا ہے

- I understand.

### میں سمجھ گیا

- Tell me the truth.

### مجھے سچ بتاؤ

- Be careful.

### احتیاط کرو

### Practice Section

### Fill in the blanks:

- How ___ you?

- I am ___

- Let’s ___ out

### Make your own conversation:

- Meeting a friend

- Planning a trip

### Translate into English:

- تم کیسے ہو؟

- مجھے کرکٹ پسند ہے

- ہم کہاں جائیں گے؟

### Chapter Summary

You learned how to talk with friends in English.

Use simple sentences and speak daily.

### Final Tip:

- I speak English with my friends.

### میں اپنے دوستوں کے ساتھ انگریزی بولتا ہوں`,
    },
    {
      slug: "chapter-20-conversations-at-school-college",
      title: "Conversations at School/College",
      summary: "In this chapter, you will learn how to speak English in school or college.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 19,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Conversations at School/College

### Introduction

In this chapter, you will learn how to speak English in school or college.

These sentences help you talk with teachers and classmates.

### Simple idea:

Use polite and clear English in academic places.

### Conversation: Talking to Teacher

Person A: Good morning, sir.

### صبح بخیر سر

Person B: Good morning.

### صبح بخیر

### Person A: May I come in?

### کیا میں اندر آ سکتا ہوں؟

Person B: Yes, come in.

### ہاں، اندر آؤ

### Conversation: Asking a Question

Person A: Sir, I have a question.

### سر، میرے پاس ایک سوال ہے

Person B: Yes, ask your question.

### ہاں، اپنا سوال پوچھو

### Person A: Can you explain this topic?

### کیا آپ یہ موضوع سمجھا سکتے ہیں؟

Person B: Yes, I will explain.

### ہاں، میں سمجھاؤں گا

### Conversation: Talking to Classmate

### Person A: Did you complete the homework?

### کیا تم نے ہوم ورک مکمل کیا؟

Person B: Yes, I completed it.

### ہاں، میں نے مکمل کیا

### Person A: Can you help me?

### کیا تم میری مدد کر سکتے ہو؟

Person B: Yes, I can help you.

### ہاں، میں مدد کر سکتا ہوں

### Conversation: Group Study

Person A: Let’s study together.

### چلو ساتھ پڑھتے ہیں

Person B: That’s a good idea.

### یہ اچھا خیال ہے

Person A: We will prepare for the exam.

### ہم امتحان کی تیاری کریں گے

Person B: Yes, let’s start now.

### ہاں، ابھی شروع کرتے ہیں

### Conversation: In Classroom

Person A: Please open your book.

### براہ کرم اپنی کتاب کھولو

### Person B: Which page?

### کون سا صفحہ؟

Person A: Page number 25.

### صفحہ نمبر 25

Person B: Okay.

### ٹھیک ہے

### Conversation: Asking Permission

### Person A: May I go out?

### کیا میں باہر جا سکتا ہوں؟

Person B: Yes, you may go.

### ہاں، تم جا سکتے ہو

Person A: Thank you.

### شکریہ

Person B: You are welcome.

### خوش آمدید

### Common Sentences at School/College

- I am a student.

### میں ایک طالب علم ہوں

- I am studying English.

### میں انگریزی پڑھ رہا ہوں

- I have completed my homework.

### میں نے اپنا ہوم ورک مکمل کر لیا ہے

- I do not understand this.

### میں یہ نہیں سمجھتا

- Please explain again.

### براہ کرم دوبارہ سمجھائیں

- Write this down.

### اسے لکھ لو

- Listen carefully.

### غور سے سنو

- I am preparing for exams.

### میں امتحان کی تیاری کر رہا ہوں

- I will submit my assignment.

### میں اپنی اسائنمنٹ جمع کرواؤں گا

- I am late.

### میں دیر سے آیا ہوں

### Practice Section

### Fill in the blanks:

- May I ___ in?

- I have a ___

- Please ___ your book

### Make your own conversation:

- Talking to teacher

- Asking a question

### Translate into English:

- کیا میں اندر آ سکتا ہوں؟

- میں ہوم ورک مکمل کر چکا ہوں

- براہ کرم دوبارہ سمجھائیں

### Chapter Summary

You learned how to speak in school and college.

Use polite and simple English with teachers and classmates.

### Final Tip:

- I speak English in my class.

### میں اپنی کلاس میں انگریزی بولتا ہوں`,
    },
    {
      slug: "chapter-21-daily-use-vocabulary",
      title: "Daily Use Vocabulary",
      summary: "Vocabulary means words.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 20,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Daily Use Vocabulary

### Introduction

Vocabulary means words.

If you know more words, you can speak better English.

### Simple idea:

Learn small groups of words daily and use them in sentences.

### Common Daily Words

- Water = پانی

I drink water.

### میں پانی پیتا ہوں

- Food = کھانا

I eat food.

### میں کھانا کھاتا ہوں

- Book = کتاب

I read a book.

### میں کتاب پڑھتا ہوں

- House = گھر

This is my house.

### یہ میرا گھر ہے

- Friend = دوست

He is my friend.

### وہ میرا دوست ہے

- Time = وقت

I have time.

### میرے پاس وقت ہے

- Work = کام

I do my work.

### میں اپنا کام کرتا ہوں

- Money = پیسہ

I need money.

### مجھے پیسہ چاہیے

- Day = دن

Today is a good day.

### آج اچھا دن ہے

- Night = رات

It is night now.

### اب رات ہے

### Action Words (Verbs as Vocabulary)

- Eat = کھانا

I eat rice.

### میں چاول کھاتا ہوں

- Drink = پینا

I drink tea.

### میں چائے پیتا ہوں

- Go = جانا

I go to school.

### میں سکول جاتا ہوں

- Come = آنا

I come home early.

### میں جلدی گھر آتا ہوں

- Read = پڑھنا

I read books.

### میں کتابیں پڑھتا ہوں

- Write = لکھنا

I write a letter.

### میں خط لکھتا ہوں

- Speak = بولنا

I speak English.

### میں انگریزی بولتا ہوں

- Listen = سننا

I listen to music.

### میں موسیقی سنتا ہوں

- Play = کھیلنا

I play cricket.

### میں کرکٹ کھیلتا ہوں

- Work = کام کرنا

I work daily.

### میں روز کام کرتا ہوں

### People and Relations

- Father = والد

My father is kind.

### میرے والد مہربان ہیں

- Mother = والدہ

My mother cooks food.

### میری والدہ کھانا پکاتی ہیں

- Brother = بھائی

My brother studies.

### میرا بھائی پڑھتا ہے

- Sister = بہن

My sister is happy.

### میری بہن خوش ہے

- Teacher = استاد

My teacher teaches well.

### میرے استاد اچھا پڑھاتے ہیں

- Student = طالب علم

I am a student.

### میں ایک طالب علم ہوں

### Places Vocabulary

- School = سکول

I go to school.

### میں سکول جاتا ہوں

- Market = بازار

I go to market.

### میں بازار جاتا ہوں

- Hospital = ہسپتال

He works in a hospital.

### وہ ہسپتال میں کام کرتا ہے

- Office = دفتر

She works in an office.

### وہ دفتر میں کام کرتی ہے

- Park = پارک

We go to the park.

### ہم پارک جاتے ہیں

### Time Words

- Today = آج

I am busy today.

### میں آج مصروف ہوں

- Tomorrow = کل

I will go tomorrow.

### میں کل جاؤں گا

- Yesterday = کل

I went yesterday.

### میں کل گیا تھا

- Morning = صبح

I wake up in the morning.

### میں صبح اٹھتا ہوں

- Evening = شام

I walk in the evening.

### میں شام کو چلتا ہوں

### Common Adjectives

- Good = اچھا

This is a good book.

### یہ ایک اچھی کتاب ہے

- Bad = برا

This is a bad idea.

### یہ ایک برا خیال ہے

- Big = بڑا

This is a big house.

### یہ ایک بڑا گھر ہے

- Small = چھوٹا

This is a small room.

### یہ ایک چھوٹا کمرہ ہے

- Happy = خوش

I am happy.

### میں خوش ہوں

- Sad = اداس

She is sad.

### وہ اداس ہے

### Daily Use Expressions

- Come here

### یہاں آؤ

- Go there

### وہاں جاؤ

- Sit down

### بیٹھ جاؤ

- Stand up

### کھڑے ہو جاؤ

- Wait here

### یہاں انتظار کرو

- Listen to me

### میری بات سنو

- Look at this

### اسے دیکھو

- Tell me

### مجھے بتاؤ

### Practice Section

### Fill in the blanks:

- I drink ___

- I read a ___

- I go to ___

### Make sentences:

- Use "book"

- Use "teacher"

- Use "market"

### Translate into English:

- میں پانی پیتا ہوں

- وہ سکول جاتا ہے

- یہ ایک بڑا گھر ہے

### Chapter Summary

Vocabulary helps you speak English better.

Learn and use words daily.

### Final Tip:

- I learn 10 new words daily.

### میں روز 10 نئے الفاظ سیکھتا ہوں`,
    },
    {
      slug: "chapter-22-emotions-vocabulary",
      title: "Emotions Vocabulary",
      summary: "Emotions are feelings.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 21,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Emotions Vocabulary

### Introduction

Emotions are feelings.

We use these words to express how we feel.

### Simple idea:

Learn emotion words and use them in daily conversation.

### Happy Emotions

- Happy = خوش

I am happy.

### میں خوش ہوں

- Excited = پرجوش

I am excited today.

### میں آج پرجوش ہوں

- Proud = فخر محسوس کرنا

I am proud of you.

### مجھے تم پر فخر ہے

- Relaxed = پرسکون

I feel relaxed.

### میں پرسکون محسوس کرتا ہوں

- Thankful = شکر گزار

I am thankful to you.

### میں آپ کا شکر گزار ہوں

### Sad Emotions

- Sad = اداس

I am sad.

### میں اداس ہوں

- Upset = پریشان

She is upset.

### وہ پریشان ہے

- Angry = غصہ

He is angry.

### وہ غصے میں ہے

- Tired = تھکا ہوا

I am tired.

### میں تھکا ہوا ہوں

- Worried = فکرمند

I am worried.

### میں فکرمند ہوں

### Strong Feelings

- Surprised = حیران

I am surprised.

### میں حیران ہوں

- Afraid = ڈرا ہوا

I am afraid.

### میں ڈرا ہوا ہوں

- Nervous = گھبرایا ہوا

I am nervous.

### میں گھبرایا ہوا ہوں

- Confused = الجھن میں

I am confused.

### میں الجھن میں ہوں

- Shocked = صدمہ پہنچا

I am shocked.

### مجھے صدمہ ہوا ہے

### Love and Care

- Love = محبت

I love my family.

### میں اپنے خاندان سے محبت کرتا ہوں

- Like = پسند

I like this.

### مجھے یہ پسند ہے

- Care = خیال رکھنا

I care about you.

### میں تمہارا خیال رکھتا ہوں

- Miss = یاد کرنا

I miss you.

### میں تمہیں یاد کرتا ہوں

- Respect = احترام

I respect my teacher.

### میں اپنے استاد کا احترام کرتا ہوں

### Daily Use Emotion Sentences

- I feel good.

### میں اچھا محسوس کر رہا ہوں

- I feel bad.

### میں برا محسوس کر رہا ہوں

- I am very happy today.

### میں آج بہت خوش ہوں

- I am not feeling well.

### میں ٹھیک محسوس نہیں کر رہا

- I am very tired.

### میں بہت تھکا ہوا ہوں

- I am worried about my exam.

### میں اپنے امتحان کے بارے میں فکرمند ہوں

- I am excited for tomorrow.

### میں کل کے لیے پرجوش ہوں

### Conversation Using Emotions

### Person A: How do you feel?

### تم کیسا محسوس کر رہے ہو؟

Person B: I feel happy.

### میں خوش محسوس کر رہا ہوں

### Person A: Why are you sad?

### تم اداس کیوں ہو؟

Person B: I am worried about my exam.

### میں اپنے امتحان کے بارے میں فکرمند ہوں

### Person A: Are you tired?

### کیا تم تھکے ہوئے ہو؟

Person B: Yes, I am very tired.

### ہاں، میں بہت تھکا ہوا ہوں

### Practice Section

### Fill in the blanks:

- I am ___ (happy/sad)

- She is ___ (angry/tired)

- I feel ___ (good/bad)

### Make sentences:

- Use "happy"

- Use "worried"

- Use "excited"

### Translate into English:

- میں خوش ہوں

- وہ پریشان ہے

- میں تھکا ہوا ہوں

### Chapter Summary

Emotion words help you express your feelings.

Use them in daily conversation.

### Final Tip:

- I express my feelings in English.

### میں اپنے جذبات انگریزی میں بیان کرتا ہوں`,
    },
    {
      slug: "chapter-23-food-and-daily-life-vocabulary",
      title: "Food and Daily Life Vocabulary",
      summary: "Food and daily life words are very important.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 22,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Food and Daily Life Vocabulary

### Introduction

Food and daily life words are very important.

We use these words every day at home and outside.

### Simple idea:

Learn these words and use them in daily sentences.

### Food Vocabulary

- Rice = چاول

I eat rice.

### میں چاول کھاتا ہوں

- Bread = روٹی

I eat bread.

### میں روٹی کھاتا ہوں

- Milk = دودھ

I drink milk.

### میں دودھ پیتا ہوں

- Tea = چائے

I drink tea.

### میں چائے پیتا ہوں

- Water = پانی

I drink water.

### میں پانی پیتا ہوں

- Sugar = چینی

I add sugar in tea.

### میں چائے میں چینی ڈالتا ہوں

- Salt = نمک

Add some salt.

### تھوڑا نمک ڈالیں

- Vegetable = سبزی

I eat vegetables.

### میں سبزیاں کھاتا ہوں

- Fruit = پھل

I like fruit.

### مجھے پھل پسند ہیں

- Meat = گوشت

I eat meat.

### میں گوشت کھاتا ہوں

### Kitchen Items

- Plate = پلیٹ

Put food on the plate.

### پلیٹ میں کھانا رکھو

- Spoon = چمچ

Use a spoon.

### چمچ استعمال کرو

- Glass = گلاس

Bring a glass of water.

### ایک گلاس پانی لاؤ

- Knife = چاقو

Use a knife carefully.

### چاقو احتیاط سے استعمال کرو

- Bottle = بوتل

This is a water bottle.

### یہ پانی کی بوتل ہے

### Daily Activities

- Wake up = اٹھنا

I wake up early.

### میں جلدی اٹھتا ہوں

- Sleep = سونا

I sleep at night.

### میں رات کو سوتا ہوں

- Eat = کھانا

I eat food.

### میں کھانا کھاتا ہوں

- Drink = پینا

I drink water.

### میں پانی پیتا ہوں

- Cook = پکانا

She cooks food.

### وہ کھانا پکاتی ہے

- Clean = صاف کرنا

I clean my room.

### میں اپنا کمرہ صاف کرتا ہوں

- Wash = دھونا

I wash my hands.

### میں اپنے ہاتھ دھوتا ہوں

- Study = پڑھنا

I study daily.

### میں روز پڑھتا ہوں

- Work = کام کرنا

I work hard.

### میں محنت کرتا ہوں

- Rest = آرام کرنا

I take rest.

### میں آرام کرتا ہوں

### Household Items

- Bed = بستر

I sleep on the bed.

### میں بستر پر سوتا ہوں

- Chair = کرسی

Sit on the chair.

### کرسی پر بیٹھو

- Table = میز

The book is on the table.

### کتاب میز پر ہے

- Door = دروازہ

Close the door.

### دروازہ بند کرو

- Window = کھڑکی

Open the window.

### کھڑکی کھولو

- Fan = پنکھا

Turn on the fan.

### پنکھا چالو کرو

- Light = روشنی

Turn off the light.

### لائٹ بند کرو

### Daily Use Sentences

- I am eating food.

### میں کھانا کھا رہا ہوں

- I am drinking tea.

### میں چائے پی رہا ہوں

- She is cooking in the kitchen.

### وہ کچن میں کھانا بنا رہی ہے

- I am cleaning my house.

### میں اپنا گھر صاف کر رہا ہوں

- He is sleeping on the bed.

### وہ بستر پر سو رہا ہے

- Please bring water.

### براہ کرم پانی لاؤ

- Open the door.

### دروازہ کھولو

- Sit here.

### یہاں بیٹھو

### Conversation: At Dining Table

### Person A: Are you hungry?

### کیا تم بھوکے ہو؟

Person B: Yes, I am hungry.

### ہاں، میں بھوکا ہوں

### Person A: What do you want to eat?

### تم کیا کھانا چاہتے ہو؟

Person B: I want rice and vegetables.

### مجھے چاول اور سبزی چاہیے

Person A: Here is your food.

### یہ رہا تمہارا کھانا

Person B: Thank you.

### شکریہ

### Practice Section

### Fill in the blanks:

- I drink ___

- I eat ___

- Open the ___

### Make sentences:

- Use "milk"

- Use "cook"

- Use "clean"

### Translate into English:

- میں پانی پیتا ہوں

- وہ کھانا پکاتی ہے

- دروازہ بند کرو

### Chapter Summary

Food and daily life vocabulary is used every day.

Practice these words daily.

### Final Tip:

- I use daily words in my routine.

### میں روزمرہ کے الفاظ اپنی زندگی میں استعمال کرتا ہوں`,
    },
    {
      slug: "chapter-24-travel-and-direction-vocabulary",
      title: "Travel and Direction Vocabulary",
      summary: "Travel and direction words help you move from one place to another.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 23,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Travel and Direction Vocabulary

### Introduction

Travel and direction words help you move from one place to another.

You use these words when you ask for directions or travel somewhere.

### Simple idea:

Learn these words so you can travel and ask for help easily.

### Basic Travel Words

- Travel = سفر

I like to travel.

### مجھے سفر کرنا پسند ہے

- Journey = سفر

My journey was long.

### میرا سفر طویل تھا

- Trip = سفر

I am going on a trip.

### میں سفر پر جا رہا ہوں

- Ticket = ٹکٹ

I bought a ticket.

### میں نے ٹکٹ خریدا

- Bus = بس

I go by bus.

### میں بس سے جاتا ہوں

- Car = گاڑی

I drive a car.

### میں گاڑی چلاتا ہوں

- Train = ٹرین

The train is fast.

### ٹرین تیز ہے

- Road = سڑک

This road is busy.

### یہ سڑک مصروف ہے

- Station = اسٹیشن

I am at the station.

### میں اسٹیشن پر ہوں

- Airport = ہوائی اڈہ

He is at the airport.

### وہ ہوائی اڈے پر ہے

### Direction Words

- Left = بائیں

Turn left.

### بائیں مڑو

- Right = دائیں

Turn right.

### دائیں مڑو

- Straight = سیدھا

Go straight.

### سیدھا جاؤ

- Near = قریب

The shop is near.

### دکان قریب ہے

- Far = دور

The school is far.

### سکول دور ہے

- Here = یہاں

Come here.

### یہاں آؤ

- There = وہاں

Go there.

### وہاں جاؤ

- Behind = پیچھے

The car is behind the house.

### گاڑی گھر کے پیچھے ہے

- In front of = سامنے

The shop is in front of the house.

### دکان گھر کے سامنے ہے

### Asking for Directions

- Where is the market?

### بازار کہاں ہے؟

- How can I go there?

### میں وہاں کیسے جا سکتا ہوں؟

- Is it far from here?

### کیا یہ یہاں سے دور ہے؟

- Is it near?

### کیا یہ قریب ہے؟

- Can you guide me?

### کیا آپ میری رہنمائی کر سکتے ہیں؟

### Giving Directions

- Go straight.

### سیدھا جاؤ

- Turn left.

### بائیں مڑو

- Turn right.

### دائیں مڑو

- It is near the school.

### یہ سکول کے قریب ہے

- It is in front of the hospital.

### یہ ہسپتال کے سامنے ہے

- It is behind the building.

### یہ عمارت کے پیچھے ہے

### Conversation: Asking Direction

### Person A: Excuse me, where is the market?

### معاف کیجیے، بازار کہاں ہے؟

Person B: Go straight and turn left.

### سیدھا جاؤ اور بائیں مڑو

### Person A: Is it far?

### کیا یہ دور ہے؟

Person B: No, it is near.

### نہیں، یہ قریب ہے

### Conversation: Traveling

### Person A: Where are you going?

### تم کہاں جا رہے ہو؟

Person B: I am going to the station.

### میں اسٹیشن جا رہا ہوں

### Person A: How will you go?

### تم کیسے جاؤ گے؟

Person B: I will go by bus.

### میں بس سے جاؤں گا

### Common Travel Sentences

- I am going home.

### میں گھر جا رہا ہوں

- I am on the way.

### میں راستے میں ہوں

- Wait for me.

### میرا انتظار کرو

- I will arrive soon.

### میں جلد پہنچوں گا

- I am late.

### میں دیر سے ہوں

- Let’s go together.

### چلو ساتھ چلتے ہیں

- I need a ticket.

### مجھے ٹکٹ چاہیے

- The bus is coming.

### بس آ رہی ہے

### Practice Section

### Fill in the blanks:

- Turn ___

- Go ___

- The shop is ___

### Make sentences:

- Use "left"

- Use "station"

- Use "bus"

### Translate into English:

- سیدھا جاؤ

- دائیں مڑو

- بازار کہاں ہے؟

### Chapter Summary

Travel and direction words help you move and ask for directions.

Practice these words when you travel.

### Final Tip:

- I ask directions in English.

### میں انگریزی میں راستہ پوچھتا ہوں`,
    },
      ],
    },
    {
      slug: "part-3",
      title: "Part 3 — Chapters 25–36",
      summary: "Chapters 25 to 36 of Master English Easily.",
      order: 3,
      difficulty: "beginner",
      estimatedMinutes: 360,
      tutorials: [
    {
      slug: "chapter-25-education-and-technology-vocabulary",
      title: "Education and Technology Vocabulary",
      summary: "Education and technology words are very important in modern life.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 24,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Education and Technology Vocabulary

### Introduction

Education and technology words are very important in modern life.

You use these words in school, college, and on the internet.

### Simple idea:

Learn these words to talk about studies and technology easily.

### Education Vocabulary

- School = سکول

I go to school.

### میں سکول جاتا ہوں

- College = کالج

She studies in college.

### وہ کالج میں پڑھتی ہے

- University = یونیورسٹی

He studies in university.

### وہ یونیورسٹی میں پڑھتا ہے

- Student = طالب علم

I am a student.

### میں ایک طالب علم ہوں

- Teacher = استاد

The teacher is teaching.

### استاد پڑھا رہا ہے

- Class = کلاس

I am in class.

### میں کلاس میں ہوں

- Subject = مضمون

English is my subject.

### انگریزی میرا مضمون ہے

- Homework = ہوم ورک

I complete my homework.

### میں اپنا ہوم ورک مکمل کرتا ہوں

- Exam = امتحان

I have an exam.

### میرا امتحان ہے

- Result = نتیجہ

My result is good.

### میرا نتیجہ اچھا ہے

### Study Actions

- Study = پڑھنا

I study daily.

### میں روز پڑھتا ہوں

- Learn = سیکھنا

I learn English.

### میں انگریزی سیکھتا ہوں

- Read = پڑھنا

I read books.

### میں کتابیں پڑھتا ہوں

- Write = لکھنا

I write notes.

### میں نوٹس لکھتا ہوں

- Understand = سمجھنا

I understand this.

### میں یہ سمجھتا ہوں

- Remember = یاد رکھنا

I remember everything.

### میں سب کچھ یاد رکھتا ہوں

- Practice = مشق کرنا

I practice daily.

### میں روز مشق کرتا ہوں

### Technology Vocabulary

- Computer = کمپیوٹر

I use a computer.

### میں کمپیوٹر استعمال کرتا ہوں

- Mobile = موبائل

I use a mobile phone.

### میں موبائل فون استعمال کرتا ہوں

- Internet = انٹرنیٹ

I use the internet.

### میں انٹرنیٹ استعمال کرتا ہوں

- Website = ویب سائٹ

This is a website.

### یہ ایک ویب سائٹ ہے

- Email = ای میل

I send an email.

### میں ای میل بھیجتا ہوں

- File = فائل

Send me the file.

### مجھے فائل بھیجیں

- Data = ڈیٹا

This is important data.

### یہ اہم ڈیٹا ہے

- Software = سافٹ ویئر

I install software.

### میں سافٹ ویئر انسٹال کرتا ہوں

- Password = پاس ورڈ

Enter your password.

### اپنا پاس ورڈ درج کریں

- Download = ڈاؤن لوڈ

I download files.

### میں فائلیں ڈاؤن لوڈ کرتا ہوں

### Common Sentences (Education + Technology)

- I am studying English.

### میں انگریزی پڑھ رہا ہوں

- I am preparing for exams.

### میں امتحان کی تیاری کر رہا ہوں

- I use a computer daily.

### میں روز کمپیوٹر استعمال کرتا ہوں

- I am learning online.

### میں آن لائن سیکھ رہا ہوں

- I send emails.

### میں ای میل بھیجتا ہوں

- I read from the internet.

### میں انٹرنیٹ سے پڑھتا ہوں

- Please send the file.

### براہ کرم فائل بھیجیں

- I forgot my password.

### میں اپنا پاس ورڈ بھول گیا

### Conversation: In Class

### Person A: Did you complete your homework?

### کیا تم نے ہوم ورک مکمل کیا؟

Person B: Yes, I completed it.

### ہاں، میں نے مکمل کیا

### Person A: Do you understand this topic?

### کیا تم یہ موضوع سمجھتے ہو؟

Person B: Yes, I understand it.

### ہاں، میں اسے سمجھتا ہوں

### Conversation: Using Technology

### Person A: Do you use a computer?

### کیا تم کمپیوٹر استعمال کرتے ہو؟

Person B: Yes, I use it daily.

### ہاں، میں اسے روز استعمال کرتا ہوں

### Person A: Can you send me the file?

### کیا تم مجھے فائل بھیج سکتے ہو؟

Person B: Yes, I will send it.

### ہاں، میں بھیج دوں گا

### Practice Section

### Fill in the blanks:

- I ___ English

- I use a ___

- Send me the ___

### Make sentences:

- Use "computer"

- Use "study"

- Use "email"

### Translate into English:

- میں انگریزی سیکھ رہا ہوں

- مجھے فائل بھیجیں

- میں کمپیوٹر استعمال کرتا ہوں

### Chapter Summary

Education and technology vocabulary is important in modern life.

Use these words in study and daily communication.

### Final Tip:

- I learn English using technology.

### میں ٹیکنالوجی کے ذریعے انگریزی سیکھتا ہوں`,
    },
    {
      slug: "chapter-26-introduction-to-verbs",
      title: "Introduction to Verbs",
      summary: "A verb is an action word.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 25,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Introduction to Verbs

### What is a Verb?

A verb is an action word.

It tells what someone does.

### Simple idea:

### Verb = Action

### Examples:

- I eat food.

### میں کھانا کھاتا ہوں

- She reads a book.

### وہ کتاب پڑھتی ہے

- He runs fast.

### وہ تیزی سے دوڑتا ہے

### Types of Verbs

There are different types of verbs, but we will learn simple ones.

### Action Verbs

These verbs show action.

### Examples:

- Eat = کھانا

I eat food.

### میں کھانا کھاتا ہوں

- Run = دوڑنا

I run daily.

### میں روز دوڑتا ہوں

- Write = لکھنا

I write a letter.

### میں خط لکھتا ہوں

- Read = پڑھنا

I read books.

### میں کتابیں پڑھتا ہوں

### Helping Verbs

Helping verbs help the main verb.

### Examples:

- is, am, are

- was, were

- has, have

### Examples in sentences:

- I am eating.

### میں کھانا کھا رہا ہوں

- She is reading.

### وہ پڑھ رہی ہے

- They are playing.

### وہ کھیل رہے ہیں

### Main Verb + Helping Verb

### Example:

- I am studying.

### میں پڑھ رہا ہوں

### Here:

### am = helping verb

### studying = main verb

### Verb Forms (Very Important)

### Every verb has three forms:

### Base form (V1)

### Past form (V2)

### Past participle (V3)

### Example:

- Eat – Ate – Eaten

### کھانا

### Examples:

- I eat food.

### میں کھانا کھاتا ہوں

- I ate food.

### میں نے کھانا کھایا

- I have eaten food.

### میں کھانا کھا چکا ہوں

### More Examples of Verb Forms

- Go – Went – Gone

### جانا

- Write – Wrote – Written

### لکھنا

- Read – Read – Read

### پڑھنا

- Play – Played – Played

### کھیلنا

### Use of Verbs in Sentences

- I go to school.

### میں سکول جاتا ہوں

- She eats food.

### وہ کھانا کھاتی ہے

- He plays cricket.

### وہ کرکٹ کھیلتا ہے

- They watch TV.

### وہ ٹی وی دیکھتے ہیں

### Common Mistakes

### Wrong: I eating food

### Correct: I am eating food

### میں کھانا کھا رہا ہوں

### Wrong: He go to school

### Correct: He goes to school

### وہ سکول جاتا ہے

### Daily Use Verb Sentences

- I wake up early.

### میں جلدی اٹھتا ہوں

- I go to work.

### میں کام پر جاتا ہوں

- I eat food.

### میں کھانا کھاتا ہوں

- I drink water.

### میں پانی پیتا ہوں

- I study daily.

### میں روز پڑھتا ہوں

- I sleep at night.

### میں رات کو سوتا ہوں

### Conversation Using Verbs

### Person A: What do you do daily?

### تم روز کیا کرتے ہو؟

Person B: I study and work.

### میں پڑھتا ہوں اور کام کرتا ہوں

### Person A: Do you play cricket?

### کیا تم کرکٹ کھیلتے ہو؟

Person B: Yes, I play daily.

### ہاں، میں روز کھیلتا ہوں

### Practice Section

### Fill in the blanks:

- I ___ food

- She ___ a book

- They ___ cricket

### Write verb forms:

- Go – ___ – ___

- Eat – ___ – ___

- Write – ___ – ___

### Make sentences:

- Use "eat"

- Use "go"

- Use "play"

### Translate into English:

- میں سکول جاتا ہوں

- وہ کتاب پڑھتی ہے

- ہم کرکٹ کھیلتے ہیں

### Chapter Summary

Verb is an action word.

It is very important in every sentence.

### Final Tip:

- I learn verbs daily.

### میں روز verbs سیکھتا ہوں`,
    },
    {
      slug: "chapter-27-most-common-verbs-1-100",
      title: "Most Common Verbs (1–100)",
      summary: "Verbs are the most important part of English.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 26,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Most Common Verbs (1–100)

### Introduction

Verbs are the most important part of English.

In this chapter, you will learn common verbs with their forms and usage.

### Simple idea:

Learn these verbs and use them in daily sentences.

### Verb List (1–20)

### Go – Went – Gone (جانا)

- I go to school.

### میں سکول جاتا ہوں

- I went yesterday.

### میں کل گیا تھا

- I have gone home.

### میں گھر جا چکا ہوں

### Eat – Ate – Eaten (کھانا)

- I eat food.

### میں کھانا کھاتا ہوں

- I ate food.

### میں نے کھانا کھایا

- I have eaten food.

### میں کھانا کھا چکا ہوں

### Drink – Drank – Drunk (پینا)

- I drink water.

### میں پانی پیتا ہوں

- I drank water.

### میں نے پانی پیا

- I have drunk water.

### میں پانی پی چکا ہوں

### Write – Wrote – Written (لکھنا)

- I write a letter.

### میں خط لکھتا ہوں

- I wrote a letter.

### میں نے خط لکھا

- I have written a letter.

### میں خط لکھ چکا ہوں

### Read – Read – Read (پڑھنا)

- I read books.

### میں کتابیں پڑھتا ہوں

- I read a book yesterday.

### میں نے کل کتاب پڑھی

- I have read this book.

### میں یہ کتاب پڑھ چکا ہوں

### Play – Played – Played (کھیلنا)

- I play cricket.

### میں کرکٹ کھیلتا ہوں

- I played yesterday.

### میں نے کل کھیلا

- I have played well.

### میں اچھا کھیل چکا ہوں

### Make – Made – Made (بنانا)

- I make food.

### میں کھانا بناتا ہوں

- I made food.

### میں نے کھانا بنایا

- I have made food.

### میں کھانا بنا چکا ہوں

### Take – Took – Taken (لینا)

- I take tea.

### میں چائے لیتا ہوں

- I took tea.

### میں نے چائے لی

- I have taken tea.

### میں چائے لے چکا ہوں

### Give – Gave – Given (دینا)

- I give help.

### میں مدد دیتا ہوں

- I gave help.

### میں نے مدد دی

- I have given help.

### میں مدد دے چکا ہوں

### Come – Came – Come (آنا)

- I come home.

### میں گھر آتا ہوں

- I came yesterday.

### میں کل آیا

- I have come here.

### میں یہاں آ چکا ہوں

### Verb List (21–40)

### See – Saw – Seen (دیکھنا)

- I see you.

### میں تمہیں دیکھتا ہوں

- I saw him.

### میں نے اسے دیکھا

- I have seen him.

### میں اسے دیکھ چکا ہوں

### Know – Knew – Known (جاننا)

- I know this.

### میں یہ جانتا ہوں

- I knew him.

### میں اسے جانتا تھا

- I have known him.

### میں اسے جان چکا ہوں

### Get – Got – Got (حاصل کرنا)

- I get money.

### میں پیسے حاصل کرتا ہوں

- I got money.

### میں نے پیسے حاصل کیے

- I have got money.

### میں پیسے حاصل کر چکا ہوں

### Find – Found – Found (پانا)

- I find a book.

### میں کتاب پاتا ہوں

- I found a book.

### میں نے کتاب پائی

- I have found it.

### میں اسے پا چکا ہوں

### Think – Thought – Thought (سوچنا)

- I think about it.

### میں اس کے بارے میں سوچتا ہوں

- I thought about it.

### میں نے اس کے بارے میں سوچا

- I have thought about it.

### میں اس کے بارے میں سوچ چکا ہوں

### Tell – Told – Told (بتانا)

- I tell the truth.

### میں سچ بتاتا ہوں

- I told him.

### میں نے اسے بتایا

- I have told him.

### میں اسے بتا چکا ہوں

### Ask – Asked – Asked (پوچھنا)

- I ask a question.

### میں سوال پوچھتا ہوں

- I asked him.

### میں نے اس سے پوچھا

- I have asked him.

### میں اس سے پوچھ چکا ہوں

### Work – Worked – Worked (کام کرنا)

- I work daily.

### میں روز کام کرتا ہوں

- I worked yesterday.

### میں نے کل کام کیا

- I have worked hard.

### میں محنت کر چکا ہوں

### Call – Called – Called (بلانا/فون کرنا)

- I call him.

### میں اسے بلاتا ہوں

- I called him.

### میں نے اسے بلایا

- I have called him.

### میں اسے بلا چکا ہوں

### Try – Tried – Tried (کوشش کرنا)

- I try again.

### میں دوبارہ کوشش کرتا ہوں

- I tried yesterday.

### میں نے کل کوشش کی

- I have tried.

### میں کوشش کر چکا ہوں

### Verb List (41–60)

### Use – Used – Used (استعمال کرنا)

- I use a computer.

### میں کمپیوٹر استعمال کرتا ہوں

### Open – Opened – Opened (کھولنا)

- I open the door.

### میں دروازہ کھولتا ہوں

### Close – Closed – Closed (بند کرنا)

- I close the door.

### میں دروازہ بند کرتا ہوں

### Start – Started – Started (شروع کرنا)

- I start work.

### میں کام شروع کرتا ہوں

### Finish – Finished – Finished (ختم کرنا)

- I finish my work.

### میں اپنا کام ختم کرتا ہوں

### Help – Helped – Helped (مدد کرنا)

- I help others.

### میں دوسروں کی مدد کرتا ہوں

### Move – Moved – Moved (حرکت کرنا)

- I move forward.

### میں آگے بڑھتا ہوں

### Live – Lived – Lived (رہنا)

- I live here.

### میں یہاں رہتا ہوں

### Believe – Believed – Believed (یقین کرنا)

- I believe you.

### میں تم پر یقین کرتا ہوں

### Bring – Brought – Brought (لانا)

- I bring water.

### میں پانی لاتا ہوں

### Daily Conversation Using Verbs

### Person A: What do you do daily?

### تم روز کیا کرتے ہو؟

Person B: I work and study.

### میں کام کرتا ہوں اور پڑھتا ہوں

### Person A: Did you call him?

### کیا تم نے اسے فون کیا؟

Person B: Yes, I called him.

### ہاں، میں نے اسے فون کیا

### Practice Section

### Fill in the blanks:

- I ___ (go) to school

- She ___ (eat) food

- They ___ (play) cricket

### Write verb forms:

- Go – ___ – ___

- Eat – ___ – ___

- Take – ___ – ___

### Make sentences:

- Use "make"

- Use "help"

- Use "call"

### Translate into English:

- میں سکول جاتا ہوں

- وہ کھانا کھاتی ہے

- ہم کام کرتے ہیں

### Chapter Summary

Common verbs help you speak English easily.

Practice these verbs daily.

### Final Tip:

- I use common verbs in daily speaking.

### میں روزمرہ گفتگو میں عام verbs استعمال کرتا ہوں`,
    },
    {
      slug: "chapter-28-important-verbs-101-200",
      title: "Important Verbs (101–200)",
      summary: "In this chapter, you will learn more important verbs.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 27,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Important Verbs (101–200)

### Introduction

In this chapter, you will learn more important verbs.

These verbs will help you speak better English in daily life.

### Simple idea:

Learn verbs and use them in sentences again and again.

### Verb List (101–120)

### Begin – Began – Begun (شروع کرنا)

- I begin my work.

### میں اپنا کام شروع کرتا ہوں

- I began yesterday.

### میں نے کل شروع کیا

- I have begun my work.

### میں اپنا کام شروع کر چکا ہوں

### Choose – Chose – Chosen (منتخب کرنا)

- I choose this book.

### میں یہ کتاب منتخب کرتا ہوں

- I chose it.

### میں نے اسے منتخب کیا

- I have chosen it.

### میں اسے منتخب کر چکا ہوں

### Speak – Spoke – Spoken (بولنا)

- I speak English.

### میں انگریزی بولتا ہوں

- I spoke yesterday.

### میں نے کل بات کی

- I have spoken.

### میں بات کر چکا ہوں

### Drive – Drove – Driven (چلانا)

- I drive a car.

### میں گاڑی چلاتا ہوں

- I drove yesterday.

### میں نے کل چلائی

- I have driven a car.

### میں گاڑی چلا چکا ہوں

### Break – Broke – Broken (توڑنا)

- I break it.

### میں اسے توڑتا ہوں

- I broke it.

### میں نے اسے توڑا

- I have broken it.

### میں اسے توڑ چکا ہوں

### Build – Built – Built (بنانا)

- I build a house.

### میں گھر بناتا ہوں

- I built a house.

### میں نے گھر بنایا

- I have built a house.

### میں گھر بنا چکا ہوں

### Catch – Caught – Caught (پکڑنا)

- I catch the ball.

### میں گیند پکڑتا ہوں

- I caught the ball.

### میں نے گیند پکڑی

- I have caught the ball.

### میں گیند پکڑ چکا ہوں

### Draw – Drew – Drawn (کھینچنا/بنانا)

- I draw a picture.

### میں تصویر بناتا ہوں

- I drew a picture.

### میں نے تصویر بنائی

- I have drawn a picture.

### میں تصویر بنا چکا ہوں

### Feel – Felt – Felt (محسوس کرنا)

- I feel happy.

### میں خوش محسوس کرتا ہوں

- I felt sad.

### میں اداس محسوس کر رہا تھا

- I have felt better.

### میں بہتر محسوس کر چکا ہوں

### Keep – Kept – Kept (رکھنا)

- I keep my book here.

### میں اپنی کتاب یہاں رکھتا ہوں

- I kept it here.

### میں نے اسے یہاں رکھا

- I have kept it safe.

### میں نے اسے محفوظ رکھا ہے

### Verb List (121–140)

### Learn – Learned – Learned (سیکھنا)

- I learn English.

### میں انگریزی سیکھتا ہوں

### Meet – Met – Met (ملنا)

- I meet my friend.

### میں اپنے دوست سے ملتا ہوں

### Pay – Paid – Paid (ادائیگی کرنا)

- I pay money.

### میں پیسے دیتا ہوں

### Put – Put – Put (رکھنا)

- I put the book on the table.

### میں کتاب میز پر رکھتا ہوں

### Run – Ran – Run (دوڑنا)

- I run daily.

### میں روز دوڑتا ہوں

### Say – Said – Said (کہنا)

- I say hello.

### میں ہیلو کہتا ہوں

### Send – Sent – Sent (بھیجنا)

- I send a message.

### میں پیغام بھیجتا ہوں

### Sit – Sat – Sat (بیٹھنا)

- I sit here.

### میں یہاں بیٹھتا ہوں

### Stand – Stood – Stood (کھڑا ہونا)

- I stand here.

### میں یہاں کھڑا ہوتا ہوں

### Teach – Taught – Taught (سکھانا)

- He teaches English.

### وہ انگریزی سکھاتا ہے

### Verb List (141–160)

### Understand – Understood – Understood (سمجھنا)

- I understand you.

### میں تمہیں سمجھتا ہوں

### Win – Won – Won (جیتنا)

- I win the game.

### میں کھیل جیتتا ہوں

### Lose – Lost – Lost (ہارنا)

- I lose the game.

### میں کھیل ہار جاتا ہوں

### Hold – Held – Held (پکڑنا)

- I hold this.

### میں اسے پکڑتا ہوں

### Hear – Heard – Heard (سننا)

- I hear you.

### میں تمہیں سنتا ہوں

### Wear – Wore – Worn (پہننا)

- I wear clothes.

### میں کپڑے پہنتا ہوں

### Cut – Cut – Cut (کاٹنا)

- I cut fruit.

### میں پھل کاٹتا ہوں

### Grow – Grew – Grown (اگنا/بڑھنا)

- Plants grow fast.

### پودے تیزی سے بڑھتے ہیں

### Buy – Bought – Bought (خریدنا)

- I buy food.

### میں کھانا خریدتا ہوں

### Sell – Sold – Sold (بیچنا)

- He sells fruits.

### وہ پھل بیچتا ہے

### Daily Conversation Using Verbs

### Person A: Do you understand this?

### کیا تم یہ سمجھتے ہو؟

Person B: Yes, I understand.

### ہاں، میں سمجھتا ہوں

### Person A: Did you buy this?

### کیا تم نے یہ خریدا؟

Person B: Yes, I bought it.

### ہاں، میں نے خریدا

### Practice Section

### Fill in the blanks:

- I ___ (buy) food

- She ___ (teach) English

- They ___ (run) fast

### Write verb forms:

- Begin – ___ – ___

- Speak – ___ – ___

- Buy – ___ – ___

### Make sentences:

- Use "learn"

- Use "understand"

- Use "send"

### Translate into English:

- میں انگریزی سیکھتا ہوں

- وہ مجھے سمجھتا ہے

- میں نے یہ خریدا

### Chapter Summary

Important verbs help you speak more naturally.

Practice them daily.

### Final Tip:

- I use new verbs in sentences.

### میں نئے verbs جملوں میں استعمال کرتا ہوں`,
    },
    {
      slug: "chapter-29-helping-verbs",
      title: "Helping Verbs",
      summary: "Helping verbs are small verbs that help the main verb.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 28,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Helping Verbs

### What are Helping Verbs?

Helping verbs are small verbs that help the main verb.

They make the sentence complete and correct.

### Simple idea:

Helping verbs support the main action.

### Example:

- I am eating food.

### میں کھانا کھا رہا ہوں

### Here:

### am = helping verb

### eating = main verb

### Common Helping Verbs

### Present:

### am, is, are

### Past:

### was, were

### Perfect:

### has, have, had

### Future:

### will

### Use of am, is, are

Use these in present tense.

- I am happy.

### میں خوش ہوں

- She is reading.

### وہ پڑھ رہی ہے

- They are playing.

### وہ کھیل رہے ہیں

### Use of was, were

Use these in past tense.

- I was tired.

### میں تھکا ہوا تھا

- She was cooking.

### وہ کھانا بنا رہی تھی

- They were playing.

### وہ کھیل رہے تھے

### Use of has, have, had

Use these in perfect tenses.

- I have eaten food.

### میں کھانا کھا چکا ہوں

- She has finished work.

### وہ کام مکمل کر چکی ہے

- I had completed my work.

### میں اپنا کام مکمل کر چکا تھا

### Use of will

Use this for future.

- I will go tomorrow.

### میں کل جاؤں گا

- She will come soon.

### وہ جلد آئے گی

### Helping Verbs with Main Verbs

- I am studying.

### میں پڑھ رہا ہوں

- She is cooking.

### وہ کھانا بنا رہی ہے

- They are watching TV.

### وہ ٹی وی دیکھ رہے ہیں

- I have finished work.

### میں کام مکمل کر چکا ہوں

- He had gone home.

### وہ گھر جا چکا تھا

### Negative Sentences with Helping Verbs

Add "not" after helping verb.

- I am not happy.

### میں خوش نہیں ہوں

- She is not reading.

### وہ نہیں پڑھ رہی ہے

- They are not playing.

### وہ نہیں کھیل رہے ہیں

- I have not finished work.

### میں نے کام مکمل نہیں کیا

- He will not go.

### وہ نہیں جائے گا

### Question Sentences with Helping Verbs

Put helping verb at the start.

- Are you happy?

### کیا تم خوش ہو؟

- Is she reading?

### کیا وہ پڑھ رہی ہے؟

- Are they playing?

### کیا وہ کھیل رہے ہیں؟

- Have you finished work?

### کیا تم نے کام مکمل کیا ہے؟

- Will you go tomorrow?

### کیا تم کل جاؤ گے؟

### Daily Conversation Examples

### Person A: Are you busy?

### کیا تم مصروف ہو؟

Person B: Yes, I am busy.

### ہاں، میں مصروف ہوں

### Person A: Have you completed your work?

### کیا تم نے اپنا کام مکمل کیا ہے؟

Person B: Yes, I have completed it.

### ہاں، میں مکمل کر چکا ہوں

### Person A: Will you come tomorrow?

### کیا تم کل آؤ گے؟

Person B: Yes, I will come.

### ہاں، میں آؤں گا

### Common Mistakes

### Wrong: I eating food

### Correct: I am eating food

### میں کھانا کھا رہا ہوں

### Wrong: She going school

### Correct: She is going to school

### وہ سکول جا رہی ہے

### Practice Section

### Fill in the blanks:

- I ___ happy

- She ___ reading

- They ___ playing

### Make negative sentences:

- I am happy → ______

- She is working → ______

### Make questions:

- You are ready → ______?

- He is playing → ______?

### Translate into English:

- میں خوش ہوں

- وہ پڑھ رہی ہے

- کیا تم تیار ہو؟

### Chapter Summary

Helping verbs support the main verb.

They are very important in sentence formation.

### Final Tip:

- I use helping verbs correctly.

### میں helping verbs کو صحیح استعمال کرتا ہوں`,
    },
    {
      slug: "chapter-30-modal-verbs",
      title: "Modal Verbs",
      summary: "Modal verbs show your feeling or intention.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 29,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Modal Verbs

### What are Modal Verbs?

### Modal verbs are helping verbs that show:

- Ability

- Permission

- Possibility

- Advice

- Obligation

### Simple idea:

Modal verbs show your feeling or intention.

### Common Modal Verbs

### can, could, may, might, must, should, will, would

### Use of "Can" (Ability / Permission)

Use "can" for ability and permission.

### Examples:

- I can speak English.

### میں انگریزی بول سکتا ہوں

- She can cook food.

### وہ کھانا پکا سکتی ہے

- Can you help me?

### کیا تم میری مدد کر سکتے ہو؟

- Can I come in?

### کیا میں اندر آ سکتا ہوں؟

### Use of "Could" (Past ability / Polite request)

### Examples:

- I could run fast when I was young.

### میں جوانی میں تیز دوڑ سکتا تھا

- Could you help me?

### کیا آپ میری مدد کر سکتے ہیں؟

- Could I ask a question?

### کیا میں ایک سوال پوچھ سکتا ہوں؟

### Use of "May" (Permission)

### Examples:

- May I come in?

### کیا میں اندر آ سکتا ہوں؟

- You may go now.

### تم اب جا سکتے ہو

### Use of "Might" (Possibility)

### Examples:

- It might rain today.

### آج بارش ہو سکتی ہے

- He might come late.

### وہ دیر سے آ سکتا ہے

### Use of "Must" (Strong obligation)

### Examples:

- You must study.

### تمہیں پڑھنا چاہیے

- I must complete my work.

### مجھے اپنا کام مکمل کرنا ہے

### Use of "Should" (Advice)

### Examples:

- You should work hard.

### تمہیں محنت کرنی چاہیے

- You should eat healthy food.

### تمہیں صحت مند کھانا کھانا چاہیے

### Use of "Will" (Future / Decision)

### Examples:

- I will help you.

### میں تمہاری مدد کروں گا

- She will come tomorrow.

### وہ کل آئے گی

### Use of "Would" (Polite / Wish)

### Examples:

- I would like tea.

### مجھے چائے چاہیے

- Would you help me?

### کیا آپ میری مدد کریں گے؟

### Important Rules

### Modal verbs are always followed by base verb

### Example:

- I can go

### میں جا سکتا ہوں

### Not: I can goes

### Daily Conversation Examples

### Person A: Can you help me?

### کیا تم میری مدد کر سکتے ہو؟

Person B: Yes, I can help you.

### ہاں، میں مدد کر سکتا ہوں

### Person A: Should I study now?

### کیا مجھے اب پڑھنا چاہیے؟

Person B: Yes, you should study.

### ہاں، تمہیں پڑھنا چاہیے

### Person A: May I come in?

### کیا میں اندر آ سکتا ہوں؟

Person B: Yes, you may come in.

### ہاں، تم آ سکتے ہو

### Real-Life Usage

### At Home

- You should rest.

### تمہیں آرام کرنا چاہیے

### At School

- You must complete your homework.

### تمہیں اپنا ہوم ورک مکمل کرنا چاہیے

### At Workplace

- I will finish this task.

### میں یہ کام مکمل کروں گا

### Practice Section

### Fill in the blanks:

- I ___ speak English

- You ___ study hard

- ___ I come in?

### Make sentences:

- Use "can"

- Use "should"

- Use "must"

### Translate into English:

- میں انگریزی بول سکتا ہوں

- تمہیں محنت کرنی چاہیے

- کیا میں اندر آ سکتا ہوں؟

### Chapter Summary

Modal verbs show ability, permission, advice, and possibility.

Use them with base verb.

### Final Tip:

- I use modal verbs in daily speaking.

### میں روزمرہ گفتگو میں modal verbs استعمال کرتا ہوں`,
    },
    {
      slug: "chapter-31-verb-usage-in-sentences",
      title: "Verb Usage in Sentences",
      summary: "In this chapter, you will learn how to use verbs correctly in sentences.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 30,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Verb Usage in Sentences

### Introduction

In this chapter, you will learn how to use verbs correctly in sentences.

You already know verbs, now you will learn how to use them in real speaking.

### Simple idea:

### Correct verb = correct sentence

### Using Verb with Subject

Verb changes with subject.

### Examples:

- I go to school.

### میں سکول جاتا ہوں

- He goes to school.

### وہ سکول جاتا ہے

- They go to school.

### وہ سکول جاتے ہیں

### Rule:

### For he/she/it → add s / es

### Using Verb in Different Tenses

### Present:

- I eat food.

### میں کھانا کھاتا ہوں

### Past:

- I ate food.

### میں نے کھانا کھایا

### Future:

- I will eat food.

### میں کھانا کھاؤں گا

### Using Verb with "ing"

Use verb + ing for continuous actions.

- I am eating.

### میں کھانا کھا رہا ہوں

- She is reading.

### وہ پڑھ رہی ہے

- They are playing.

### وہ کھیل رہے ہیں

### Using Verb with "to"

Use "to" before base verb.

- I want to eat.

### میں کھانا کھانا چاہتا ہوں

- I want to go.

### میں جانا چاہتا ہوں

- I want to learn English.

### میں انگریزی سیکھنا چاہتا ہوں

### Using Verb after Modal Verbs

After modal verbs, use base form.

- I can speak English.

### میں انگریزی بول سکتا ہوں

- You should study.

### تمہیں پڑھنا چاہیے

- I will go tomorrow.

### میں کل جاؤں گا

### Common Verb Patterns

### Pattern 1: Verb + Object

- I eat food.

### میں کھانا کھاتا ہوں

### Pattern 2: Verb + to + Verb

- I want to learn.

### میں سیکھنا چاہتا ہوں

### Pattern 3: Verb + ing

- I like reading.

### مجھے پڑھنا پسند ہے

### Common Mistakes

### Wrong: He go to school

### Correct: He goes to school

### وہ سکول جاتا ہے

### Wrong: I am go

### Correct: I am going

### میں جا رہا ہوں

### Wrong: I can goes

### Correct: I can go

### میں جا سکتا ہوں

### Real-Life Usage

### At Home

- I am eating food.

### میں کھانا کھا رہا ہوں

### At School

- I want to learn English.

### میں انگریزی سیکھنا چاہتا ہوں

### At Workplace

- I will complete my work.

### میں اپنا کام مکمل کروں گا

### Conversation Using Verbs

### Person A: What are you doing?

### تم کیا کر رہے ہو؟

Person B: I am studying.

### میں پڑھ رہا ہوں

### Person A: Do you want to go out?

### کیا تم باہر جانا چاہتے ہو؟

Person B: Yes, I want to go.

### ہاں، میں جانا چاہتا ہوں

### Practice Section

### Fill in the blanks:

- He ___ (go/goes) to school

- I am ___ (eat/eating)

- I can ___ (go/goes)

### Make sentences:

- Use "want to"

- Use "like + ing"

- Use "can"

### Translate into English:

- وہ سکول جاتا ہے

- میں کھانا کھا رہا ہوں

- میں جا سکتا ہوں

### Chapter Summary

Correct verb usage is very important.

Use verbs according to subject and tense.

### Final Tip:

- I practice verb patterns daily.

### میں روز verb patterns کی مشق کرتا ہوں`,
    },
    {
      slug: "chapter-32-articles-a-an-the",
      title: "Articles (a, an, the)",
      summary: "Articles are small words used before nouns.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 31,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Articles (a, an, the)

### What are Articles?

Articles are small words used before nouns.

They help us talk about things clearly.

### Simple idea:

Articles tell if something is general or specific.

### Types of Articles

### There are three articles:

### a

### an

### the

### Use of "a"

Use "a" before words that start with a consonant sound.

### Examples:

- I saw a cat.

### میں نے ایک بلی دیکھی

- He has a car.

### اس کے پاس ایک گاڑی ہے

- She is a teacher.

### وہ ایک استاد ہے

### Use of "an"

Use "an" before words that start with a vowel sound (a, e, i, o, u).

### Examples:

- I ate an apple.

### میں نے ایک سیب کھایا

- He is an honest man.

### وہ ایک ایماندار آدمی ہے

- She has an umbrella.

### اس کے پاس ایک چھتری ہے

### Use of "the"

Use "the" for specific things.

### Examples:

- The sun is bright.

### سورج روشن ہے

- The book is on the table.

### کتاب میز پر ہے

- The teacher is in the class.

### استاد کلاس میں ہے

### Difference Between "a/an" and "the"

### "a / an" = general

- I saw a dog.

### میں نے ایک کتا دیکھا

### "the" = specific

- The dog is black.

### وہ کتا کالا ہے

### More Examples

- I have a pen.

### میرے پاس ایک قلم ہے

- This is an orange.

### یہ ایک مالٹا ہے

- The pen is blue.

### قلم نیلا ہے

- The orange is sweet.

### مالٹا میٹھا ہے

### Important Rules

### Use "a" before consonant sound

### Use "an" before vowel sound

### Use "the" for known or specific things

### Daily Use Sentences

- I have a book.

### میرے پاس ایک کتاب ہے

- She eats an apple.

### وہ ایک سیب کھاتی ہے

- The book is new.

### کتاب نئی ہے

- The teacher is teaching.

### استاد پڑھا رہا ہے

- I saw a boy.

### میں نے ایک لڑکا دیکھا

- The boy is my friend.

### وہ لڑکا میرا دوست ہے

### Conversation Using Articles

### Person A: Do you have a pen?

### کیا تمہارے پاس ایک قلم ہے؟

Person B: Yes, I have a pen.

### ہاں، میرے پاس ایک قلم ہے

### Person A: Where is the pen?

### قلم کہاں ہے؟

Person B: The pen is on the table.

### قلم میز پر ہے

### Common Mistakes

### Wrong: I have pen

### Correct: I have a pen

### میرے پاس ایک قلم ہے

### Wrong: She is teacher

### Correct: She is a teacher

### وہ ایک استاد ہے

### Practice Section

### Fill in the blanks:

- I have ___ book

- She eats ___ apple

- ___ sun is bright

### Make sentences:

- Use "a"

- Use "an"

- Use "the"

### Translate into English:

- میرے پاس ایک کتاب ہے

- وہ ایک سیب کھاتی ہے

- کتاب میز پر ہے

### Chapter Summary

Articles are small but important words.

They help make sentences clear.

### Final Tip:

- I use articles correctly in sentences.

### میں جملوں میں articles صحیح استعمال کرتا ہوں`,
    },
    {
      slug: "chapter-33-pronouns",
      title: "Pronouns",
      summary: "Pronouns are words used instead of nouns.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 32,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Pronouns

### What are Pronouns?

Pronouns are words used instead of nouns.

They help us avoid repeating the same name again and again.

### Simple idea:

Pronoun replaces a name.

### Example:

- Ali is my friend. He is kind.

### علی میرا دوست ہے۔ وہ مہربان ہے

### Types of Pronouns

### Personal pronouns

### Possessive pronouns

### Demonstrative pronouns

### Interrogative pronouns

### Personal Pronouns

These pronouns are used for people.

### I = میں

### You = تم / آپ

### He = وہ (لڑکا)

### She = وہ (لڑکی)

### It = یہ / وہ (چیز)

### We = ہم

### They = وہ

### Examples:

- I am a student.

### میں ایک طالب علم ہوں

- He is my brother.

### وہ میرا بھائی ہے

- She is happy.

### وہ خوش ہے

- They are playing.

### وہ کھیل رہے ہیں

### Object Pronouns

These are used after verbs.

### Me = مجھے

### You = تمہیں

### Him = اسے

### Her = اسے

### It = اسے

### Us = ہمیں

### Them = انہیں

### Examples:

- He called me.

### اس نے مجھے بلایا

- I helped him.

### میں نے اس کی مدد کی

- She gave me a book.

### اس نے مجھے ایک کتاب دی

### Possessive Pronouns

These show ownership.

### My = میرا

### Your = تمہارا

### His = اس کا (لڑکا)

### Her = اس کا (لڑکی)

### Our = ہمارا

### Their = ان کا

### Examples:

- This is my book.

### یہ میری کتاب ہے

- That is his car.

### وہ اس کی گاڑی ہے

- This is our house.

### یہ ہمارا گھر ہے

### Demonstrative Pronouns

These point to things.

### This = یہ

### That = وہ

### These = یہ (جمع)

### Those = وہ (جمع)

### Examples:

- This is my pen.

### یہ میرا قلم ہے

- That is your bag.

### وہ تمہارا بیگ ہے

- These are books.

### یہ کتابیں ہیں

- Those are students.

### وہ طالب علم ہیں

### Interrogative Pronouns

These are used for questions.

### Who = کون

### What = کیا

### Which = کون سا

### Examples:

- Who are you?

### تم کون ہو؟

- What is this?

### یہ کیا ہے؟

- Which book is yours?

### کون سی کتاب تمہاری ہے؟

### Daily Use Sentences

- I am happy.

### میں خوش ہوں

- He is my friend.

### وہ میرا دوست ہے

- She is reading.

### وہ پڑھ رہی ہے

- They are working.

### وہ کام کر رہے ہیں

- This is my book.

### یہ میری کتاب ہے

- That is your pen.

### وہ تمہارا قلم ہے

### Conversation Using Pronouns

### Person A: Who is he?

### وہ کون ہے؟

Person B: He is my friend.

### وہ میرا دوست ہے

### Person A: What is this?

### یہ کیا ہے؟

Person B: This is my book.

### یہ میری کتاب ہے

### Person A: Is this your bag?

### کیا یہ تمہارا بیگ ہے؟

Person B: Yes, it is my bag.

### ہاں، یہ میرا بیگ ہے

### Common Mistakes

### Wrong: Ali is my friend. Ali is kind

### Correct: Ali is my friend. He is kind

### علی میرا دوست ہے۔ وہ مہربان ہے

### Practice Section

### Fill in the blanks:

- ___ is my friend

- She called ___

- This is ___ book

### Make sentences:

- Use "he"

- Use "they"

- Use "this"

### Translate into English:

- وہ میرا دوست ہے

- یہ میری کتاب ہے

- وہ کون ہے؟

### Chapter Summary

Pronouns replace nouns.

They make sentences short and easy.

### Final Tip:

- I use pronouns in speaking.

### میں بولتے وقت pronouns استعمال کرتا ہوں`,
    },
    {
      slug: "chapter-34-prepositions",
      title: "Prepositions",
      summary: "Prepositions are small words that show position, place, time, or direction.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 33,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Prepositions

### What are Prepositions?

Prepositions are small words that show position, place, time, or direction.

### Simple idea:

Preposition tells where, when, or how something happens.

### Example:

- The book is on the table.

### کتاب میز پر ہے

### Common Prepositions of Place

### in = کے اندر

### on = کے اوپر

### under = کے نیچے

### behind = کے پیچھے

### in front of = کے سامنے

### near = کے قریب

### far = دور

### Examples:

- The book is in the bag.

### کتاب بیگ کے اندر ہے

- The book is on the table.

### کتاب میز پر ہے

- The cat is under the chair.

### بلی کرسی کے نیچے ہے

- The car is behind the house.

### گاڑی گھر کے پیچھے ہے

- The shop is in front of the school.

### دکان سکول کے سامنے ہے

- The hospital is near my house.

### ہسپتال میرے گھر کے قریب ہے

- The school is far.

### سکول دور ہے

### Prepositions of Time

### in = مہینے، سال، لمبے وقت

### on = دن

### at = خاص وقت

### Examples:

- I was born in 2000.

### میں 2000 میں پیدا ہوا

- I go to school on Monday.

### میں پیر کو سکول جاتا ہوں

- I wake up at 7 AM.

### میں صبح 7 بجے اٹھتا ہوں

### Prepositions of Direction

### to = کی طرف

### from = سے

### into = کے اندر

### out of = سے باہر

### Examples:

- I go to school.

### میں سکول جاتا ہوں

- I come from home.

### میں گھر سے آتا ہوں

- He goes into the room.

### وہ کمرے میں جاتا ہے

- She comes out of the house.

### وہ گھر سے باہر آتی ہے

### Daily Use Sentences

- I am in the room.

### میں کمرے میں ہوں

- The book is on the table.

### کتاب میز پر ہے

- The cat is under the bed.

### بلی بستر کے نیچے ہے

- I go to school.

### میں سکول جاتا ہوں

- I come from office.

### میں دفتر سے آتا ہوں

- I wake up at 6 AM.

### میں صبح 6 بجے اٹھتا ہوں

### Conversation Using Prepositions

### Person A: Where is the book?

### کتاب کہاں ہے؟

Person B: It is on the table.

### یہ میز پر ہے

### Person A: Where are you?

### تم کہاں ہو؟

Person B: I am in the room.

### میں کمرے میں ہوں

### Person A: When do you wake up?

### تم کب اٹھتے ہو؟

Person B: I wake up at 7 AM.

### میں صبح 7 بجے اٹھتا ہوں

### Common Mistakes

### Wrong: The book is in the table

### Correct: The book is on the table

### کتاب میز پر ہے

### Wrong: I go in school

### Correct: I go to school

### میں سکول جاتا ہوں

### Practice Section

### Fill in the blanks:

- The book is ___ the table

- I wake up ___ 7 AM

- I go ___ school

### Make sentences:

- Use "in"

- Use "on"

- Use "under"

### Translate into English:

- کتاب میز پر ہے

- میں کمرے میں ہوں

- میں صبح 6 بجے اٹھتا ہوں

### Chapter Summary

Prepositions show place, time, and direction.

They are very important in daily English.

### Final Tip:

- I use prepositions correctly.

### میں prepositions کو صحیح استعمال کرتا ہوں`,
    },
    {
      slug: "chapter-35-adjectives-and-adverbs",
      title: "Adjectives and Adverbs",
      summary: "Adjectives describe a noun.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 34,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Adjectives and Adverbs

### What are Adjectives?

Adjectives describe a noun.

They tell us more about a person, place, or thing.

### Simple idea:

### Adjective = describes noun

### Examples:

- This is a big house.

### یہ ایک بڑا گھر ہے

- She is a happy girl.

### وہ ایک خوش لڑکی ہے

- It is a cold day.

### یہ ایک ٹھنڈا دن ہے

### Common Adjectives

- Big = بڑا

This is a big room.

### یہ ایک بڑا کمرہ ہے

- Small = چھوٹا

This is a small house.

### یہ ایک چھوٹا گھر ہے

- Good = اچھا

This is a good book.

### یہ ایک اچھی کتاب ہے

- Bad = برا

This is a bad idea.

### یہ ایک برا خیال ہے

- Happy = خوش

I am happy.

### میں خوش ہوں

- Sad = اداس

She is sad.

### وہ اداس ہے

- Fast = تیز

He is a fast runner.

### وہ تیز دوڑنے والا ہے

- Slow = آہستہ

This is a slow process.

### یہ ایک سست عمل ہے

### What are Adverbs?

Adverbs describe a verb.

They tell how, when, or where something happens.

### Simple idea:

### Adverb = describes action

### Examples:

- He runs fast.

### وہ تیزی سے دوڑتا ہے

- She speaks slowly.

### وہ آہستہ بولتی ہے

- I wake up early.

### میں جلدی اٹھتا ہوں

### Common Adverbs

- Quickly = تیزی سے

He runs quickly.

### وہ تیزی سے دوڑتا ہے

- Slowly = آہستہ

She walks slowly.

### وہ آہستہ چلتی ہے

- Early = جلدی

I wake up early.

### میں جلدی اٹھتا ہوں

- Late = دیر سے

He comes late.

### وہ دیر سے آتا ہے

- Very = بہت

I am very happy.

### میں بہت خوش ہوں

- Always = ہمیشہ

I always study.

### میں ہمیشہ پڑھتا ہوں

- Sometimes = کبھی کبھی

I sometimes watch TV.

### میں کبھی کبھار ٹی وی دیکھتا ہوں

- Never = کبھی نہیں

I never lie.

### میں کبھی جھوٹ نہیں بولتا

### Difference Between Adjective and Adverb

### Adjective describes noun

- She is a fast runner.

### وہ تیز دوڑنے والی ہے

### Adverb describes verb

- She runs fast.

### وہ تیزی سے دوڑتی ہے

### Daily Use Sentences

- I am very happy.

### میں بہت خوش ہوں

- She speaks clearly.

### وہ صاف بولتی ہے

- He runs fast.

### وہ تیزی سے دوڑتا ہے

- I wake up early.

### میں جلدی اٹھتا ہوں

- They work hard.

### وہ محنت کرتے ہیں

- This is a beautiful place.

### یہ ایک خوبصورت جگہ ہے

### Conversation Using Adjectives and Adverbs

### Person A: How is your day?

### تمہارا دن کیسا ہے؟

Person B: It is a good day.

### یہ اچھا دن ہے

### Person A: How do you speak English?

### تم انگریزی کیسے بولتے ہو؟

Person B: I speak clearly.

### میں صاف بولتا ہوں

### Person A: Are you happy?

### کیا تم خوش ہو؟

Person B: Yes, I am very happy.

### ہاں، میں بہت خوش ہوں

### Common Mistakes

### Wrong: He runs quick

### Correct: He runs quickly

### وہ تیزی سے دوڑتا ہے

### Wrong: She is very happily

### Correct: She is very happy

### وہ بہت خوش ہے

### Practice Section

### Fill in the blanks:

- He runs ___

- She is ___ happy

- I wake up ___

### Make sentences:

- Use "big"

- Use "quickly"

- Use "happy"

### Translate into English:

- وہ تیزی سے دوڑتا ہے

- میں بہت خوش ہوں

- یہ ایک بڑا گھر ہے

### Chapter Summary

Adjectives describe nouns.

Adverbs describe verbs.

### Final Tip:

- I use adjectives and adverbs in speaking.

### میں بولتے وقت adjectives اور adverbs استعمال کرتا ہوں`,
    },
    {
      slug: "chapter-36-fill-in-the-blanks-practice",
      title: "Fill in the Blanks (Practice)",
      summary: "This chapter helps you practice English.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 35,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Fill in the Blanks (Practice)

### Introduction

This chapter helps you practice English.

You will fill in the blanks using correct words.

### Simple idea:

Practice daily to improve your English.

### Exercise 1: Basic Sentences

### Fill in the blanks:

- I ___ a student.

- She ___ reading a book.

- They ___ playing cricket.

- He ___ my friend.

- We ___ learning English.

### Exercise 2: Present Indefinite

### Fill in the blanks:

- I ___ (eat) food.

- She ___ (read) a book.

- He ___ (play) cricket.

- They ___ (watch) TV.

- We ___ (learn) English.

### Exercise 3: Present Continuous

### Fill in the blanks:

- I ___ (eat) food.

- She ___ (read) a book.

- They ___ (play) cricket.

- He ___ (go) to school.

- We ___ (study) English.

### Exercise 4: Past Indefinite

### Fill in the blanks:

- I ___ (eat) food yesterday.

- She ___ (read) a book.

- He ___ (play) cricket.

- They ___ (watch) TV.

- We ___ (learn) English.

### Exercise 5: Future Tense

### Fill in the blanks:

- I ___ go tomorrow.

- She ___ read a book.

- He ___ play cricket.

- They ___ watch TV.

- We ___ learn English.

### Exercise 6: Articles (a, an, the)

### Fill in the blanks:

- I have ___ book.

- She eats ___ apple.

- ___ sun is bright.

- He is ___ teacher.

- This is ___ orange.

### Exercise 7: Prepositions

### Fill in the blanks:

- The book is ___ the table.

- I wake up ___ 7 AM.

- I go ___ school.

- The cat is ___ the chair.

- He is ___ the room.

### Exercise 8: Modal Verbs

### Fill in the blanks:

- I ___ speak English.

- You ___ study hard.

- ___ I come in?

- She ___ help you.

- We ___ complete this work.

### Exercise 9: Verb Forms

### Fill in the blanks:

- Go – ___ – ___

- Eat – ___ – ___

- Write – ___ – ___

- Take – ___ – ___

- See – ___ – ___

### Exercise 10: Mixed Practice

### Fill in the blanks:

- I ___ (be) happy.

- She ___ (have) a book.

- They ___ (be) playing.

- He ___ (go) to school daily.

- I ___ (can) help you.

### Practice Tip

- Read sentences loudly

- Try without looking answers

- Practice daily

### Chapter Summary

Practice makes your English strong.

Fill in the blanks to improve grammar and vocabulary.

### Final Tip:

- I practice English daily.

### میں روز انگریزی کی مشق کرتا ہوں`,
    },
      ],
    },
    {
      slug: "part-4",
      title: "Part 4 — Chapters 37–40",
      summary: "Chapters 37 to 40 of Master English Easily.",
      order: 4,
      difficulty: "beginner",
      estimatedMinutes: 120,
      tutorials: [
    {
      slug: "chapter-37-sentence-correction",
      title: "Sentence Correction",
      summary: "In this chapter, you will learn how to find and correct mistakes in sentences.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 36,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Sentence Correction

### Introduction

In this chapter, you will learn how to find and correct mistakes in sentences.

This will improve your grammar and speaking.

### Simple idea:

### Find mistake → correct it → learn from it

### Common Mistakes and Corrections

### Wrong: I eating food

### Correct: I am eating food

### میں کھانا کھا رہا ہوں

### Wrong: He go to school

### Correct: He goes to school

### وہ سکول جاتا ہے

### Wrong: She don’t like tea

### Correct: She does not like tea

### وہ چائے پسند نہیں کرتی

### Wrong: I am go to school

### Correct: I am going to school

### میں سکول جا رہا ہوں

### Wrong: They is playing

### Correct: They are playing

### وہ کھیل رہے ہیں

### Wrong: He have a car

### Correct: He has a car

### اس کے پاس ایک گاڑی ہے

### Wrong: I did not went

### Correct: I did not go

### میں نہیں گیا

### Wrong: She can sings

### Correct: She can sing

### وہ گا سکتی ہے

### Wrong: I am agree

### Correct: I agree

### میں متفق ہوں

### Wrong: He is more taller

### Correct: He is taller

### وہ زیادہ لمبا ہے

### Exercise 1: Correct the Sentences

- She go to school

- I am eat food

- He have a book

- They is playing

- I did not went

### Exercise 2: Find and Correct

- She can runs fast

- I am go home

- He do not like tea

- We is ready

- I has finished work

### Exercise 3: Choose the Correct Sentence

### a) He go to school

### b) He goes to school

### a) I am eating food

### b) I eating food

### a) She has a book

### b) She have a book

### a) They are playing

### b) They is playing

### a) I did not go

### b) I did not went

### Daily Use Correct Sentences

- I am studying.

### میں پڑھ رہا ہوں

- She goes to school.

### وہ سکول جاتی ہے

- He has a car.

### اس کے پاس ایک گاڑی ہے

- They are working.

### وہ کام کر رہے ہیں

- I can speak English.

### میں انگریزی بول سکتا ہوں

### Tips to Avoid Mistakes

### Use correct verb with subject

### Use helping verbs properly

### Do not use double verbs

### Use base verb after "did" and modal verbs

### Practice Tip

- Speak slowly

- Think before speaking

- Practice correct sentences

### Chapter Summary

Correcting mistakes improves your English.

Always check your sentence before speaking.

### Final Tip:

- I learn from my mistakes.

### میں اپنی غلطیوں سے سیکھتا ہوں`,
    },
    {
      slug: "chapter-38-translation-practice-urdu-english",
      title: "Translation Practice (Urdu → English)",
      summary: "In this chapter, you will practice translating Urdu sentences into English.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 37,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Translation Practice (Urdu → English)

### Introduction

In this chapter, you will practice translating Urdu sentences into English.

This will help you think in English and improve speaking.

### Simple idea:

### Read Urdu → Think → Speak in English

### Exercise 1: Basic Sentences

### Translate into English:

- میں ایک طالب علم ہوں

- وہ میرا دوست ہے

- میں خوش ہوں

- وہ گھر پر ہے

- ہم سکول جاتے ہیں

### Exercise 2: Daily Routine

### Translate into English:

- میں صبح جلدی اٹھتا ہوں

- میں ناشتہ کرتا ہوں

- میں سکول جاتا ہوں

- میں شام کو کھیلتا ہوں

- میں رات کو سوتا ہوں

### Exercise 3: Present Continuous

### Translate into English:

- میں کھانا کھا رہا ہوں

- وہ کتاب پڑھ رہی ہے

- ہم کرکٹ کھیل رہے ہیں

- وہ پانی پی رہا ہے

- میں انگریزی سیکھ رہا ہوں

### Exercise 4: Past Tense

### Translate into English:

- میں نے کھانا کھایا

- وہ سکول گئی

- ہم نے کام مکمل کیا

- اس نے کتاب پڑھی

- میں کل بازار گیا

### Exercise 5: Future Tense

### Translate into English:

- میں کل سکول جاؤں گا

- وہ کام کرے گی

- ہم انگریزی سیکھیں گے

- وہ جلد آئے گا

- میں تمہاری مدد کروں گا

### Exercise 6: Questions

### Translate into English:

- کیا تم خوش ہو؟

- تم کہاں جا رہے ہو؟

- کیا تم انگریزی بولتے ہو؟

- تم کیا کر رہے ہو؟

- کیا وہ سکول جاتا ہے؟

### Exercise 7: Negative Sentences

### Translate into English:

- میں نہیں جاتا

- وہ نہیں پڑھتی

- ہم نہیں کھیلتے

- میں چائے نہیں پیتا

- وہ گھر پر نہیں ہے

### Exercise 8: Daily Use Sentences

### Translate into English:

- مجھے پانی چاہیے

- دروازہ بند کرو

- یہاں آؤ

- میرا انتظار کرو

- مجھے یہ پسند ہے

### Exercise 9: Mixed Practice

### Translate into English:

- میں کل تم سے ملوں گا

- وہ ابھی کام کر رہا ہے

- ہم نے فلم دیکھی

- کیا تم تیار ہو؟

- میں تمہیں سمجھتا ہوں

### Practice Tip

- Translate slowly

- Speak aloud

- Practice daily

### Self-Check (Sample Answers)

- I am a student.

- He is my friend.

- I am happy.

- He is at home.

- We go to school.

### Chapter Summary

Translation helps you think in English.

Practice daily to improve speaking.

### Final Tip:

- I translate daily.

### میں روز ترجمہ کرتا ہوں`,
    },
    {
      slug: "chapter-39-conversation-practice",
      title: "Conversation Practice",
      summary: "In this chapter, you will practice full conversations.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 38,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Conversation Practice

### Introduction

In this chapter, you will practice full conversations.

This will help you speak English confidently in real life.

### Simple idea:

### Read → Speak → Practice daily

### Conversation: Introducing Yourself

### Person A: What is your name?

### تمہارا نام کیا ہے؟

Person B: My name is Ali.

### میرا نام علی ہے

### Person A: Where are you from?

### تم کہاں سے ہو؟

Person B: I am from Kashmir.

### میں کشمیر سے ہوں

### Person A: What do you do?

### تم کیا کرتے ہو؟

Person B: I am a student.

### میں ایک طالب علم ہوں

### Conversation: At Home

### Person A: What are you doing?

### تم کیا کر رہے ہو؟

Person B: I am eating food.

### میں کھانا کھا رہا ہوں

### Person A: Are you hungry?

### کیا تم بھوکے ہو؟

Person B: Yes, I am hungry.

### ہاں، میں بھوکا ہوں

### Conversation: With Friend

### Person A: Where are you going?

### تم کہاں جا رہے ہو؟

Person B: I am going to the market.

### میں بازار جا رہا ہوں

### Person A: Can I come with you?

### کیا میں تمہارے ساتھ آ سکتا ہوں؟

Person B: Yes, you can come.

### ہاں، تم آ سکتے ہو

### Conversation: At School

### Person A: Did you complete your homework?

### کیا تم نے ہوم ورک مکمل کیا؟

Person B: Yes, I completed it.

### ہاں، میں نے مکمل کیا

### Person A: Do you understand the lesson?

### کیا تم سبق سمجھتے ہو؟

Person B: Yes, I understand it.

### ہاں، میں سمجھتا ہوں

### Conversation: In Market

### Person A: How much is this?

### یہ کتنے کا ہے؟

Person B: It is 100 rupees.

### یہ 100 روپے کا ہے

Person A: It is expensive.

### یہ مہنگا ہے

Person B: I will reduce the price.

### میں قیمت کم کر دوں گا

### Conversation: At Workplace

### Person A: Have you completed your work?

### کیا تم نے اپنا کام مکمل کیا ہے؟

Person B: Yes, I have completed it.

### ہاں، میں مکمل کر چکا ہوں

### Person A: What will you do next?

### تم اب کیا کرو گے؟

Person B: I will start a new task.

### میں نیا کام شروع کروں گا

### Conversation: Asking for Help

### Person A: Can you help me?

### کیا تم میری مدد کر سکتے ہو؟

Person B: Yes, I can help you.

### ہاں، میں مدد کر سکتا ہوں

Person A: Thank you.

### شکریہ

Person B: You are welcome.

### خوش آمدید

### Conversation: Phone Call

### Person A: Hello, how are you?

### ہیلو، تم کیسے ہو؟

Person B: I am fine.

### میں ٹھیک ہوں

### Person A: Where are you?

### تم کہاں ہو؟

Person B: I am at home.

### میں گھر پر ہوں

### Daily Speaking Practice Sentences

- I am learning English.

### میں انگریزی سیکھ رہا ہوں

- I speak daily.

### میں روز بولتا ہوں

- I practice every day.

### میں روز مشق کرتا ہوں

- I am improving.

### میں بہتر ہو رہا ہوں

- I am confident.

### میں پراعتماد ہوں

### Practice Section

### Practice these conversations with a partner or alone

### Make your own conversation:

- At home

- At school

- With a friend

### Translate into English:

- تم کہاں جا رہے ہو؟

- میں گھر پر ہوں

- کیا تم میری مدد کر سکتے ہو؟

### Chapter Summary

Practice conversations improve speaking skills.

Speak daily to become confident.

### Final Tip:

- I speak English every day.

### میں روز انگریزی بولتا ہوں`,
    },
    {
      slug: "chapter-40-revision-and-final-practice",
      title: "Revision and Final Practice",
      summary: "In this chapter, you will revise everything you have learned.",
      difficulty: "beginner",
      estimatedMinutes: 10,
      order: 39,
      tags: "master-english-easily",
      learningObjectives: [],
      prerequisites: [],
      whereItFits: "",
      keyTakeaways: [],
      selfAssessment: [],
      content: `# Revision and Final Practice

### Introduction

In this chapter, you will revise everything you have learned.

This will help you become confident in English.

### Simple idea:

### Revise → Practice → Speak

### Revision: Tenses

### Present:

- I eat food.

### میں کھانا کھاتا ہوں

### Past:

- I ate food.

### میں نے کھانا کھایا

### Future:

- I will eat food.

### میں کھانا کھاؤں گا

### Continuous:

- I am eating food.

### میں کھانا کھا رہا ہوں

### Perfect:

- I have eaten food.

### میں کھانا کھا چکا ہوں

### Revision: Verbs

- I go to school.

### میں سکول جاتا ہوں

- She reads a book.

### وہ کتاب پڑھتی ہے

- They are playing.

### وہ کھیل رہے ہیں

- I have completed my work.

### میں اپنا کام مکمل کر چکا ہوں

### Revision: Vocabulary

- Water = پانی

- Book = کتاب

- Friend = دوست

- School = سکول

- Work = کام

### Examples:

- I drink water.

### میں پانی پیتا ہوں

- He is my friend.

### وہ میرا دوست ہے

### Revision: Grammar

### Articles:

- I have a book.

### میرے پاس ایک کتاب ہے

### Pronouns:

- He is my friend.

### وہ میرا دوست ہے

### Prepositions:

- The book is on the table.

### کتاب میز پر ہے

### Adjectives:

- This is a big house.

### یہ ایک بڑا گھر ہے

### Final Practice: Mixed Exercises

### Fill in the blanks:

- I ___ eating food

- She ___ a book

- They ___ playing

- I ___ go tomorrow

- He ___ my friend

### Correct the sentences:

- She go to school

- I eating food

- He have a car

- They is playing

- I did not went

### Translate into English:

- میں خوش ہوں

- وہ کتاب پڑھ رہی ہے

- ہم سکول جاتے ہیں

- میں کل جاؤں گا

- کیا تم تیار ہو؟

### Speaking Practice

### Speak daily:

- I am learning English

### میں انگریزی سیکھ رہا ہوں

- I speak every day

### میں روز بولتا ہوں

- I am improving

### میں بہتر ہو رہا ہوں

### Final Tips for Success

### Practice daily

### Speak without fear

### Use simple sentences

### Repeat again and again

### Chapter Summary

You have completed your English learning journey.

Now practice daily to improve more.

### Final Tip:

- I will continue learning English.

### میں انگریزی سیکھنا جاری رکھوں گا

## Conclusion

You have reached the end of this book, but this is not the end of your learning.

It is the beginning of your real journey with English.

### In this book, you have learned the most important parts of English:

basic grammar, tenses, vocabulary, verbs, and daily conversations.

These are the building blocks of real communication.

If you have studied carefully and practiced regularly, you now have a strong foundation.

You can understand simple English, speak basic sentences, and communicate in daily situations.

But learning a language does not stop here.

English improves with continuous practice.

### What You Should Do Next

### Keep practicing daily

### Speak English as much as possible

### Use English in real-life situations

### Read simple English content

### Listen and observe how people speak

### Remember

Do not aim for perfection.

Aim for progress.

Mistakes are normal.

Every mistake is a step forward.

Confidence comes with practice.

### Your Growth

When you started, English may have felt difficult.

Now, you can see that it is possible to learn step by step.

Your improvement depends on your consistency.

### Final Motivation

- I will continue learning

- I will practice every day

- I will speak with confidence

- I will improve continuously

### Final Words

This book has given you the path.

Now it is your responsibility to walk on it.

Stay consistent. Stay confident. Keep learning.

Your journey to mastering English has already begun.`,
    },
      ],
    },
  ],
}

const pathSteps: { part: string; title: string; subtitle: string; order: number; tutorialSlug: string }[] = [
  { part: "Part 1 — Chapters 1–12", title: "Introduction to English", subtitle: "Part of Part 1 — Chapters 1–12 · Beginner", order: 0, tutorialSlug: "chapter-1-introduction-to-english" },
  { part: "Part 1 — Chapters 1–12", title: "English Sentence Structure", subtitle: "Part of Part 1 — Chapters 1–12 · Beginner", order: 1, tutorialSlug: "chapter-2-english-sentence-structure" },
  { part: "Part 1 — Chapters 1–12", title: "Parts of Speech", subtitle: "Part of Part 1 — Chapters 1–12 · Beginner", order: 2, tutorialSlug: "chapter-3-parts-of-speech" },
  { part: "Part 1 — Chapters 1–12", title: "Basic Speaking Patterns", subtitle: "Part of Part 1 — Chapters 1–12 · Beginner", order: 3, tutorialSlug: "chapter-4-basic-speaking-patterns" },
  { part: "Part 1 — Chapters 1–12", title: "Present Indefinite Tense", subtitle: "Part of Part 1 — Chapters 1–12 · Beginner", order: 4, tutorialSlug: "chapter-5-present-indefinite-tense" },
  { part: "Part 1 — Chapters 1–12", title: "Present Continuous Tense", subtitle: "Part of Part 1 — Chapters 1–12 · Beginner", order: 5, tutorialSlug: "chapter-6-present-continuous-tense" },
  { part: "Part 1 — Chapters 1–12", title: "Present Perfect Tense", subtitle: "Part of Part 1 — Chapters 1–12 · Beginner", order: 6, tutorialSlug: "chapter-7-present-perfect-tense" },
  { part: "Part 1 — Chapters 1–12", title: "Present Perfect Continuous Tense", subtitle: "Part of Part 1 — Chapters 1–12 · Beginner", order: 7, tutorialSlug: "chapter-8-present-perfect-continuous-tense" },
  { part: "Part 1 — Chapters 1–12", title: "Past Indefinite Tense", subtitle: "Part of Part 1 — Chapters 1–12 · Beginner", order: 8, tutorialSlug: "chapter-9-past-indefinite-tense" },
  { part: "Part 1 — Chapters 1–12", title: "Past Continuous Tense", subtitle: "Part of Part 1 — Chapters 1–12 · Beginner", order: 9, tutorialSlug: "chapter-10-past-continuous-tense" },
  { part: "Part 1 — Chapters 1–12", title: "Past Perfect Tense", subtitle: "Part of Part 1 — Chapters 1–12 · Beginner", order: 10, tutorialSlug: "chapter-11-past-perfect-tense" },
  { part: "Part 1 — Chapters 1–12", title: "Past Perfect Continuous Tense", subtitle: "Part of Part 1 — Chapters 1–12 · Beginner", order: 11, tutorialSlug: "chapter-12-past-perfect-continuous-tense" },
  { part: "Part 2 — Chapters 13–24", title: "Future Indefinite Tense", subtitle: "Part of Part 2 — Chapters 13–24 · Beginner", order: 12, tutorialSlug: "chapter-13-future-indefinite-tense" },
  { part: "Part 2 — Chapters 13–24", title: "Future Continuous Tense", subtitle: "Part of Part 2 — Chapters 13–24 · Beginner", order: 13, tutorialSlug: "chapter-14-future-continuous-tense" },
  { part: "Part 2 — Chapters 13–24", title: "Future Perfect Tense", subtitle: "Part of Part 2 — Chapters 13–24 · Beginner", order: 14, tutorialSlug: "chapter-15-future-perfect-tense" },
  { part: "Part 2 — Chapters 13–24", title: "Future Perfect Continuous Tense", subtitle: "Part of Part 2 — Chapters 13–24 · Beginner", order: 15, tutorialSlug: "chapter-16-future-perfect-continuous-tense" },
  { part: "Part 2 — Chapters 13–24", title: "Conversations at Home", subtitle: "Part of Part 2 — Chapters 13–24 · Beginner", order: 16, tutorialSlug: "chapter-17-conversations-at-home" },
  { part: "Part 2 — Chapters 13–24", title: "Conversations in Market", subtitle: "Part of Part 2 — Chapters 13–24 · Beginner", order: 17, tutorialSlug: "chapter-18-conversations-in-market" },
  { part: "Part 2 — Chapters 13–24", title: "Conversations with Friends", subtitle: "Part of Part 2 — Chapters 13–24 · Beginner", order: 18, tutorialSlug: "chapter-19-conversations-with-friends" },
  { part: "Part 2 — Chapters 13–24", title: "Conversations at School/College", subtitle: "Part of Part 2 — Chapters 13–24 · Beginner", order: 19, tutorialSlug: "chapter-20-conversations-at-school-college" },
  { part: "Part 2 — Chapters 13–24", title: "Daily Use Vocabulary", subtitle: "Part of Part 2 — Chapters 13–24 · Beginner", order: 20, tutorialSlug: "chapter-21-daily-use-vocabulary" },
  { part: "Part 2 — Chapters 13–24", title: "Emotions Vocabulary", subtitle: "Part of Part 2 — Chapters 13–24 · Beginner", order: 21, tutorialSlug: "chapter-22-emotions-vocabulary" },
  { part: "Part 2 — Chapters 13–24", title: "Food and Daily Life Vocabulary", subtitle: "Part of Part 2 — Chapters 13–24 · Beginner", order: 22, tutorialSlug: "chapter-23-food-and-daily-life-vocabulary" },
  { part: "Part 2 — Chapters 13–24", title: "Travel and Direction Vocabulary", subtitle: "Part of Part 2 — Chapters 13–24 · Beginner", order: 23, tutorialSlug: "chapter-24-travel-and-direction-vocabulary" },
  { part: "Part 3 — Chapters 25–36", title: "Education and Technology Vocabulary", subtitle: "Part of Part 3 — Chapters 25–36 · Beginner", order: 24, tutorialSlug: "chapter-25-education-and-technology-vocabulary" },
  { part: "Part 3 — Chapters 25–36", title: "Introduction to Verbs", subtitle: "Part of Part 3 — Chapters 25–36 · Beginner", order: 25, tutorialSlug: "chapter-26-introduction-to-verbs" },
  { part: "Part 3 — Chapters 25–36", title: "Most Common Verbs (1–100)", subtitle: "Part of Part 3 — Chapters 25–36 · Beginner", order: 26, tutorialSlug: "chapter-27-most-common-verbs-1-100" },
  { part: "Part 3 — Chapters 25–36", title: "Important Verbs (101–200)", subtitle: "Part of Part 3 — Chapters 25–36 · Beginner", order: 27, tutorialSlug: "chapter-28-important-verbs-101-200" },
  { part: "Part 3 — Chapters 25–36", title: "Helping Verbs", subtitle: "Part of Part 3 — Chapters 25–36 · Beginner", order: 28, tutorialSlug: "chapter-29-helping-verbs" },
  { part: "Part 3 — Chapters 25–36", title: "Modal Verbs", subtitle: "Part of Part 3 — Chapters 25–36 · Beginner", order: 29, tutorialSlug: "chapter-30-modal-verbs" },
  { part: "Part 3 — Chapters 25–36", title: "Verb Usage in Sentences", subtitle: "Part of Part 3 — Chapters 25–36 · Beginner", order: 30, tutorialSlug: "chapter-31-verb-usage-in-sentences" },
  { part: "Part 3 — Chapters 25–36", title: "Articles (a, an, the)", subtitle: "Part of Part 3 — Chapters 25–36 · Beginner", order: 31, tutorialSlug: "chapter-32-articles-a-an-the" },
  { part: "Part 3 — Chapters 25–36", title: "Pronouns", subtitle: "Part of Part 3 — Chapters 25–36 · Beginner", order: 32, tutorialSlug: "chapter-33-pronouns" },
  { part: "Part 3 — Chapters 25–36", title: "Prepositions", subtitle: "Part of Part 3 — Chapters 25–36 · Beginner", order: 33, tutorialSlug: "chapter-34-prepositions" },
  { part: "Part 3 — Chapters 25–36", title: "Adjectives and Adverbs", subtitle: "Part of Part 3 — Chapters 25–36 · Beginner", order: 34, tutorialSlug: "chapter-35-adjectives-and-adverbs" },
  { part: "Part 3 — Chapters 25–36", title: "Fill in the Blanks (Practice)", subtitle: "Part of Part 3 — Chapters 25–36 · Beginner", order: 35, tutorialSlug: "chapter-36-fill-in-the-blanks-practice" },
  { part: "Part 4 — Chapters 37–40", title: "Sentence Correction", subtitle: "Part of Part 4 — Chapters 37–40 · Beginner", order: 36, tutorialSlug: "chapter-37-sentence-correction" },
  { part: "Part 4 — Chapters 37–40", title: "Translation Practice (Urdu → English)", subtitle: "Part of Part 4 — Chapters 37–40 · Beginner", order: 37, tutorialSlug: "chapter-38-translation-practice-urdu-english" },
  { part: "Part 4 — Chapters 37–40", title: "Conversation Practice", subtitle: "Part of Part 4 — Chapters 37–40 · Beginner", order: 38, tutorialSlug: "chapter-39-conversation-practice" },
  { part: "Part 4 — Chapters 37–40", title: "Revision and Final Practice", subtitle: "Part of Part 4 — Chapters 37–40 · Beginner", order: 39, tutorialSlug: "chapter-40-revision-and-final-practice" },
]

async function main() {
  const domain = await db.domain.findUnique({ where: { slug: "software-engineering" } })
  const srec = await db.subject.upsert({
    where: { slug: subject.slug },
    create: { slug: subject.slug, name: subject.name, tagline: subject.tagline, description: subject.description, icon: subject.icon, color: subject.color, category: subject.category, order: subject.order, published: true, domainId: domain?.id ?? null },
    update: { name: subject.name, tagline: subject.tagline, description: subject.description, icon: subject.icon, color: subject.color, category: subject.category, order: subject.order, domainId: domain?.id ?? null },
  })
  console.log(`  ✓ Subject: ${srec.name}`)

  for (const m of subject.modules) {
    const mrec = await db.module.upsert({
      where: { subjectId_slug: { subjectId: srec.id, slug: m.slug } },
      create: { subjectId: srec.id, slug: m.slug, title: m.title, summary: m.summary, order: m.order, difficulty: m.difficulty, estimatedMinutes: m.estimatedMinutes },
      update: { title: m.title, summary: m.summary, order: m.order, difficulty: m.difficulty, estimatedMinutes: m.estimatedMinutes },
    })
    for (const t of m.tutorials) {
      await db.tutorial.upsert({
        where: { subjectId_slug: { subjectId: srec.id, slug: t.slug } },
        create: { subjectId: srec.id, moduleId: mrec.id, slug: t.slug, title: t.title, summary: t.summary, content: t.content, difficulty: t.difficulty, estimatedMinutes: t.estimatedMinutes, tags: t.tags, order: t.order, published: true, learningObjectives: JSON.stringify(t.learningObjectives), prerequisites: JSON.stringify(t.prerequisites), whereItFits: t.whereItFits, keyTakeaways: JSON.stringify(t.keyTakeaways), selfAssessment: JSON.stringify(t.selfAssessment) },
        update: { title: t.title, summary: t.summary, content: t.content, difficulty: t.difficulty, estimatedMinutes: t.estimatedMinutes, tags: t.tags, order: t.order, moduleId: mrec.id, learningObjectives: JSON.stringify(t.learningObjectives), prerequisites: JSON.stringify(t.prerequisites), whereItFits: t.whereItFits, keyTakeaways: JSON.stringify(t.keyTakeaways), selfAssessment: JSON.stringify(t.selfAssessment) },
      })
      console.log(`      ✓ ${t.slug}`)
    }
  }

  const path = await db.learningPath.upsert({
    where: { slug: "master-english-easily-path" },
    create: { slug: "master-english-easily-path", title: "Master English Easily Roadmap", tagline: "The complete roadmap for Master English Easily - all parts in order.", description: "The complete roadmap for Master English Easily - all parts in order.", icon: "Briefcase", color: "oklch(0.75 0.16 85)", difficulty: 'beginner', estimatedHours: 7, published: true },
    update: { title: "Master English Easily Roadmap", tagline: "The complete roadmap for Master English Easily - all parts in order.", description: "The complete roadmap for Master English Easily - all parts in order.", icon: "Briefcase", color: "oklch(0.75 0.16 85)", difficulty: 'beginner', estimatedHours: 7 },
  })
  await db.learningPathPart.deleteMany({ where: { pathId: path.id } })
  await db.learningPathStep.deleteMany({ where: { pathId: path.id } })
  const partIds: Record<string, string> = {}
  for (const unit of subject.modules) {
    const pr = await db.learningPathPart.create({ data: { pathId: path.id, slug: unit.slug, title: unit.title, summary: unit.summary, order: unit.order } })
    partIds[unit.title] = pr.id
  }
  for (const st of pathSteps) {
    const tut = await db.tutorial.findUnique({ where: { subjectId_slug: { subjectId: srec.id, slug: st.tutorialSlug } } })
    await db.learningPathStep.create({ data: { pathId: path.id, partId: partIds[st.part], tutorialId: tut?.id ?? null, title: st.title, subtitle: st.subtitle, order: st.order } })
  }
  console.log(`  ✓ Learning path: ${path.title} (${pathSteps.length} steps)`)

  const counts = {
    subjects: await db.subject.count(),
    modules: await db.module.count(),
    tutorials: await db.tutorial.count(),
    paths: await db.learningPath.count(),
    pathSteps: await db.learningPathStep.count(),
  }
  console.log("🎉 Seed complete:", counts)
}

main()
  .catch((e) => {
    console.error("Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
