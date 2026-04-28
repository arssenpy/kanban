import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listApi } from "./api";
import { queryKeys } from "@/shared/api/queryKeys";

export const useCreateBoard = () => {
  const queryClient = useQueryClient();
};
