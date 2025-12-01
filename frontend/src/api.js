import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : 'http://localhost:8000/api';

export const api = axios.create({
    baseURL: API_URL,
});

export const getPage = async (slug) => {
    const response = await api.get(`/pages/${slug}`);
    return response.data;
};

export const updatePage = async (slug, data) => {
    const response = await api.put(`/pages/${slug}`, data);
    return response.data;
};

export const diagnoseImage = async (imageUrl) => {
    const response = await api.post('/diagnose', { image_url: imageUrl });
    return response.data;
};

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data; // { url: ... }
};
