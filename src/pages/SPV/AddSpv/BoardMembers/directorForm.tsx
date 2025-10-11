import { FormFieldConfig } from "@/components/UseForm/ControllerMap";
import { useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";

export const directorFormConfig = ({
  index,
}: {
  index: number;
}): FormFieldConfig[] => {
  const { id: companyId } = useParams() as { id: string };
  const { control } = useFormContext();
  return [
    {
      label: "Full Name",
      name: `boardOfDirectors.additionalBoardMembers.${index}.fullName`,
      type: "text",
      fullWidth: false,
      control,
      rules: {
        required: "Full Name is required",
        minLength: {
          value: 3,
          message: "Full Name must be at least 3 characters",
        },
        maxLength: {
          value: 50,
          message: "Full Name must be at most 50 characters",
        },
        pattern: {
          value: /^[a-zA-Z0-9\s\-&,.'()]+$/,
          message: "Full Name contains invalid characters",
        },
      },
    },
    {
      control,
      label: "Email",
      name: `boardOfDirectors.additionalBoardMembers.${index}.email`,
      type: "email",
      fullWidth: false,
      rules: {
        required: "Email is required",
        pattern: {
          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          message: "Email is not valid",
        },
      },
    },

    {
      control,
      label: "Phone Number",
      name: `boardOfDirectors.additionalBoardMembers.${index}.phoneNumber`,
      type: "text",
      fullWidth: false,
      rules: {
        required: "Phone Number is required",
        minLength: {
          value: 9,
          message: "Phone Number must be at least 9 characters",
        },
        maxLength: {
          value: 13,
          message: "Phone Number must be at most 13 characters",
        },
        pattern: {
          // value: /^(?:\+254|254|7)(\d{8}|1\d{8})$/,
          value: /^(?:\+254|254)?7\d{8}$/,
          message:
            "Enter a valid  Phone number (e.g., 712345678 or +254712345678)",
        },
      },
    },
    {
      control,
      label: "Select Role",
      name: `boardOfDirectors.additionalBoardMembers.${index}.role`,
      type: "select",
      options: [
        { label: "Managing Partner", value: "treasury-manager" },
        { label: "Asset Partner", value: "asset-manager" },
      ],
    },
    {
      label: "Id Number",
      name: `boardOfDirectors.additionalBoardMembers.${index}.idNumber`,
      type: "text",
      fullWidth: false,
      control,
      rules: {
        required: "Id Number is required",
        minLength: {
          value: 3,
          message: "Id Number must be at least 3 characters",
        },
        maxLength: {
          value: 50,
          message: "Id Number must be at most 50 characters",
        },
        pattern: {
          value: /^[a-zA-Z0-9\s\-&,.'()]+$/,
          message: "Id Number contains invalid characters",
        },
      },
    },
    {
      control,
      label: "Id Proof",
      name: `boardOfDirectors.additionalBoardMembers.${index}.idProof`,
      type: "file",
      fullWidth: true,
      accept: ["png", "jpg", "jpeg", "pdf"],
      maxSize: 5 * 1024 * 1024,
      meta: {
        refId: companyId,
        belongsTo: "company",
        isPublic: true,
      },
      rules: {
        required: "Id Proof is required",
      },
    },
  ];
};
