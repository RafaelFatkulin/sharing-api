import { User, UserResponse } from "./users.types";

export const userToResponse = (user: User) => {
  return {
    ...user,
    password: undefined,
    createdAt: undefined,
  } as UserResponse;
};

export const usersToResponse = (users: User[]) => {
  return users.map((user: User) => userToResponse(user)) as UserResponse[] || [];
};
