import api from './index';

export const uploadDataset = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/datasets/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getDatasets = async () => {
  const response = await api.get('/datasets');
  return response.data;
};

export const downloadDataset = async (id, format) => {
  const response = await api.get(`/datasets/${id}/download?format=${format}`, {
    responseType: 'blob',
  });
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  
  const contentDisposition = response.headers['content-disposition'];
  let fileName = `CleanIQ_Dataset.${format}`;
  if (contentDisposition) {
    const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
    if (fileNameMatch && fileNameMatch.length === 2) {
      fileName = fileNameMatch[1];
    }
  }
  
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const getDatasetReport = async (id) => {
  const response = await api.get(`/datasets/${id}`);
  return response.data;
};

export const getDatasetData = (id) => api.get(`/datasets/${id}/data`).then(res => res.data);
export const deleteDataset = (id) => api.delete(`/datasets/${id}`).then(res => res.data);

export const updateColumn = async (datasetId, columnId, updates) => {
  const response = await api.patch(`/datasets/${datasetId}/columns/${columnId}`, updates);
  return response.data;
};

export const cleanDataset = async (id) => {
  const response = await api.post(`/datasets/${id}/clean`);
  return response.data;
};
