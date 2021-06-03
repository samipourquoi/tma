import { useQuery } from "react-query";
import { getUser } from "../api";

export const useUser = () => useQuery("user", () => getUser());
