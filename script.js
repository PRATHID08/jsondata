// Open Course API Endpoint (Replace with your preferred API)
const apiEndpoint = 'https://api.sampleapis.com/courses/courses'; 

let courses = [];
let currentPage = 1;
const coursesPerPage = 2;

// Fetch course data from API
async function fetchCourses() {
    try {
        const response = await fetch(apiEndpoint); // Fetch data from the API
        courses = await response.json(); // Parse the JSON data
        displayCourses();
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

// Display courses with pagination
function displayCourses() {
    const courseContainer = document.getElementById('course-container');
    courseContainer.innerHTML = '';

    const filteredCourses = filterCourses();
    const sortedCourses = sortCourses(filteredCourses);
    const paginatedCourses = paginateCourses(sortedCourses);

    paginatedCourses.forEach(course => {
        const courseDiv = document.createElement('div');
        courseDiv.className = 'course';
        courseDiv.innerHTML = `
            <h3>${course.title}</h3>
            <p>Instructor: ${course.instructor}</p>
            <p>Duration: ${course.duration}</p>
            <p>Rating: ${course.rating}</p>
            <p>Category: ${course.category}</p>
            <p>Price: ${course.price}</p>
            <p>Enrolled: ${course.enrolled}</p>
        `;
        courseContainer.appendChild(courseDiv);
    });

    updatePaginationInfo(filteredCourses.length);
}

function sortCourses(courses) {
    const sortBy = document.getElementById('sort').value;
    return courses.sort((a, b) => {
        if (sortBy === 'price' || sortBy === 'enrolled') {
            return parseFloat(a[sortBy].replace('$', '')) - parseFloat(b[sortBy].replace('$', ''));
        }
        return a[sortBy] > b[sortBy] ? 1 : -1;
    });
}

function filterCourses() {
    const filter = document.getElementById('filter').value.toLowerCase();
    return courses.filter(course => course.category.toLowerCase().includes(filter));
}

function paginateCourses(courses) {
    const startIndex = (currentPage - 1) * coursesPerPage;
    return courses.slice(startIndex, startIndex + coursesPerPage);
}

function updatePaginationInfo(totalCourses) {
    const pageInfo = document.getElementById('page-info');
    const totalPages = Math.ceil(totalCourses / coursesPerPage);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

document.getElementById('sort').addEventListener('change', displayCourses);
document.getElementById('filter').addEventListener('input', displayCourses);
document.getElementById('prev').addEventListener('click', () => {
    if (currentPage > 1) currentPage--;
    displayCourses();
});
document.getElementById('next').addEventListener('click', () => {
    const totalCourses = filterCourses().length;
    const totalPages = Math.ceil(totalCourses / coursesPerPage);
    if (currentPage < totalPages) currentPage++;
    displayCourses();
});

// Sign-up form validation and submission
document.getElementById('signup-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const courseId = document.getElementById('course-id').value;
    const feedback = document.getElementById('form-feedback');

    if (name && email && courseId) {
        feedback.textContent = `Successfully signed up for course ${courseId}!`;
        feedback.style.color = 'green';
    } else {
        feedback.textContent = 'Please fill in all fields correctly.';
        feedback.style.color = 'red';
    }
});

// Initial fetch
fetchCourses();
