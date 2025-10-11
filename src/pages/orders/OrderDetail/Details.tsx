
import React from "react";
import {
  Building,
  Calendar,
  DollarSign,
  Link,
  Percent,
  PiggyBank,
  CheckCircle2,
  Clock,
  XCircle,
  User,
  ArrowRightCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import queryString from "query-string";
import CustomTabs from "@/components/ui/custom-tab";
import { useNavigate, useParams } from "react-router-dom";
import Overview from "./Overview";
import Documents from "./Documents";
import { format } from "date-fns";
import { CURRENCY_OPTIONS, ORDER_TRACKING_STATUS } from "@/constants/global";
import { formatCompactNumber } from "@/helpers/global";

type OrderType = any;

function formatCurrency(amount: number | null | undefined, currencyCode?: string) {
  const code = (currencyCode || "KES").toUpperCase();
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
      maximumFractionDigits: 3,
    }).format(amount ?? 0);
  } catch {
    // fallback if currency isn't a valid ISO code
    return `${code} ${Number(amount ?? 0).toLocaleString()}`;
  }
}

function StatusBadge({ status }: { status?: string }) {
  const normalized = String(status || "").toLowerCase();
  const mapping: Record<string, { bg: string; text: string; icon: React.ReactNode; pulse?: boolean }> = {
    "fully-paid": { bg: "bg-green-50", text: "text-green-700", icon: <CheckCircle2 className="w-4 h-4" /> },
    "paid": { bg: "bg-green-50", text: "text-green-700", icon: <CheckCircle2 className="w-4 h-4" /> },
    pending: { bg: "bg-yellow-50", text: "text-yellow-700", icon: <Clock className="w-4 h-4" />, pulse: true },
    failed: { bg: "bg-red-50", text: "text-red-700", icon: <XCircle className="w-4 h-4" /> },
    default: { bg: "bg-gray-100", text: "text-gray-700", icon: <Clock className="w-4 h-4" /> },
  };

  const style = mapping[normalized] || mapping.default;
  // label: try ORDER_TRACKING_STATUS lookup
  const label =
    ORDER_TRACKING_STATUS?.find?.((s: any) => String(s.value) === status)?.label ||
    // nicely prettify
    normalized.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ||
    "Unknown";

  return (
    <span
      className={`${style.bg} ${style.text} inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium`}
      aria-label={`Order status ${label}`}
    >
      <span className={`${style.pulse ? "animate-pulse" : ""}`}>{style.icon}</span>
      <span>{label}</span>
    </span>
  );
}

function InfoRow({ icon, label, value, divider = true }: { icon?: React.ReactNode; label: string; value: React.ReactNode; divider?: boolean }) {
  return (
    <div className={`flex items-center justify-between p-5 ${divider ? "border-b" : ""}`}>
      <div className="flex items-center gap-3">
        <div className="text-gray-400">{icon}</div>
        <span className="text-gray-600">{label}</span>
      </div>
      <div className="font-semibold text-gray-900">{value}</div>
    </div>
  );
}

