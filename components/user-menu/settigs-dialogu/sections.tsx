import type { ReactNode } from "react";
import type { UserType } from "@/types/user";
import { Palette, FileCheck } from "lucide-react";

import EditProfileSetting from "./sections_cmps/EditProfileSetting";
import ChangePasswordSetting from "./sections_cmps/changePassword";

import EmailAlertsSetting from "./sections_cmps/EmailAlertsSetting";
import SMSAlertsSetting from "./sections_cmps/SMSAlertsSetting";
import ContactSupportSetting from "./sections_cmps/ContactSupportSetting";
import KycStatusSetting from "./sections_cmps/KycStatusSettings";
import ThemeSelection from "./sections_cmps/themeSelection";

export type DialogListItem =
  | {
      type?: "item";
      icon: React.ReactNode;
      title: string;
      onClick?: () => void;
      trailing?: React.ReactNode;
      showChevron?: boolean;
    }
  | {
      type: "component";
      component?: ReactNode;
      render?: (user?: UserType) => ReactNode;
    };

export function createSettingsSections(): Array<{
  key: string;
  items: Array<
    | ({ key: string } & Extract<DialogListItem, { type?: "item" }>)
    | ({ key: string } & Extract<DialogListItem, { type: "component" }>)
  >;
}> {
  return [
    {
      key: "account",
      items: [
        {
          key: "edit-profile",
          type: "component",
          render: (user) => <EditProfileSetting user={user} />,
        },
        {
          key: "change-password",
          type: "component",
          render: (user) => <ChangePasswordSetting user={user} />,
        },
      ],
    },
    {
      key: "identity",
      items: [
        {
          key: "kyc-status",
          type: "component",
          render: (user) => <KycStatusSetting user={user} />,
        },
      ],
    },
    {
      key: "preferences",
      items: [
        {
          key: "email-alerts",
          type: "component",
          render: () => <EmailAlertsSetting />,
        },
        {
          key: "sms-alerts",
          type: "component",
          render: () => <SMSAlertsSetting />,
        },
        {
          key: "theme-choice",
          type: "component",
          render: () => <ThemeSelection />,
        },
      ],
    },
    // {
    //   key: "help",
    //   items: [
    //     {
    //       key: "support",
    //       type: "component",
    //       render: () => <ContactSupportSetting />,
    //     },
    //     {
    //       key: "terms",
    //       icon: <FileCheck className="w-5 h-5" />,
    //       title: "Terms & Conditions",
    //       onClick: () => console.log("Terms & Conditions"),
    //     },
    //   ],
    // },
  ];
}
