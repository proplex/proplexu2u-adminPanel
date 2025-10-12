import FormGenerator from "@/components/UseForm/FormGenerator";
import { useFormContext } from "react-hook-form";
import { formConfig } from "./formConfig";
import SelectCompany from "./SelectCompany";
import NoCompanySelected from "./NoCompanySelected";
import DAOConfigurationDetails from "./DAOConfigurationDetails";

const Index = ({ asset }: { asset: any }) => {
  const { watch } = useFormContext();
  const company = watch("company");
  const { daoConfiguration: daoConfig } = company || {};
 console.log(company)
  return (
    <div>
      <SelectCompany />
      {FormGenerator(formConfig({asset}))}
      {!company ? (
        <NoCompanySelected />
      ) : (
        // <DAOConfigurationDetails daoConfig={daoConfig} />
        <>
          <div className="bg-gray-200 p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Company Name</p>
              <h2 className="text-xl font-semibold break-words">
                {company?.name || "N/A"}
              </h2>
            </div>
            <div>
              <p className="text-sm text-gray-600">Transaction Hash</p>
              <h2 className="text-sm md:text-base font-mono break-all">
                {company?.transactionHash ? (
                  <a
                    href={`https://testnet.u2uscan.xyz/tx/${company.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-600 hover:text-blue-800"
                  >
                    {company.transactionHash}
                  </a>
                ) : (
                  "N/A"
                )}
              </h2>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
