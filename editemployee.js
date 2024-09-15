document.addEventListener('DOMContentLoaded', () => {
    const employeeId = new URLSearchParams(window.location.search).get('id');
    if (employeeId) {
        fetchEmployee(employeeId);
    }

    document.getElementById('editEmployeeForm').addEventListener('submit', function(event) {
        event.preventDefault();
        updateEmployee(employeeId);
    });
});

function fetchEmployee(id) {
    fetch(`http://127.0.0.1:8000/employee/employees/${id}/`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('image').value = ""; // Handle file input separately
            document.getElementById('first_name').value = data.first_name;
            document.getElementById('last_name').value = data.last_name;
            document.getElementById('email').value = data.email;
            document.getElementById('phone').value = data.phone;
            document.getElementById('birth').value = data.birth;
        })
        .catch(error => console.error('Error fetching employee:', error));
}

function updateEmployee(id) {
    const formData = new FormData();
    const imageFile = document.getElementById('image').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }
    formData.append('first_name', document.getElementById('first_name').value);
    formData.append('last_name', document.getElementById('last_name').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('phone', document.getElementById('phone').value);
    formData.append('birth', document.getElementById('birth').value);

    fetch(`http://127.0.0.1:8000/employee/employees/${id}/`, {
        method: 'PUT',
        body: formData,
        
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) {
            alert('Employee updated successfully!');
            // Optionally, redirect or clear form
            document.getElementById('editEmployeeForm').reset(); // Clear the form
        } else {
            alert('Error updating employee.');
        }
    })
    .catch(error => {
        console.error('Error during update operation:', error);
        alert('Error updating employee.');
    });
}
