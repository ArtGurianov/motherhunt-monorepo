"use client";

import { withWeb3ConnectBtn } from "@/lib/web3/withWeb3ConnectBtn";
import { Button } from "@shared/ui/components/button";
import { GetComponentProps } from "@shared/ui/lib/types";

const AdminSignInBtnCore = (props: GetComponentProps<typeof Button>) => {
  return <Button type="submit" variant="secondary" size="lg" {...props} />;
};

export const AdminSignInBtn = withWeb3ConnectBtn(AdminSignInBtnCore);
