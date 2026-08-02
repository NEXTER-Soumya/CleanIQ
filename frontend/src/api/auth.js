import api from './index';

export const sendOtp = async (phoneNumber, mode = 'login') => {
  const response = await api.post('/auth/send-otp', { phoneNumber, mode });
  return response.data;
};

export const verifyOtp = async (phoneNumber, otp, realName) => {
  const response = await api.post('/auth/verify-otp', { phoneNumber, otp, realName });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put('/auth/me', data);
  return response.data;
};

export const deleteAccount = async () => {
  const response = await api.delete('/auth/me');
  return response.data;
};
