import { useFormContext } from "react-hook-form";
import { FormFieldConfig } from "@/components/UseForm/ControllerMap";
import { TENANT_TYPE } from "@/constants/global";
import {useParams} from "react-router-dom";


export const formConfig = (index: number): FormFieldConfig[] => {
  const { control } = useFormContext();
  const { id } = useParams()
  return [
    {
      type: "text",
      name: `tenants.${index}.name`,
      control,
      label: "Tenant Name",
      placeholder: "Enter Tenant Name",
    },
    {
      type: "select",
      name: `tenants.${index}.type`,
      control,
      label: "Tenant Type",
      options: TENANT_TYPE,
    },
    {
      type: "number",
      name: `tenants.${index}.annualRentEscalation`,
      control,
      label: "Annual Rent Escalation",
      placeholder: "Annual Rent Escalation",
    },
    {
      type: "number",
      name: `tenants.${index}.lockInPeriod`,
      control,
      label: "Lock In Period",
      placeholder: "Enter Lock In Period in Months",
    },
    {
      type: "number",
      name: `tenants.${index}.sftsAllocated`,
      control,
      label: "SFTs Allocated",
      placeholder: "Enter SFTs Allocated",
      onChange: (value: any) => {
        console.log("SFTs Allocated", value.target.value);
      },
    },
    {
      type: "number",
      name: `tenants.${index}.rentPerSft`,
      control,
      label: "Rent Per Sft",
    },
    {
      type: "date",
      name: `tenants.${index}.startDate`,
      control,
      label: "Start Date",
    },
    {
      type: "date",
      name: `tenants.${index}.endDate`,
      control,
      label: "End Date",
    },

    {
      type: "number",
      name: `tenants.${index}.leasePeriod`,
      control,
      label: "Lease Period",
      placeholder: "Enter Lease Period in Months",
    },
    {
      type: "number",
      name: `tenants.${index}.securityDeposit`,
      control,
      label: "Security Deposit        ",
      placeholder: "Enter Security Deposit",
    },
    {
      type: "number",
      name: `tenants.${index}.interestOnSecurityDeposit`,
      control,
      label: "Interest Rate On Security Deposit",
      placeholder: "Enter Interest Rate",
    },
    {
      type: "select",
      name: `tenants.${index}.status`,
      control,
      label: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
      rules: {
        required: {
          value: true,
          message: "Status is required",
        },
      },
    },
    {
      type: "file",
      name: `tenants.${index}.agreement`,
      control,
      label: "Upload Agreement ",
      fullWidth: true,
      meta: {
        refId: id || '',
        belongsTo: 'asset',
        isPublic: true,
      },
    },
    {
      type: "image",
      name: `tenants.${index}.logo`,
      control,
      label: "Upload Logo",
      fullWidth: true,

    },
  ];
};

