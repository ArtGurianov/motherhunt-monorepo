"use client";

import { withWeb3ConnectBtn } from "@/lib/web3/withWeb3ConnectBtn";
import { Button } from "@shared/ui/components/button";
import { GetComponentProps } from "@shared/ui/lib/types";

const AddSuperAdminBtnCore = (props: GetComponentProps<typeof Button>) => {
  return (
    <Button
      className="h-full"
      type="submit"
      variant="flat"
      size="sm"
      {...props}
    />
  );
};

export const AddSuperAdminBtn = withWeb3ConnectBtn(AddSuperAdminBtnCore);
