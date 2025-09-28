"use client";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Shield, CheckCircle, RotateCcw, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { PreviewModal } from "./_cmps/PreviewModal";
import { FileUpload } from "./_cmps/FileUpload";
import { toast } from "sonner";
import { useFilePreview } from "./_hooks/use-file-preview";
import { useModal } from "./_hooks/useModals";
import useSubmitKyc from "@/queries/kyc/use-submit-kyc";

interface KYCFormData {
  fullName: string;
  idType: string;
  idNumber: string;
  idPhoto: File | null;
  selfie: File | null;
}

const idTypes = [
  { value: "passport", label: "Passport (Recommended)" },
  { value: "drivers_license", label: "Driver's License" },
  { value: "national_id", label: "National ID" },
];

const KYCVerification = () => {
  const form = useForm<KYCFormData>({
    defaultValues: {
      fullName: "",
      idType: "",
      idNumber: "",
      idPhoto: null,
      selfie: null,
    },
  });

  const idPhoto = useFilePreview();
  const selfie = useFilePreview();
  const previewModal = useModal();

  const { submitKYC, isPending } = useSubmitKyc();

  const clearForm = () => {
    form.reset();
    idPhoto.clear();
    selfie.clear();
    toast("All form data has been cleared.");
  };

  const onSubmit = (data: KYCFormData) => {
    if (!idPhoto.file || !selfie.file) {
      toast.error("Both ID photo and selfie are required!");
      return;
    }

    submitKYC({
      fullName: data.fullName,
      idType: data.idType,
      idNumber: data.idNumber,
      idPhoto: idPhoto.file,
      selfie: selfie.file,
    });

    // Optionally reset form and previews here, or inside onSuccess
    form.reset();
    idPhoto.clear();
    selfie.clear();
  };

  return (
    <div className="min-h-screen bg-gradient-bg py-8 px-4">
      <div className="container max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            KYC Verification
          </h1>
          <p className="text-muted-foreground">
            Complete your identity verification to access all features securely.
          </p>
        </div>

        <Card className="shadow-lg bg-gradient-card border-0">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-accent" />
              <span>Identity Verification</span>
            </CardTitle>
            <CardDescription>
              Please provide accurate information and clear photos for quick
              processing.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Personal Info */}
                <FormField
                  control={form.control}
                  name="fullName"
                  rules={{ required: "Full name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter full name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="idType"
                    rules={{ required: "ID type is required" }}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>ID Type *</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value} // <-- bind value
                            onValueChange={field.onChange} // <-- bind onChange
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select ID type" />
                            </SelectTrigger>
                            <SelectContent>
                              {idTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="idNumber"
                    rules={{ required: "ID number is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID Number *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter ID number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Document Uploads */}
                <FormField
                  control={form.control}
                  name="idPhoto"
                  rules={{ required: "ID photo is required" }}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FileUpload
                        label="Upload ID Photo"
                        required
                        onFileSelect={(file) => {
                          field.onChange(file);
                          idPhoto.handleFileSelect(file);
                        }}
                        preview={idPhoto.preview}
                        error={fieldState.error?.message}
                      />
                      {idPhoto.preview && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            previewModal.openModal(idPhoto.preview, "ID Photo")
                          }
                        >
                          Preview ID
                        </Button>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="selfie"
                  rules={{ required: "Selfie is required" }}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FileUpload
                        label="Upload Selfie"
                        required
                        onFileSelect={(file) => {
                          field.onChange(file);
                          selfie.handleFileSelect(file);
                        }}
                        preview={selfie.preview}
                        error={fieldState.error?.message}
                      />
                      {selfie.preview && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            previewModal.openModal(selfie.preview, "Selfie")
                          }
                        >
                          Preview Selfie
                        </Button>
                      )}
                    </FormItem>
                  )}
                />

                <Separator />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button disabled={isPending} type="submit" className="flex-1">
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" /> Submit
                        Verification
                      </>
                    )}
                  </Button>

                  <Button
                    disabled={isPending}
                    type="button"
                    variant="secondary"
                    onClick={clearForm}
                    className="flex-1 sm:flex-initial"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" /> Clear Form
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <PreviewModal
          isOpen={previewModal.isOpen}
          onClose={previewModal.closeModal}
          imageUrl={previewModal.imageUrl}
          title={previewModal.title}
        />
      </div>
    </div>
  );
};

export default KYCVerification;
