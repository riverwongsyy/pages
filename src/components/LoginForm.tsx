// src/components/LoginForm.tsx
import React, { useState } from 'react';
import {
  Paper,
  Box,
  Avatar,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Alert,
  CircularProgress,
  Container,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

interface LoginFormProps {
  onLogin: (username: string, password: string, remember: boolean) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loading = false, error = null }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    await onLogin(username, password, remember);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: '24px',
          border: '2.5px solid rgba(247, 181, 0, 0.4)',
          boxShadow: '0 16px 36px -6px rgba(247, 181, 0, 0.3), 0 8px 16px -6px rgba(229, 57, 53, 0.15)',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(38, 32, 27, 0.95)' : 'rgba(255, 253, 245, 0.96)',
          backdropFilter: 'blur(12px)',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          '&:hover': {
            borderColor: '#F7B500',
            boxShadow: '0 20px 40px -6px rgba(247, 181, 0, 0.4), 0 10px 20px -6px rgba(229, 57, 53, 0.2)',
          },
        }}
      >
        {/* 顶部蜂蜜罐头像徽章 */}
        <Avatar
          sx={{
            m: 1,
            bgcolor: '#FFE082',
            color: '#E53935',
            width: 56,
            height: 56,
            border: '2px solid #F7B500',
            boxShadow: '0 4px 12px rgba(247, 181, 0, 0.3)',
            fontSize: '1.8rem',
          }}
        >
          🍯
        </Avatar>

        {/* 标题 */}
        <Typography
          component="h1"
          variant="h5"
          fontWeight="800"
          sx={{
            color: '#5D4037',
            mt: 1,
            mb: 2,
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          导航站登录 🐝
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2, borderRadius: '14px' }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          {/* 用户名输入框 */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="用户名"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '14px',
                bgcolor: 'rgba(255, 248, 231, 0.6)',
                '& fieldset': {
                  borderColor: 'rgba(247, 181, 0, 0.4)',
                },
                '&:hover fieldset': {
                  borderColor: '#F7B500',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#E53935',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#8D6E63',
                '&.Mui-focused': {
                  color: '#E53935',
                },
              },
              '& .MuiInputBase-input': {
                color: '#5D4037',
                fontWeight: '500',
              },
            }}
          />

          {/* 密码输入框 */}
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="密码"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '14px',
                bgcolor: 'rgba(255, 248, 231, 0.6)',
                '& fieldset': {
                  borderColor: 'rgba(247, 181, 0, 0.4)',
                },
                '&:hover fieldset': {
                  borderColor: '#F7B500',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#E53935',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#8D6E63',
                '&.Mui-focused': {
                  color: '#E53935',
                },
              },
              '& .MuiInputBase-input': {
                color: '#5D4037',
              },
            }}
          />

          {/* 记住我 复选框 */}
          <FormControlLabel
            control={
              <Checkbox
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                sx={{
                  color: '#F7B500',
                  '&.Mui-checked': {
                    color: '#E53935',
                  },
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ color: '#5D4037', fontWeight: '500' }}>
                记住我（一个月内免登录）
              </Typography>
            }
            sx={{ mt: 1, mb: 1 }}
          />

          {/* 登录按钮 */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 2,
              mb: 2,
              py: 1.4,
              bgcolor: '#E53935',
              color: '#FFFFFF',
              fontWeight: 'bold',
              fontSize: '1rem',
              borderRadius: '20px',
              boxShadow: '0 6px 18px rgba(229, 57, 53, 0.35)',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              '&:hover': {
                bgcolor: '#C62828',
                boxShadow: '0 8px 24px rgba(229, 57, 53, 0.45)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#FFF' }} /> : '登 录'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginForm;
