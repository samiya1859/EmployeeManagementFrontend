let currentSortField = '';
let currentSortOrder = 'asc';

// Initialize date picker
flatpickr("#searchDate", {
    dateFormat: "Y-m-d", // Adjust the date format as needed
});

// Initialize search functionality
document.getElementById('searchBtn').addEventListener('click', function() {
    const name = document.getElementById('searchName').value;
    const date = document.getElementById('searchDate').value;
    const email = document.getElementById('searchEmail').value;
    const mobile = document.getElementById('searchMobile').value;

    // Build search query
    let searchQuery = '?';
    if (name) searchQuery += `name=${encodeURIComponent(name)}&`;
    if (date) searchQuery += `birth=${encodeURIComponent(date)}&`;
    if (email) searchQuery += `email=${encodeURIComponent(email)}&`;
    if (mobile) searchQuery += `phone=${encodeURIComponent(mobile)}&`;

    // Remove trailing "&" or "?" from the query string
    searchQuery = searchQuery.replace(/&$/, '');
    searchQuery = searchQuery.replace(/\?$/, '');

    // Fetch filtered employees
    GetEmployees(1, 5, searchQuery);
});

// Fetch employees with sorting and searching
function GetEmployees(page = 1, pageSize = 5, query = '') {
    const sortQuery = currentSortField ? `&ordering=${currentSortOrder === 'asc' ? '' : '-'}${currentSortField}` : '';
    fetch(`http://127.0.0.1:8000/employee/employees/?page=${page}&page_size=${pageSize}${query}${sortQuery}`)
        .then(response => response.json())
        .then(data => {
            console.log('API Response Data:', data);  // Log data for debugging
            renderTable(data.results);
            updatePagination(data);
        })
        .catch(error => console.error('Error fetching employees:', error));
}

// Handle column header clicks for sorting
function sortTable(field) {
    // Toggle sort order
    if (currentSortField === field) {
        currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortField = field;
        currentSortOrder = 'asc';
    }
    
    // Update table with sorted data
    GetEmployees(1, 5, document.getElementById('searchBtn').dataset.query || '');
}



// editing employee
function editEmployee(id) {
    // Navigate to the edit page with the employee ID
    window.location.href = `editEmployee.html?id=${id}`;
}

// Render table with employee data
function renderTable(employees) {
    const tableBody = document.querySelector('#employeeTable tbody');
    tableBody.innerHTML = '';  // Clear existing rows

    if (Array.isArray(employees)) {
        employees.forEach(employee => {
            const row = `
                <tr>
                    <td><img src="${employee.image}" alt="Employee Photo" width="50"></td>
                    <td>${employee.first_name} ${employee.last_name}</td>
                    <td>${employee.email}</td>
                    <td>${employee.phone}</td>
                    <td>${employee.birth}</td>
                    <td>
                        <button class="btn btn-warning" onclick="editEmployee(${employee.id})"><i class="ri-edit-box-fill"></i></button>
                        <button class="btn btn-danger" onclick="DeleteEmployee(${employee.id})"><i class="ri-delete-bin-6-fill"></i></button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } else {
        console.error('Invalid data format:', employees);
    }
}

// Update pagination controls
function updatePagination(data) {
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';

    // Previous button
    if (data.previous) {
        pagination.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick="GetEmployees(${getPageNumber(data.previous)})">«</a></li>`;
    } else {
        pagination.innerHTML += `<li class="page-item disabled"><span class="page-link">«</span></li>`;
    }

    const currentPage = getPageNumber(data.next) || 1;
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(100, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        const activeClass = (i === currentPage) ? 'active' : '';
        pagination.innerHTML += `<li class="page-item ${activeClass}"><a class="page-link" href="#" onclick="GetEmployees(${i})">${i}</a></li>`;
    }

    // Next button
    if (data.next) {
        pagination.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick="GetEmployees(${getPageNumber(data.next)})">»</a></li>`;
    } else {
        pagination.innerHTML += `<li class="page-item disabled"><span class="page-link">»</span></li>`;
    }
}

// Get page number from URL
function getPageNumber(url) {
    try {
        const params = new URLSearchParams(new URL(url).search);
        return parseInt(params.get('page'), 10);
    } catch (e) {
        console.error('Error extracting page number from URL:', e);
        return 1;  // Default to page 1 if there's an error
    }
}

// Initial call to load the first page of employees
GetEmployees();



// Deleting the employee

function DeleteEmployee(id) {
    // Ask for confirmation before proceeding with deletion
    const confirmation = confirm("Are you sure you want to delete this employee?");
    
    if (confirmation) {
        // Perform the DELETE request to the API
        fetch(`http://127.0.0.1:8000/employee/employees/${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete employee');
            }

            console.log('employee deleted successfully');
            alert("employee deleted successfully")
            
        })
        .catch(error => {
            console.error('Error deleting employee:', error);
            
        });
    }
    
}


// editing Employee

// editemployee.js

document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the employee ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        // Fetch the current employee data
        fetch(`http://127.0.0.1:8000/employee/employees/${id}/`)
            .then(response => response.json())
            .then(data => {
                // Populate the form with employee data
                document.getElementById('first_name').value = data.first_name;
                document.getElementById('last_name').value = data.last_name;
                document.getElementById('email').value = data.email;
                document.getElementById('phone').value = data.phone;
                document.getElementById('birth').value = data.birth;
                // Handle image separately if needed
            })
            .catch(error => console.error('Error fetching employee data:', error));
    }

    // Handle form submission
    document.getElementById('editEmployeeForm').addEventListener('submit', (event) => {
        event.preventDefault();

        // Create FormData object
        const formData = new FormData();
        formData.append('image', document.getElementById('image').files[0]); // Get the file from file input
        formData.append('first_name', document.getElementById('first_name').value);
        formData.append('last_name', document.getElementById('last_name').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('phone', document.getElementById('phone').value);
        formData.append('birth', document.getElementById('birth').value);

        // Retrieve the employee ID from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        // Perform the PUT request to update the employee
        fetch(`http://127.0.0.1:8000/employee/employees/${id}/`, {
            method: 'PUT',
            body: formData,
            headers: {
                'Accept': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                alert('Employee updated successfully!');
                window.location.href = 'home.html'; // Redirect to the employee list
            } else {
                alert('Error updating employee.');
            }
        })
        .catch(error => {
            console.error('Error during update operation:', error);
            alert('Error updating employee.');
        });
    });
});
