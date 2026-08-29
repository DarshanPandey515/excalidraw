const cacheKey = (boardId) => `excalidraw-clone.board.${boardId}`;

export const loadLocalCache = (boardId) => {
  try {
    const raw = localStorage.getItem(cacheKey(boardId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveLocalCache = (boardId, elements) => {
  try {
    localStorage.setItem(cacheKey(boardId), JSON.stringify(elements));
  } catch {
    // storage full or unavailable — ignore
  }
};