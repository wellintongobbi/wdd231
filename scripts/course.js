const courses = [
  {
    subject: 'CSE',
    number: 110,
    title: 'Introduction to Programming',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'Introduction to programming concepts including variables, data types, loops, and functions.',
    technology: ['Python', 'VS Code'],
    completed: true,
  },
  {
    subject: 'WDD',
    number: 130,
    title: 'Web Fundamentals',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'Introduction to HTML, CSS, and web design principles.',
    technology: ['HTML', 'CSS'],
    completed: true,
  },
  {
    subject: 'CSE',
    number: 111,
    title: 'Programming with Functions',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'Deeper study of functions, testing, and debugging in Python.',
    technology: ['Python', 'VS Code'],
    completed: true,
  },
  {
    subject: 'CSE',
    number: 210,
    title: 'Programming with Classes',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'Object-oriented programming concepts using C#.',
    technology: ['C#', '.NET'],
    completed: true,
  },
  {
    subject: 'WDD',
    number: 131,
    title: 'Dynamic Web Fundamentals',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'Introduction to JavaScript for the web and DOM manipulation.',
    technology: ['HTML', 'CSS', 'JavaScript'],
    completed: true,
  },
  {
    subject: 'WDD',
    number: 231,
    title: 'Frontend Web Development I',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'Responsive design, accessibility, and modern JavaScript.',
    technology: ['HTML', 'CSS', 'JavaScript'],
    completed: false,
  },
];

// ── DOM References ───────────────────────────────────────────
const courseList = document.getElementById('course-list');
const creditsNumber = document.getElementById('credits-number');
const filterButtons = document.querySelectorAll('.filter-btn');

// ── Render Function ──────────────────────────────────────────
function renderCourses(filter) {
  if (!courseList) return;

  // Filter
  const filtered = filter === 'all'
    ? courses
    : courses.filter(c => c.subject === filter);

  // Build HTML
  courseList.innerHTML = filtered
    .map(course => {
      const completedClass = course.completed ? ' completed' : '';
      const label = `${course.subject} ${course.number}`;
      const title = course.completed ? `${label} ✓` : label;
      return `<div class="course-card${completedClass}" title="${course.title} (${course.credits} credits)">${title}</div>`;
    })
    .join('');

  // Total credits via reduce
  const total = filtered.reduce((sum, c) => sum + c.credits, 0);
  if (creditsNumber) creditsNumber.textContent = total;
}

// ── Filter Button Listeners ──────────────────────────────────
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update aria-pressed and active class
    filterButtons.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');

    renderCourses(btn.dataset.filter);
  });
});

// ── Initial Render ────────────────────────────────────────────
renderCourses('all');
