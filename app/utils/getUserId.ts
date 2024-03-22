import Cookies from "js-cookie";

export const getUserId = () => {
  const userId = Cookies.get("userId");
  if (!userId) {
    throw new Error("User ID not found");
  }
  return userId;
};
