import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'

// Define the User interface
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

const App: React.FC = () => {
  // State to store the list of users
  const [users, setUsers] = useState<User[]>([]);
  // State to store the search term
  const [searchTerm, setSearchTerm] = useState<string>('');
  // State to store the new user being added
  const [newUser, setNewUser] = useState<User>({ id: 0, name: '', username: '', email: '' });

  // Effect to fetch users on component mount
  useEffect(() => {
    // Function to fetch users from the API
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>('https://jsonplaceholder.typicode.com/users');
        setUsers(response.data);
        localStorage.setItem('users', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    // Check for users in local storage
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      fetchUsers();
    }
  }, []);

  // Handle search input change
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle user deletion
  const handleDelete = (userId: number) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  // Handle new user input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewUser(prevState => ({ ...prevState, [name]: value }));
  };

  // Handle form submission to add a new user
  const handleAddUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedUsers = [...users, { ...newUser, id: users.length ? users[users.length - 1].id + 1 : 1 }];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setNewUser({ id: 0, name: '', username: '', email: '' });
  };

  // Filter users based on the search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Users List</h1>
      
      {/* Form to add a new user */}
      <form onSubmit={handleAddUser}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newUser.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={newUser.username}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add User</button>
      </form>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search users by name"
        value={searchTerm}
        onChange={handleSearch}
      />

      {/* List of filtered users */}
      <ul>
        {filteredUsers.map(user => (
          <li key={user.id}>
            {user.name} ({user.username}) - {user.email}
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
