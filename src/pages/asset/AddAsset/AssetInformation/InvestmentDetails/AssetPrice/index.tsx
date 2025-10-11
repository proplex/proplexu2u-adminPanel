import FormGenerator from "@/components/UseForm/FormGenerator";
import { feeFormConfig, formConfig } from "./formConfig";
import { useFormContext } from "react-hook-form";
import InfoTag from "@/components/cards/asset/InfoTag";
import Registration from "./Registration";
import Legal from "./Legal";
import Brokerage from "./Brokerage";
import Platfrom from "./Platform";
import { CURRENCY_OPTIONS } from "@/constants/global";
import Reserve from "./Reserve";

const index = () => {
  const { watch } = useFormContext();
  const currnecy = watch("currency");
  const numberOfSfts = watch("totalNumberOfSfts");
  const perSQFT = watch("pricePerSft");

  const registrationFees = watch("fees.registration");
  const legalFees = watch("fees.legal");
  const brokerageFees = watch("fees.brokerage");
  const platformFees = watch("fees.platform");
  const reserveFees = watch("fees.reserves");

  const basePropertyValue = Number(numberOfSfts) * Number(perSQFT);

  // generic reducer
  const calcFees = (fees: any[] = []) =>
    fees.reduce((acc: number, fee: any) => {
      if (!fee.status) return acc;
      if (fee.isPercentage) {
        return acc + (basePropertyValue * fee.value) / 100;
      }
      return acc + fee.value;
    }, 0);

  const registrationFeesValue = calcFees(registrationFees);
  const legalFeesValue = calcFees(legalFees);
  const brokerageFeesValue = calcFees(brokerageFees);
  const platformFeesValue = calcFees(platformFees);
  const reserveFeesValue = calcFees(reserveFees);

  const totalFees =
    registrationFeesValue +
    legalFeesValue +
    brokerageFeesValue +
    platformFeesValue +
    reserveFeesValue;

  const totalPropertyValue = basePropertyValue + totalFees;

  // console.log("totalPropertyValue", totalPropertyValue);
  // console.log("basePropertyValue", basePropertyValue);
  // console.log("totalFees", totalFees);
  // console.log("reserve fee", reserveFees);
  // console.log("registrationFeesValue", registrationFeesValue);
  // console.log("legalFeesValue", legalFeesValue);
  // console.log("brokerageFeesValue", brokerageFeesValue);
  // console.log("platformFeesValue", platformFeesValue);

  const currencySymbol =
    currnecy === "kes"
      ? CURRENCY_OPTIONS.find((option) => option.value === "kes")?.label
      : CURRENCY_OPTIONS.find((option) => option.value === "usd")?.label;

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Asset Price</h1>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {FormGenerator(feeFormConfig())}
      </div>

      <InfoTag
        info="Base Property Value"
        amount={`${currencySymbol} ${basePropertyValue || 0}`}
        icon={<div />}
      />

      <div className="my-4">
        <Reserve />
        <Registration />
        <Legal />
        <Brokerage />
        <Platfrom />
      </div>

      <InfoTag
        info="Gross Total Property Value"
        amount={`${currencySymbol} ${totalPropertyValue}`}
        icon={<div />}
      />
    </div>
  );
};

export default index;
