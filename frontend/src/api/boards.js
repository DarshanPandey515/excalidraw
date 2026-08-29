import { apiFetch } from './client';

export const apiListBoards = () => apiFetch('/boards/');

export const apiCreateBoard = (name) =>
  apiFetch('/boards/', { method: 'POST', body: { name } });

export const apiGetBoard = (boardId) => apiFetch(`/boards/${boardId}/`);

export const apiDeleteBoard = (boardId) =>
  apiFetch(`/boards/${boardId}/`, { method: 'DELETE' });

export const apiGetBoardElements = (boardId) =>
  apiFetch(`/boards/${boardId}/elements/`);

export const apiSaveBoardElements = (boardId, elements) =>
  apiFetch(`/boards/${boardId}/elements/`, { method: 'PUT', body: { elements } });