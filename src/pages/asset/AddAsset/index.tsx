import { lazy, Suspense, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import StepIndicator from "../../../components/common/StepIndicator";
import { useParams } from "react-router";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/Loading";
import { ASSET_STEPS_TABS } from "@/constants/global";
import queryString from "query-string";
const AssetInformation = lazy(() => import("./AssetInformation"));
import AssetStages from "@/components/cards/asset/AssetStages";
import { useAssetApi } from "@/hooks/asset/useAssetApi";
import { removeKeyFromObject } from "@/helpers/global";
import { ArrowLeft, ArrowRight, SaveIcon } from "lucide-react";
const AdditionalDetails = lazy(() => import("./AdditionalDetails"));
const IssueDue = lazy(() => import("./IssueDue"));
const TermsAndConditions = lazy(() => import("./TermsAndConditions"));
const FeaturesAndAmenities = lazy(() => import("./FeaturesAndAmenities"));
const LocationPlaces = lazy(() => import("./LocationPlaces"));
const TokenInformation = lazy(() => import("./TokenInformation"));
const MediaAndDocuments = lazy(() => import("./MediaAndDocuments"));

function Index() {
  const { id = null } = useParams();
  const {
    createAsset,
    status,
    asset = {},
    getAsset,
    updateAsset,
    isPending,
  } = useAssetApi();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchAsset = async () => {
      if (id) {
        await getAsset(id);
      }
    };
    fetchAsset();
  }, [id]);

  // const queryParams = queryString.parse(location.search);
  const methods = useForm({
    defaultValues: {
      class: "real-estate",
      category: "commercial",
      stage: "under-construction",
      currency: "kes",
      country: "KE",
    },
    values: removeKeyFromObject(asset, [
      "createdAt",
      "updatedAt",
      "__v",
      "status",
      "bookmarks",
    ]),
  });

  const {
    getValues,
    trigger,
    setValue,
    watch,
    formState: { isDirty },
  } = methods;

  const disabledSteps = !id
    ? ASSET_STEPS_TABS.slice(1).map((step) => step.id)
    : [];
  const formData = watch();

  const { step, tab } = useMemo(() => {
    const queryParams = queryString.parse(location.search);
    return {
      step: queryParams["step"] || "asset-information",
      tab: Array.isArray(queryParams["tab"])
        ? queryParams["tab"][0] || "asset-type"
        : queryParams["tab"] || "asset-type",
    };
  }, [location.search]);

  const renderStepContent = useMemo(() => {
    switch (step) {
      case "asset-information":
        return (
          <Suspense fallback={<Loading />}>
            <AssetInformation step={step} tab={tab} asset={asset} />
          </Suspense>
        );
      case "additional-details":
        return (
          <Suspense fallback={<Loading />}>
            <AdditionalDetails step={step} tab={tab} />
          </Suspense>
        );
      case "issues-due-diligence":
        return (
          <Suspense fallback={<Loading />}>
            <IssueDue step={step} tab={tab} />
          </Suspense>
        );
      case "tandc-faq":
        return (
          <Suspense fallback={<Loading />}>
            <TermsAndConditions tab={tab} />
          </Suspense>
        );
      case "features-amenities":
        return (
          <Suspense fallback={<Loading />}>
            <FeaturesAndAmenities step={step} tab={tab} />
          </Suspense>
        );
      case "token-information":
        return (
          <Suspense fallback={<Loading />}>
            <TokenInformation step={step} tab={tab} asset={asset} />
          </Suspense>
        );
      case "media-documents":
        return (
          <Suspense fallback={<Loading />}>
            <MediaAndDocuments step={step} tab={tab} />
          </Suspense>
        );
      case "location-places":
        return (
          <Suspense fallback={<Loading />}>
            <LocationPlaces step={step} tab={tab} />
          </Suspense>
        );
      default:
        return <div />;
    }
  }, [step, tab, asset]);

  const nextStep = () => {
    const currentIndex = ASSET_STEPS_TABS.findIndex((ele) => ele.id === step);

    if (currentIndex !== -1) {
      const nextStep = ASSET_STEPS_TABS[currentIndex + 1];
      if (!nextStep) return;
      const params = new URLSearchParams({ step: nextStep.id });
      navigate(`/edit-asset/${id}?${params.toString()}`);
    }
  };
  const nextTab = () => {
    const currentStepIndex = ASSET_STEPS_TABS.findIndex(
      (stepItem) => stepItem.id === step
    );
    if (currentStepIndex === -1) return;

    const currentStepObj = ASSET_STEPS_TABS[currentStepIndex];
    const tabs = currentStepObj.tabs || [];

    if (tabs.length > 0) {
      const currentTabIndex = tabs.findIndex((tabItem) => tabItem.id === tab);

      if (currentTabIndex !== -1 && currentTabIndex < tabs.length - 1) {
        const nextTabId = tabs[currentTabIndex + 1].id;
        const params = new URLSearchParams({
          step: currentStepObj.id,
          tab: nextTabId,
        });
        navigate(`/edit-asset/${id}?${params.toString()}`);
        return;
      }
    }

    const nextStepObj = ASSET_STEPS_TABS[currentStepIndex + 1];
    if (!nextStepObj) return;

    const params = new URLSearchParams({ step: nextStepObj.id });
    if (nextStepObj.tabs?.[0]?.id) {
      params.set("tab", nextStepObj.tabs[0].id);
    }
    navigate(`/edit-asset/${id}?${params.toString()}`);
  };

  const previousStep = () => {
    const currentIndex = ASSET_STEPS_TABS.findIndex((tab) => tab.id === step);

    if (currentIndex > 0) {
      const prevTab = ASSET_STEPS_TABS[currentIndex - 1];
      const prevTabId = prevTab.id;
      const firstSectionId = prevTab.tabs?.[0]?.id;

      const params = new URLSearchParams({ step: prevTabId });
      if (firstSectionId) params.append("tab", firstSectionId);

      navigate(`/edit-asset/${id}?${params.toString()}`);
    }
  };

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    const { nearByLocations, ...rest } = data;
    const payload = {
      country: "KE",
      ...rest,
    };
    if (id) {
      await updateAsset(id, payload).then((res) => {
        if (res) {
          setValue("nearByLocations", res.nearByLocations);
        }
      });
    } else {
      await createAsset(payload);
    }
  };

  const handleSubmitNext = async () => {
    const data = getValues();
    const isValid = await trigger();
    if (isValid) {
      const { nearByLocations, ...rest } = data;
      const payload = {
        country: "KE",
        ...rest,
      };
      if (id) {
        await updateAsset(id, payload).then((res) => {
          if (res) {
            setValue("nearByLocations", res.nearByLocations);
          }
        });
        nextTab();
      } else {
        await createAsset(payload);
      }
    }
  };

  const changeStep = (step: string) => {
    const currentIndex = ASSET_STEPS_TABS.findIndex((ele) => ele.id === step);
    const nextStep = ASSET_STEPS_TABS[currentIndex];
    const params = new URLSearchParams({ step: nextStep.id });
    if (nextStep.tabs?.[0]?.id) params.append("tab", nextStep.tabs?.[0]?.id);
    navigate(`/${id ? `edit-asset/${id}` : "add-asset"}?${params.toString()}`);
  };

  return (
    <div className="p-2 flex gap-2">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-8">
          {id ? "Update" : "Create"} Asset
        </h1>
        <StepIndicator
          steps={ASSET_STEPS_TABS}
          currentStep={step as string}
          changeStep={changeStep}
          disabledSteps={disabledSteps}
        />
      </div>
      <FormProvider {...methods}>
        <form
          className="bg-white rounded-lg shadow p-2 w-full"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          {renderStepContent}
          <div className="py-4 flex justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={step === "project-details"}
              onClick={previousStep}
              className={`${
                step === "project-details"
                  ? "cursor-not-allowed"
                  : "cursor-pointer bg-transparent-400 hover:bg-transparency-500"
              }`}
            >
              <ArrowLeft className="mr-2" />
              Back
            </Button>
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isPending || status === "loading"}
                className="w-36 cursor-pointer"
                onClick={handleSubmitNext}
              >
                <SaveIcon className="mr-2" />
                Save Changes
              </Button>

              <Button
                type="button"
                onClick={nextTab}
                disabled={isPending || status === "loading"}
                className="w-32 cursor-pointer"
              >
                <ArrowRight />
                Next
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
      <div>
    <AssetStages
          currentStep={step as string}
          asset={asset}
          formData={formData}
        />      </div>
    </div>
  );
}
export default Index;