export function Details({ order: maybeWrappedOrder }: { order: OrderType }) {
  // support both API response wrapper { data: {...} } and direct order object
  const order = maybeWrappedOrder?.data ? maybeWrappedOrder.data : maybeWrappedOrder || {};
  const {
    tokensBooked,
    ownershipPercentage,
    totalOrderValue,
    totalFeePaid,
    breakup = [],
    currentStatus,
    asset = {},
    investor = {},
    company = {},
    tracking = [],
    createdAt,
  } = order || {};

  const { id = null } = useParams();
  const queryParams = queryString.parse(location.search);
  const navigate = useNavigate();

  const formattedCreated = createdAt ? format(new Date(createdAt), "yyyy-MM-dd HH:mm") : format(new Date(), "yyyy-MM-dd HH:mm");

  const currencyCode = (company?.currency || "KES").toUpperCase();

  const tabs = [
    { id: "overview", title: "Overview", component: <Overview order={order} /> },
    // { id: "documents", title: "Documents", component: <Documents order={order} /> },
    { id: "transaction-history", title: "Transaction History", component: <div className="p-5">Transaction History Content</div> },
  ];

  const tab: string = Array.isArray(queryParams["tab"]) ? (queryParams["tab"][0] as string) || "overview" : (queryParams["tab"] as string) || "overview";
  const handleTabChange = (tabId: string) => navigate(`/order-details/${id}?tab=${tabId}`, { replace: true });

  // tracking progress
  const totalSteps = tracking.length || 1;

  const assetTokenInfo = asset?.tokenInformation || null;
  const netAmount = (Number(totalOrderValue || 0) - Number(totalFeePaid || 0));

  return (
    <div className="space-y-6">
      {/* top grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Order amount */}
        <Card className="border-0 shadow-sm rounded-xl">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order amount</p>
              <h3 className="text-2xl font-semibold">
                {formatCompactNumber(totalOrderValue)}
              </h3>
              <p className="text-xs text-gray-400 mt-1">{formatCurrency(totalOrderValue, currencyCode)} total</p>
            </div>
            <div className="bg-amber-50 w-12 h-12 flex items-center justify-center rounded-full">
              <PiggyBank className="text-amber-600 w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Date & Time */}
        <Card className="border-0 shadow-sm rounded-xl">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Date & Time</p>
              <h3 className="text-lg font-medium">{formattedCreated}</h3>
              <p className="text-xs text-gray-400 mt-1">Order created</p>
            </div>
            <div className="bg-amber-50 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        {/* Status + progress */}
        <Card className="border-0 shadow-sm rounded-xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-500">Order Status</p>
                <div className="mt-2">
                  <StatusBadge status={currentStatus} />
                </div>
              </div>
     
            </div>


          </CardContent>
        </Card>
      </div>

      {/* main info + right column elements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* left: big details */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm rounded-xl">
            <CardContent className="p-0">
              <InfoRow icon={<DollarSign className="h-5 w-5 text-gray-400" />} label="Order Value" value={formatCurrency(totalOrderValue, currencyCode)} />
              <InfoRow icon={<Building className="h-5 w-5 text-gray-400" />} label="Property Name" value={asset?.name || "-"} />
              <InfoRow icon={<Percent className="h-5 w-5 text-gray-400" />} label="Ownership Percentage" value={ownershipPercentage ? `${ownershipPercentage}%` : "-"} />
              <InfoRow icon={<Link className="h-5 w-5 text-gray-400" />} label="No of Tokens" value={tokensBooked ?? "-"} divider={false} />
            </CardContent>
          </Card>

          {/* Tracking timeline */}
        
        </div>

        {/* right column cards */}
        <div className="space-y-4">
          {/* Investor */}
          <Card className="border-0 shadow-sm rounded-xl">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {investor?.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={investor.avatar} alt={investor.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{investor?.fullName || "-"}</div>
                  <div className="text-sm text-gray-500">{investor?.email || "-"}</div>
                  <div className="text-sm text-gray-500">{investor?.mobileNumber || "-"}</div>
                </div>
              </div>

              <div className="mt-4">
                <a href={`mailto:${investor?.email}`} className="inline-flex items-center gap-2 text-sm text-amber-600 font-medium">
                  Contact investor <ArrowRightCircle className="w-4 h-4" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Fee breakup */}
          <Card className="border-0 shadow-sm rounded-xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Fee Breakup</h4>
                <div className="text-xs text-gray-400">Total fees {formatCurrency(totalFeePaid, currencyCode)}</div>
              </div>

              <ul className="divide-y">
                {breakup.map((b: any) => (
                  <li key={b._id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-800">{b.name}</div>
                      <div className="text-xs text-gray-400">{b.isPercentage ? `${b.percentage}%` : ""}</div>
                    </div>
                    <div className="text-sm font-medium">{formatCurrency(b.value, currencyCode)}</div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 border-t pt-3 text-sm">
                <div className="flex justify-between">
                  <div className="text-gray-500">Net Amount</div>
                  <div className="font-semibold">{formatCurrency(netAmount, currencyCode)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Token Info */}
          {assetTokenInfo && (
            <Card className="border-0 shadow-sm rounded-xl">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-600">Token Info</div>
                  <div className="text-xs text-gray-400">Live</div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-900">Price</div>
                    <div className="text-xs text-gray-500">{formatCurrency(assetTokenInfo.tokenPrice, currencyCode)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-900">Available</div>
                    <div className="text-xs text-gray-500">{assetTokenInfo.availableTokensToBuy ?? "-"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Tabs */}
      <CustomTabs defaultTab={tab} tabs={tabs} handleTabChange={handleTabChange} aria-label="Order Details" />
    </div>
  );
}

export default Details;
