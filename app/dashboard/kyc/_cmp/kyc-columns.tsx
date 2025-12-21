import { formatDate } from "@/utils/format";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { KycWithUser } from "@/types/kyc/kyc";

function ImagePreview({ url, alt }: { url: string; alt: string }) {
  if (!url) return <span className="text-gray-400">--</span>;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <img
          src={url}
          alt={alt}
          className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80 transition"
        />
      </DialogTrigger>
      <DialogContent className="max-w-md">
        {/* <VisuallyHidden> */}
        <DialogTitle className="hidden">{alt}</DialogTitle>
        {/* </VisuallyHidde> */}
        <img src={url} alt={alt} className="w-full h-auto rounded-lg shadow" />
      </DialogContent>
    </Dialog>
  );
}

export const kycColumns = [
  {
    key: "user_name",
    label: "User Name",
    render: (kyc: KycWithUser) => (
      <div className="flex flex-col">
        <span className="font-medium">{kyc.user?.name || "--"}</span>
        <span className="text-xs text-muted-foreground">
          {kyc.user?.id || "--"}
        </span>
      </div>
    ),
  },
  {
    key: "full_name",
    label: "Full Name",
    render: (kyc: KycWithUser) => (
      <span className="font-medium">{kyc.full_name}</span>
    ),
  },
  {
    key: "id_type",
    label: "ID Type",
    render: (kyc: KycWithUser) => (
      <span className="capitalize">{kyc.id_type}</span>
    ),
  },
  {
    key: "id_number",
    label: "ID Number",
    render: (kyc: KycWithUser) => <span>{kyc.id_number}</span>,
  },
  {
    key: "id_file_url",
    label: "ID Document",
    render: (kyc: KycWithUser) => (
      <ImagePreview url={kyc.id_file_url} alt="ID Document" />
    ),
  },
  {
    key: "selfie_url",
    label: "Selfie",
    render: (kyc: KycWithUser) => (
      <ImagePreview url={kyc.selfie_url} alt="Selfie" />
    ),
  },
  {
    key: "kyc_status",
    label: "Status",
    render: (kyc: KycWithUser) => (
      <span
        className={`capitalize font-medium ${
          kyc.kyc_status === "pending"
            ? "text-yellow-600"
            : kyc.kyc_status === "verified"
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {kyc.kyc_status}
      </span>
    ),
  },
  // {
  //   key: "created_at",
  //   label: "Submitted At",
  //   render: (kyc: Kyc) => <span>{formatDate(kyc.created_at)}</span>,
  // },
  // {
  //   key: "verified_at",
  //   label: "Verified At",
  //   render: (kyc: Kyc) =>
  //     kyc.verified_at ? <span>{formatDate(kyc.verified_at)}</span> : "--",
  // },
];
