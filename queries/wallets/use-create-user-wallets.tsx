import createUserWallets from "@/server/wallets/create-user-wallets";

import { useMutation } from "@tanstack/react-query";
export const useCreateUserWalllets = () => {
  const { mutate: createWallets, isPending: isCreating } = useMutation({
    mutationFn: () => createUserWallets(),
  });

  return { createWallets, isCreating };
};
