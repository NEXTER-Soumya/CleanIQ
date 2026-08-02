import api from './index';

export const upgradeSubscription = async () => {
  const response = await api.post('/subscription/upgrade');
  return response.data;
};

export const switchPlan = async (plan) => {
  const response = await api.post('/subscription/switch', { plan });
  return response.data;
};
