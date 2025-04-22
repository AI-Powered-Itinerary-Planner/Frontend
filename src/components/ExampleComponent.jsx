import { useState, useEffect } from 'react';
import { fetchUsers } from '../services/api';

function ExampleComponent() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true);
        const response = await fetchUsers();
        setUsers(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch users: ' + (err.response?.data?.message || err.message));
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Users</h2>
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name || user.username}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExampleComponent;
