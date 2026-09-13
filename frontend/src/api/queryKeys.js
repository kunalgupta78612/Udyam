export const schemeKeys = {
  all: ['schemes'],
  publicList: () => [...schemeKeys.all, 'public'],
  userMatches: (userId) => [...schemeKeys.all, 'match', userId],
  saved: (userId) => ['user', userId, 'saved'],
  adminList: () => [...schemeKeys.all, 'admin'],
  detail: (schemeId) => [...schemeKeys.all, 'detail', schemeId],
  history: (schemeId) => [...schemeKeys.all, 'history', schemeId],
  pending: () => [...schemeKeys.all, 'pending'],
  analytics: () => [...schemeKeys.all, 'analytics'],
};

export const authKeys = {
  user: () => ['auth', 'user'],
};

export const profileKeys = {
  current: () => ['profile', 'current'],
};
