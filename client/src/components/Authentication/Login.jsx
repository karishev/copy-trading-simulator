import React, { useState, useContext } from "react";
import {
  Box,
  Typography,
  TextField,
  CssBaseline,
  Button,
  Card,
  CardContent,
  Grid,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import axios from 'axios';
import config from "../../config/Config";

import styles from "./Auth.module.css";

const Login = () => {
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const onChangeEmail = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError("");
  };

  const onChangePassword = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setPasswordError("");
    
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        setUserData({
          user: response.data.user,
          token: response.data.token
        });
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className={styles.background}>
      <CssBaseline />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
      >
        <Box width="70vh" boxShadow={1}>
          <Card className={styles.paper}>
            <CardContent>
              <Typography component="h1" variant="h5">
                Login
              </Typography>
              <form className={styles.form} onSubmit={handleSubmit}>
                {error && (
                  <Typography color="error" align="center" style={{ marginBottom: '1rem' }}>
                    {error}
                  </Typography>
                )}
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  error={!!emailError}
                  helperText={emailError}
                  value={email}
                  onChange={onChangeEmail}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  error={!!passwordError}
                  helperText={passwordError}
                  value={password}
                  onChange={onChangePassword}
                />
                <Box display="flex" justifyContent="center">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={styles.submit}
                  >
                    Login
                  </Button>
                </Box>
              </form>
              <Grid container justify="center">
                <Grid item>
                  <Link href="/register" variant="body2">
                    Need an account?
                  </Link>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </div>
  );
};

export default Login;
