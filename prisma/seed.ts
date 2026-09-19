import { PrismaClient } from '@prisma/client';
import { Role, QuestionType, Difficulty } from '../src/types';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  await prisma.learningActivity.deleteMany();
  await prisma.materialAssignment.deleteMany();
  await prisma.learningMaterial.deleteMany();
  await prisma.testResult.deleteMany();
  await prisma.studentAnswer.deleteMany();
  await prisma.testSubmission.deleteMany();
  await prisma.testAssignment.deleteMany();
  await prisma.testQuestion.deleteMany();
  await prisma.test.deleteMany();
  await prisma.questionOption.deleteMany();
  await prisma.question.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.student.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.department.deleteMany();

  const passwordHash = await bcrypt.hash('SuperAdmin@123', 12);
  const adminPassHash = await bcrypt.hash('Admin@123', 12);
  const studentPassHash = await bcrypt.hash('Student@123', 12);

  // ============================================
  // DEPARTMENTS
  // ============================================
  const csDept = await prisma.department.create({
    data: { name: 'Computer Science', code: 'CS', description: 'Department of Computer Science & Engineering' },
  });
  const itDept = await prisma.department.create({
    data: { name: 'Information Technology', code: 'IT', description: 'Department of Information Technology' },
  });
  const eceDept = await prisma.department.create({
    data: { name: 'Electronics & Communication', code: 'ECE', description: 'Department of ECE' },
  });
  console.log('✅ Departments created');

  // ============================================
  // BATCHES
  // ============================================
  const batch2024 = await prisma.batch.create({ data: { name: 'Batch 2024', year: 2024 } });
  const batch2025 = await prisma.batch.create({ data: { name: 'Batch 2025', year: 2025 } });
  const batch2026 = await prisma.batch.create({ data: { name: 'Batch 2026', year: 2026 } });
  console.log('✅ Batches created');

  // ============================================
  // USERS
  // ============================================
  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@inter.edu',
      password: passwordHash,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
    },
  });

  const admin1 = await prisma.user.create({
    data: {
      email: 'admin@inter.edu',
      password: adminPassHash,
      firstName: 'John',
      lastName: 'Admin',
      role: 'ADMIN',
      admin: { create: { designation: 'Senior Lecturer' } },
    },
  });

  const admin2 = await prisma.user.create({
    data: {
      email: 'admin2@inter.edu',
      password: adminPassHash,
      firstName: 'Sarah',
      lastName: 'Manager',
      role: 'ADMIN',
      admin: { create: { designation: 'Department Head' } },
    },
  });

  const student1 = await prisma.user.create({
    data: {
      email: 'student1@inter.edu',
      password: studentPassHash,
      firstName: 'Alice',
      lastName: 'Johnson',
      role: 'STUDENT',
      student: {
        create: {
          enrollmentNo: 'CS2024001',
          departmentId: csDept.id,
          batchId: batch2024.id,
          semester: 3,
        },
      },
    },
    include: { student: true },
  });

  const student2 = await prisma.user.create({
    data: {
      email: 'student2@inter.edu',
      password: studentPassHash,
      firstName: 'Bob',
      lastName: 'Smith',
      role: 'STUDENT',
      student: {
        create: {
          enrollmentNo: 'CS2024002',
          departmentId: csDept.id,
          batchId: batch2024.id,
          semester: 3,
        },
      },
    },
    include: { student: true },
  });

  const student3 = await prisma.user.create({
    data: {
      email: 'student3@inter.edu',
      password: studentPassHash,
      firstName: 'Charlie',
      lastName: 'Brown',
      role: 'STUDENT',
      student: {
        create: {
          enrollmentNo: 'IT2025001',
          departmentId: itDept.id,
          batchId: batch2025.id,
          semester: 1,
        },
      },
    },
    include: { student: true },
  });

  const student4 = await prisma.user.create({
    data: {
      email: 'student4@inter.edu',
      password: studentPassHash,
      firstName: 'Diana',
      lastName: 'Lee',
      role: 'STUDENT',
      student: {
        create: {
          enrollmentNo: 'IT2025002',
          departmentId: itDept.id,
          batchId: batch2025.id,
          semester: 1,
        },
      },
    },
    include: { student: true },
  });

  const student5 = await prisma.user.create({
    data: {
      email: 'student5@inter.edu',
      password: studentPassHash,
      firstName: 'Eve',
      lastName: 'Williams',
      role: 'STUDENT',
      student: {
        create: {
          enrollmentNo: 'ECE2026001',
          departmentId: eceDept.id,
          batchId: batch2026.id,
          semester: 1,
        },
      },
    },
    include: { student: true },
  });
  console.log('✅ Users created');

  // ============================================
  // SUBJECTS, SKILLS, TOPICS
  // ============================================
  const jsSubject = await prisma.subject.create({
    data: { name: 'JavaScript', code: 'JS', description: 'JavaScript Programming Language' },
  });
  const pySubject = await prisma.subject.create({
    data: { name: 'Python', code: 'PY', description: 'Python Programming Language' },
  });
  const htmlSubject = await prisma.subject.create({
    data: { name: 'HTML & CSS', code: 'HTML', description: 'Web Development Fundamentals' },
  });
  const sqlSubject = await prisma.subject.create({
    data: { name: 'SQL', code: 'SQL', description: 'Structured Query Language' },
  });
  const dsaSubject = await prisma.subject.create({
    data: { name: 'Data Structures', code: 'DSA', description: 'Data Structures & Algorithms' },
  });

  // JS Skills & Topics
  const jsBasics = await prisma.skill.create({ data: { name: 'Fundamentals', subjectId: jsSubject.id } });
  const jsFunctions = await prisma.skill.create({ data: { name: 'Functions', subjectId: jsSubject.id } });
  const jsAsync = await prisma.skill.create({ data: { name: 'Async Programming', subjectId: jsSubject.id } });

  await prisma.topic.createMany({
    data: [
      { name: 'Variables & Types', skillId: jsBasics.id },
      { name: 'Operators', skillId: jsBasics.id },
      { name: 'Control Flow', skillId: jsBasics.id },
      { name: 'Arrow Functions', skillId: jsFunctions.id },
      { name: 'Closures', skillId: jsFunctions.id },
      { name: 'Higher-Order Functions', skillId: jsFunctions.id },
      { name: 'Promises', skillId: jsAsync.id },
      { name: 'Async/Await', skillId: jsAsync.id },
      { name: 'Event Loop', skillId: jsAsync.id },
    ],
  });

  // Python Skills & Topics
  const pyBasics = await prisma.skill.create({ data: { name: 'Basics', subjectId: pySubject.id } });
  const pyOOP = await prisma.skill.create({ data: { name: 'OOP', subjectId: pySubject.id } });

  await prisma.topic.createMany({
    data: [
      { name: 'Variables & Data Types', skillId: pyBasics.id },
      { name: 'Lists & Tuples', skillId: pyBasics.id },
      { name: 'Dictionaries', skillId: pyBasics.id },
      { name: 'Classes', skillId: pyOOP.id },
      { name: 'Inheritance', skillId: pyOOP.id },
    ],
  });

  // HTML Skills
  const htmlBasics = await prisma.skill.create({ data: { name: 'HTML Basics', subjectId: htmlSubject.id } });
  const cssBasics = await prisma.skill.create({ data: { name: 'CSS Basics', subjectId: htmlSubject.id } });

  await prisma.topic.createMany({
    data: [
      { name: 'Elements & Tags', skillId: htmlBasics.id },
      { name: 'Forms', skillId: htmlBasics.id },
      { name: 'Selectors', skillId: cssBasics.id },
      { name: 'Flexbox', skillId: cssBasics.id },
    ],
  });

  // SQL Skills
  const sqlBasics = await prisma.skill.create({ data: { name: 'Query Basics', subjectId: sqlSubject.id } });
  await prisma.topic.createMany({
    data: [
      { name: 'SELECT Statements', skillId: sqlBasics.id },
      { name: 'JOINs', skillId: sqlBasics.id },
      { name: 'Aggregations', skillId: sqlBasics.id },
    ],
  });

  // DSA Skills
  const dsaBasics = await prisma.skill.create({ data: { name: 'Basic Structures', subjectId: dsaSubject.id } });
  await prisma.topic.createMany({
    data: [
      { name: 'Arrays', skillId: dsaBasics.id },
      { name: 'Linked Lists', skillId: dsaBasics.id },
      { name: 'Stacks & Queues', skillId: dsaBasics.id },
    ],
  });

  console.log('✅ Subjects, Skills, Topics created');

  // ============================================
  // QUESTIONS
  // ============================================
  const jsTopics = await prisma.topic.findMany({ where: { skill: { subjectId: jsSubject.id } } });
  const pyTopics = await prisma.topic.findMany({ where: { skill: { subjectId: pySubject.id } } });
  const htmlTopics = await prisma.topic.findMany({ where: { skill: { subjectId: htmlSubject.id } } });
  const sqlTopics = await prisma.topic.findMany({ where: { skill: { subjectId: sqlSubject.id } } });
  const dsaTopics = await prisma.topic.findMany({ where: { skill: { subjectId: dsaSubject.id } } });

  // JavaScript MCQs
  const q1 = await prisma.question.create({
    data: {
      questionText: 'Which of the following is used to declare a variable in JavaScript that cannot be reassigned?',
      questionType: 'MCQ',
      difficulty: 'EASY',
      marks: 1,
      timeInSeconds: 60,
      explanation: 'The "const" keyword declares a variable that cannot be reassigned after initialization.',
      subjectId: jsSubject.id,
      skillId: jsBasics.id,
      topicId: jsTopics.find(t => t.name === 'Variables & Types')?.id,
      createdById: superAdmin.id,
      options: {
        create: [
          { optionText: 'var', isCorrect: false, sortOrder: 0 },
          { optionText: 'let', isCorrect: false, sortOrder: 1 },
          { optionText: 'const', isCorrect: true, sortOrder: 2 },
          { optionText: 'define', isCorrect: false, sortOrder: 3 },
        ],
      },
    },
  });

  const q2 = await prisma.question.create({
    data: {
      questionText: 'What is the output of: typeof null?',
      questionType: 'MCQ',
      difficulty: 'MEDIUM',
      marks: 2,
      timeInSeconds: 60,
      explanation: 'In JavaScript, typeof null returns "object", which is a known bug in the language.',
      subjectId: jsSubject.id,
      skillId: jsBasics.id,
      topicId: jsTopics.find(t => t.name === 'Variables & Types')?.id,
      createdById: superAdmin.id,
      options: {
        create: [
          { optionText: '"null"', isCorrect: false, sortOrder: 0 },
          { optionText: '"undefined"', isCorrect: false, sortOrder: 1 },
          { optionText: '"object"', isCorrect: true, sortOrder: 2 },
          { optionText: '"boolean"', isCorrect: false, sortOrder: 3 },
        ],
      },
    },
  });

  const q3 = await prisma.question.create({
    data: {
      questionText: 'Which array method creates a new array with the results of calling a function on every element?',
      questionType: 'MCQ',
      difficulty: 'EASY',
      marks: 1,
      timeInSeconds: 60,
      explanation: 'The map() method creates a new array by calling a function on every element.',
      subjectId: jsSubject.id,
      skillId: jsFunctions.id,
      topicId: jsTopics.find(t => t.name === 'Higher-Order Functions')?.id,
      createdById: superAdmin.id,
      options: {
        create: [
          { optionText: 'forEach()', isCorrect: false, sortOrder: 0 },
          { optionText: 'map()', isCorrect: true, sortOrder: 1 },
          { optionText: 'filter()', isCorrect: false, sortOrder: 2 },
          { optionText: 'reduce()', isCorrect: false, sortOrder: 3 },
        ],
      },
    },
  });

  const q4 = await prisma.question.create({
    data: {
      questionText: 'An arrow function in JavaScript inherits "this" from its enclosing scope.',
      questionType: 'TRUE_FALSE',
      difficulty: 'MEDIUM',
      marks: 1,
      timeInSeconds: 30,
      correctAnswer: 'True',
      explanation: 'Arrow functions do not have their own "this" binding; they inherit it from the enclosing scope.',
      subjectId: jsSubject.id,
      skillId: jsFunctions.id,
      topicId: jsTopics.find(t => t.name === 'Arrow Functions')?.id,
      createdById: superAdmin.id,
    },
  });

  const q5 = await prisma.question.create({
    data: {
      questionText: 'In JavaScript, the keyword used to handle asynchronous operations that returns a promise is _____.',
      questionType: 'FILL_BLANK',
      difficulty: 'EASY',
      marks: 1,
      timeInSeconds: 45,
      correctAnswer: 'async',
      explanation: 'The "async" keyword is used before a function declaration to make it return a Promise.',
      subjectId: jsSubject.id,
      skillId: jsAsync.id,
      topicId: jsTopics.find(t => t.name === 'Async/Await')?.id,
      createdById: superAdmin.id,
    },
  });

  const q6 = await prisma.question.create({
    data: {
      questionText: 'Explain the difference between var, let, and const in JavaScript. When would you use each?',
      questionType: 'SHORT_ANSWER',
      difficulty: 'MEDIUM',
      marks: 3,
      timeInSeconds: 180,
      correctAnswer: 'var is function-scoped and can be redeclared. let is block-scoped and can be reassigned but not redeclared. const is block-scoped and cannot be reassigned or redeclared. Use const by default, let when reassignment is needed, and avoid var in modern code.',
      subjectId: jsSubject.id,
      skillId: jsBasics.id,
      topicId: jsTopics.find(t => t.name === 'Variables & Types')?.id,
      createdById: superAdmin.id,
    },
  });

  const q7 = await prisma.question.create({
    data: {
      questionText: 'Write a JavaScript function called "debounce" that takes a function and a delay in milliseconds, and returns a debounced version that only executes after the delay has passed without further calls.',
      questionType: 'PROGRAMMING',
      difficulty: 'HARD',
      marks: 5,
      timeInSeconds: 600,
      correctAnswer: 'function debounce(fn, delay) {\n  let timeoutId;\n  return function(...args) {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => fn.apply(this, args), delay);\n  };\n}',
      subjectId: jsSubject.id,
      skillId: jsFunctions.id,
      topicId: jsTopics.find(t => t.name === 'Closures')?.id,
      createdById: superAdmin.id,
    },
  });

  // Python Questions
  const q8 = await prisma.question.create({
    data: {
      questionText: 'What is the output of: print(type([]))?',
      questionType: 'MCQ',
      difficulty: 'EASY',
      marks: 1,
      timeInSeconds: 60,
      explanation: 'An empty [] is a list in Python.',
      subjectId: pySubject.id,
      skillId: pyBasics.id,
      topicId: pyTopics.find(t => t.name === 'Lists & Tuples')?.id,
      createdById: superAdmin.id,
      options: {
        create: [
          { optionText: "<class 'tuple'>", isCorrect: false, sortOrder: 0 },
          { optionText: "<class 'list'>", isCorrect: true, sortOrder: 1 },
          { optionText: "<class 'dict'>", isCorrect: false, sortOrder: 2 },
          { optionText: "<class 'set'>", isCorrect: false, sortOrder: 3 },
        ],
      },
    },
  });

  const q9 = await prisma.question.create({
    data: {
      questionText: 'Python lists are mutable.',
      questionType: 'TRUE_FALSE',
      difficulty: 'EASY',
      marks: 1,
      timeInSeconds: 30,
      correctAnswer: 'True',
      explanation: 'Lists in Python are mutable, meaning their contents can be changed after creation.',
      subjectId: pySubject.id,
      skillId: pyBasics.id,
      topicId: pyTopics.find(t => t.name === 'Lists & Tuples')?.id,
      createdById: superAdmin.id,
    },
  });

  const q10 = await prisma.question.create({
    data: {
      questionText: 'In Python, a dictionary key must be _____ (mutable/immutable).',
      questionType: 'FILL_BLANK',
      difficulty: 'MEDIUM',
      marks: 1,
      timeInSeconds: 45,
      correctAnswer: 'immutable',
      explanation: 'Dictionary keys must be immutable types like strings, numbers, or tuples.',
      subjectId: pySubject.id,
      skillId: pyBasics.id,
      topicId: pyTopics.find(t => t.name === 'Dictionaries')?.id,
      createdById: superAdmin.id,
    },
  });

  // HTML/CSS Questions
  const q11 = await prisma.question.create({
    data: {
      questionText: 'Which HTML element is used to define a hyperlink?',
      questionType: 'MCQ',
      difficulty: 'EASY',
      marks: 1,
      timeInSeconds: 45,
      subjectId: htmlSubject.id,
      skillId: htmlBasics.id,
      topicId: htmlTopics.find(t => t.name === 'Elements & Tags')?.id,
      createdById: superAdmin.id,
      options: {
        create: [
          { optionText: '<link>', isCorrect: false, sortOrder: 0 },
          { optionText: '<a>', isCorrect: true, sortOrder: 1 },
          { optionText: '<href>', isCorrect: false, sortOrder: 2 },
          { optionText: '<url>', isCorrect: false, sortOrder: 3 },
        ],
      },
    },
  });

  const q12 = await prisma.question.create({
    data: {
      questionText: 'CSS Flexbox property "justify-content: center" aligns items along the main axis.',
      questionType: 'TRUE_FALSE',
      difficulty: 'EASY',
      marks: 1,
      timeInSeconds: 30,
      correctAnswer: 'True',
      subjectId: htmlSubject.id,
      skillId: cssBasics.id,
      topicId: htmlTopics.find(t => t.name === 'Flexbox')?.id,
      createdById: superAdmin.id,
    },
  });

  // SQL Questions
  const q13 = await prisma.question.create({
    data: {
      questionText: 'Which SQL clause is used to filter rows returned by a SELECT statement?',
      questionType: 'MCQ',
      difficulty: 'EASY',
      marks: 1,
      timeInSeconds: 60,
      subjectId: sqlSubject.id,
      skillId: sqlBasics.id,
      topicId: sqlTopics.find(t => t.name === 'SELECT Statements')?.id,
      createdById: superAdmin.id,
      options: {
        create: [
          { optionText: 'HAVING', isCorrect: false, sortOrder: 0 },
          { optionText: 'WHERE', isCorrect: true, sortOrder: 1 },
          { optionText: 'GROUP BY', isCorrect: false, sortOrder: 2 },
          { optionText: 'ORDER BY', isCorrect: false, sortOrder: 3 },
        ],
      },
    },
  });

  const q14 = await prisma.question.create({
    data: {
      questionText: 'Write a SQL query to find the top 5 students with the highest average scores from a "results" table with columns: student_id, test_id, score.',
      questionType: 'PROGRAMMING',
      difficulty: 'HARD',
      marks: 5,
      timeInSeconds: 300,
      correctAnswer: 'SELECT student_id, AVG(score) as avg_score FROM results GROUP BY student_id ORDER BY avg_score DESC LIMIT 5;',
      subjectId: sqlSubject.id,
      skillId: sqlBasics.id,
      topicId: sqlTopics.find(t => t.name === 'Aggregations')?.id,
      createdById: superAdmin.id,
    },
  });

  // DSA Questions
  const q15 = await prisma.question.create({
    data: {
      questionText: 'What is the time complexity of accessing an element by index in an array?',
      questionType: 'MCQ',
      difficulty: 'EASY',
      marks: 1,
      timeInSeconds: 45,
      subjectId: dsaSubject.id,
      skillId: dsaBasics.id,
      topicId: dsaTopics.find(t => t.name === 'Arrays')?.id,
      createdById: superAdmin.id,
      options: {
        create: [
          { optionText: 'O(1)', isCorrect: true, sortOrder: 0 },
          { optionText: 'O(n)', isCorrect: false, sortOrder: 1 },
          { optionText: 'O(log n)', isCorrect: false, sortOrder: 2 },
          { optionText: 'O(n²)', isCorrect: false, sortOrder: 3 },
        ],
      },
    },
  });

  console.log('✅ Questions created');

  // ============================================
  // TESTS
  // ============================================
  const jsTest = await prisma.test.create({
    data: {
      title: 'JavaScript Fundamentals Assessment',
      description: 'Test your knowledge of JavaScript basics, functions, and async programming.',
      instructions: 'Read each question carefully. MCQ and True/False questions are auto-graded. Time limit is 30 minutes. You have 2 attempts.',
      subjectId: jsSubject.id,
      duration: 30,
      maxAttempts: 2,
      passingScore: 50,
      showResult: true,
      totalMarks: 14,
      status: 'ASSIGNED',
      createdById: superAdmin.id,
      testQuestions: {
        create: [
          { questionId: q1.id, sortOrder: 0, marks: 1 },
          { questionId: q2.id, sortOrder: 1, marks: 2 },
          { questionId: q3.id, sortOrder: 2, marks: 1 },
          { questionId: q4.id, sortOrder: 3, marks: 1 },
          { questionId: q5.id, sortOrder: 4, marks: 1 },
          { questionId: q6.id, sortOrder: 5, marks: 3 },
          { questionId: q7.id, sortOrder: 6, marks: 5 },
        ],
      },
    },
  });

  const pyTest = await prisma.test.create({
    data: {
      title: 'Python Basics Quiz',
      description: 'A quick quiz on Python fundamentals.',
      instructions: 'Answer all questions. This quiz is auto-graded. 15 minutes time limit.',
      subjectId: pySubject.id,
      duration: 15,
      maxAttempts: 1,
      passingScore: 60,
      showResult: true,
      totalMarks: 3,
      status: 'ASSIGNED',
      createdById: superAdmin.id,
      testQuestions: {
        create: [
          { questionId: q8.id, sortOrder: 0, marks: 1 },
          { questionId: q9.id, sortOrder: 1, marks: 1 },
          { questionId: q10.id, sortOrder: 2, marks: 1 },
        ],
      },
    },
  });

  const webTest = await prisma.test.create({
    data: {
      title: 'Web Development Fundamentals',
      description: 'Test covering HTML, CSS, and basic web concepts.',
      instructions: 'Read carefully and select the best answer.',
      subjectId: htmlSubject.id,
      duration: 20,
      maxAttempts: 1,
      totalMarks: 2,
      status: 'PUBLISHED',
      createdById: admin1.id,
      testQuestions: {
        create: [
          { questionId: q11.id, sortOrder: 0, marks: 1 },
          { questionId: q12.id, sortOrder: 1, marks: 1 },
        ],
      },
    },
  });

  console.log('✅ Tests created');

  // ============================================
  // TEST ASSIGNMENTS
  // ============================================
  await prisma.testAssignment.createMany({
    data: [
      { testId: jsTest.id, studentId: student1.student!.id },
      { testId: jsTest.id, studentId: student2.student!.id },
      { testId: jsTest.id, studentId: student3.student!.id },
      { testId: pyTest.id, studentId: student1.student!.id },
      { testId: pyTest.id, studentId: student4.student!.id },
      { testId: pyTest.id, studentId: student5.student!.id },
    ],
  });

  console.log('✅ Test assignments created');

  // ============================================
  // LEARNING MATERIALS
  // ============================================
  const mat1 = await prisma.learningMaterial.create({
    data: {
      title: 'JavaScript ES6+ Complete Guide',
      description: 'Comprehensive guide covering modern JavaScript features',
      type: 'DOCUMENT',
      content: '# JavaScript ES6+ Guide\n\n## Let & Const\nModern JavaScript uses `let` and `const` instead of `var`...\n\n## Arrow Functions\nArrow functions provide a concise syntax...\n\n## Template Literals\nTemplate literals use backticks...\n\n## Destructuring\nDestructuring allows extracting values...\n\n## Spread & Rest\nThe spread operator (`...`) expands iterables...',
      subjectId: jsSubject.id,
      skillId: jsBasics.id,
      isAIGenerated: true,
      createdById: superAdmin.id,
    },
  });

  const mat2 = await prisma.learningMaterial.create({
    data: {
      title: 'Python OOP Presentation',
      description: 'Introduction to Object-Oriented Programming in Python',
      type: 'PPT',
      content: '# Python OOP\n\n## Slide 1: What is OOP?\n- Object-oriented paradigm\n- Classes and objects\n\n## Slide 2: Classes\n- Class definition\n- __init__ method\n\n## Slide 3: Inheritance\n- Parent and child classes\n- Method overriding',
      subjectId: pySubject.id,
      skillId: pyOOP.id,
      isAIGenerated: true,
      metadata: JSON.stringify({ slides: 5, estimatedDuration: '20 min' }),
      createdById: superAdmin.id,
    },
  });

  const mat3 = await prisma.learningMaterial.create({
    data: {
      title: 'CSS Flexbox Visual Guide',
      description: 'Visual guide to CSS Flexbox layout',
      type: 'IMAGE',
      content: '# Flexbox Layout Guide\n\nA visual diagram showing flex-direction, justify-content, align-items, and flex-wrap properties with examples.',
      subjectId: htmlSubject.id,
      skillId: cssBasics.id,
      createdById: superAdmin.id,
    },
  });

  const mat4 = await prisma.learningMaterial.create({
    data: {
      title: 'SQL Joins Explained - Video Tutorial',
      description: 'Video script covering INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL JOIN',
      type: 'VIDEO',
      content: '# SQL Joins Video\n\n## Scene 1: Introduction\nWelcome to SQL Joins...\n\n## Scene 2: INNER JOIN\nAn INNER JOIN returns rows that have matching values in both tables...\n\n## Scene 3: LEFT JOIN\nA LEFT JOIN returns all rows from the left table...',
      subjectId: sqlSubject.id,
      skillId: sqlBasics.id,
      metadata: JSON.stringify({ duration: '12 min', scenes: 5 }),
      createdById: superAdmin.id,
    },
  });

  console.log('✅ Learning materials created');

  // ============================================
  // MATERIAL ASSIGNMENTS
  // ============================================
  await prisma.materialAssignment.createMany({
    data: [
      { materialId: mat1.id, studentId: student1.student!.id },
      { materialId: mat1.id, studentId: student2.student!.id },
      { materialId: mat2.id, studentId: student1.student!.id },
      { materialId: mat2.id, studentId: student3.student!.id },
      { materialId: mat3.id, studentId: student2.student!.id },
      { materialId: mat4.id, studentId: student4.student!.id },
    ],
  });

  console.log('✅ Material assignments created');

  // ============================================
  // NOTIFICATIONS
  // ============================================
  await prisma.notification.createMany({
    data: [
      { userId: student1.id, title: 'Test Assigned', message: 'JavaScript Fundamentals Assessment has been assigned to you.', type: 'INFO' },
      { userId: student1.id, title: 'New Material', message: 'JavaScript ES6+ Complete Guide is now available.', type: 'INFO' },
      { userId: student2.id, title: 'Test Assigned', message: 'JavaScript Fundamentals Assessment has been assigned to you.', type: 'INFO' },
    ],
  });

  console.log('✅ Notifications created');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📋 Login Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Super Admin: superadmin@inter.edu / SuperAdmin@123');
  console.log('Admin:       admin@inter.edu / Admin@123');
  console.log('Student 1:   student1@inter.edu / Student@123');
  console.log('Student 2:   student2@inter.edu / Student@123');
  console.log('Student 3:   student3@inter.edu / Student@123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
