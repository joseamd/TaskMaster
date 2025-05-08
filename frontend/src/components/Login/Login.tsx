import {
    Avatar,
    Button,
    CircularProgress,
    Container,
    Stack,
    TextField,
    Typography,
  } from '@mui/material';
  import { useState } from 'react';
  import axios from 'axios';
  import { useNavigate } from 'react-router-dom';
  import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
  import { Paper } from '@mui/material';
  import './LoginPage.css';

  
  function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError('');
  
      try {
        const res = await axios.post('http://localhost:8000/api/auth/token/login/', {
          username,
          password
        });
        const token = res.data.auth_token;
        localStorage.setItem('token', token); // Guardamos el token en localStorage
        navigate('/');  // Redirige a la página de tareas
    } catch (err) {
        setError('Usuario o contraseña incorrectos');
        console.error(err);
      
    } finally {
        setLoading(false);
      }
    };
  
  return (
    <Stack className="login-container">
      <Stack className="login-header">
        <Typography component="span" variant="h5" color="white">
          Mi App de Tareas
        </Typography>
      </Stack>

      <Stack sx={{ height: '100%', width: '100%' }}>
        <Container maxWidth="xs">
          <Paper elevation={3} className="paper">
            <div className="avatar-container">
              <Avatar className="avatar">
                <LockOutlinedIcon />
              </Avatar>
            </div>

            <Typography variant="h4" component="h1" gutterBottom className="title">
              Iniciar sesión
            </Typography>

            <form onSubmit={handleSubmit} className="form">
              <Stack spacing={2}>
                <TextField
                  label="Usuario"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label="Contraseña"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                />
                {error && (
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  fullWidth
                  className="button"
                >
                  {loading ? <CircularProgress size={24} /> : 'Ingresar'}
                </Button>
              </Stack>
            </form>
          </Paper>
        </Container>
      </Stack>
    </Stack>
  );
}

export default LoginPage;
  