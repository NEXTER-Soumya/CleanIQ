import api from './index';

export const getInsights = async (datasetId) => {
  const response = await api.get(`/datasets/${datasetId}/insights`);
  return response.data;
};

export const generateInsights = async (datasetId) => {
  const response = await api.post(`/datasets/${datasetId}/insights`);
  return response.data;
};

export const askQuestion = async (datasetId, prompt) => {
  const response = await api.post(`/datasets/${datasetId}/insights/ask`, { prompt });
  return response.data;
};
