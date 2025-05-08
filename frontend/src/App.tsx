import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonGroup } from '@mui/material';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const navigate = useNavigate(); // Hook para redirigir
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  // Redirigir si no hay token
  useEffect(() => {
    if (!token) {
      navigate('/login'); // Redirige a la página de login
    } else {
      // Obtener tareas solo si hay token
      axios.get('http://localhost:8000/api/tasks/', {
        headers: { Authorization: `Token ${token}` }
      })
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));
    }
  }, [token, navigate]);

  // Crear una nueva tarea
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/tasks/', {
      title: newTaskTitle,
      completed: false,
    }, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => {
      setTasks([...tasks, res.data]);
      setNewTaskTitle('');
    })
    .catch(err => console.error(err));
  };

  // Función para iniciar edición
  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditedTitle(task.title);
  };

  // Función para guardar edición
  const handleSaveEdit = (id: number) => {
    axios.patch(`http://localhost:8000/api/tasks/${id}/`, {
      title: editedTitle
    }, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => {
      setTasks(tasks.map(task => task.id === id ? res.data : task));
      setEditingTaskId(null);
      setEditedTitle('');
    })
    .catch(err => console.error(err));
  };

  // Eliminar una tarea
  const handleDelete = (id: number) => {
    axios.delete(`http://localhost:8000/api/tasks/${id}/`, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(() => {
      setTasks(tasks.filter(task => task.id !== id));
    })
    .catch(err => console.error(err));
  };

  // Alternar estado completado de una tarea
  const handleToggleCompleted = (id: number, currentStatus: boolean) => {
    axios.patch(`http://localhost:8000/api/tasks/${id}/`, {
      completed: !currentStatus
    }, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => {
      setTasks(tasks.map(task => task.id === id ? res.data : task));
    })
    .catch(err => console.error(err));
  };

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null); // Actualiza el estado
    navigate('/login'); // Redirige a la página de login
  };

  // Filtrados
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Mis Tareas</h1>
      
      <div className="text-end mb-3">
        <button className="btn btn-danger" onClick={handleLogout}>
          🔒 Cerrar sesión
        </button>
      </div>
  
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Nueva tarea"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            required
          />
          <button className="btn btn-primary" type="submit">➕ Agregar</button>
        </div>
      </form>

      <ButtonGroup fullWidth sx={{ mb: 3 }}>
        <Button
          variant={filter === 'all' ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => setFilter('all')}
        >
          Todas
        </Button>
        <Button
          variant={filter === 'pending' ? 'contained' : 'outlined'}
          color="warning"
          onClick={() => setFilter('pending')}
        >
          Pendientes
        </Button>
        <Button
          variant={filter === 'completed' ? 'contained' : 'outlined'}
          color="success"
          onClick={() => setFilter('completed')}
        >
          Hechas
        </Button>
      </ButtonGroup>

  
      <ul className="list-group">
        {filteredTasks.map(task => (
          <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div style={{ flex: 1 }}>
              {editingTaskId === task.id ? (
                <input
                  type="text"
                  className="form-control"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
              ) : (
                <>
                  {task.title}
                  <span className={`badge ms-2 bg-${task.completed ? 'success' : 'secondary'}`}>
                    {task.completed ? 'Hecha' : 'Pendiente'}
                  </span>
                </>
              )}
            </div>
  
            <div className="ms-3 d-flex gap-2">
              {editingTaskId === task.id ? (
                <>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleSaveEdit(task.id)}
                  >
                    💾
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => setEditingTaskId(null)}
                  >
                    ❌
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-sm btn-info"
                  onClick={() => handleEdit(task)}
                >
                  ✏️
                </button>
              )}
  
              <button
                className="btn btn-sm btn-warning"
                onClick={() => handleToggleCompleted(task.id, task.completed)}
              >
                {task.completed ? '⬅️' : '✔️'}
              </button>
  
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(task.id)}
              >
                🗑
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
  
}

export default App;
