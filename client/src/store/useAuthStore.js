import { create } from "zustand";

// Define a simple store for a counter
const useCounterStore = create((set) => ({
  isLoading: false,
  setIsLoading: (loading) => set(() => ({ isLoading: loading })),
  user: null,
  setUser: (userData) => set(() => ({ user: userData })),
  users: [],
  setUsers: (usersData) => set(() => ({ users: usersData })),
  documents: [],
  setDocuments: (rolesDocuments) => set(() => ({ documents: rolesDocuments })),
  notifications: [],
  setNotifications: (userNotifications) =>
    set(() => ({ notifications: userNotifications })),
}));

export default useCounterStore;
