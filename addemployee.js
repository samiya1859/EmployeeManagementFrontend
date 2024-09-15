
// Initialize date picker
flatpickr("#birth", {
    dateFormat: "Y-m-d",
})
// Handle form submission


const AddEmployee = (event) => {
    event.preventDefault();

    // Create FormData object
    const formData = new FormData();

    // Append form fields to FormData
    formData.append('image', document.getElementById('image').files[0]); // Get the file from file input
    formData.append('first_name', document.getElementById('first_name').value);
    formData.append('last_name', document.getElementById('last_name').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('phone', document.getElementById('phone').value);
    formData.append('birth', document.getElementById('birth').value);

    // Make the POST request to add a new employee
    fetch('http://127.0.0.1:8000/employee/employees/', {
        method: 'POST',
        body: formData,
        
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(`Error: ${errorData.detail || 'Unknown error'}`);
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.id) {
            alert('Employee added successfully!');
            document.getElementById('addEmployeeForm').reset(); // Clear the form
        } else {
            alert('Error adding employee.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error adding employee.');
    });
};

// Attach the AddEmployee function to the form's submit event
document.getElementById('addEmployeeForm').addEventListener('submit', AddEmployee);


// Attach the AddEmployee function to the form's submit event
document.getElementById('addEmployeeForm').addEventListener('submit', AddEmployee);
