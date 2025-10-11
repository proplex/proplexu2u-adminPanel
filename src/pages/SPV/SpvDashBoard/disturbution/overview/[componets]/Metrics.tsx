import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  Settings,
} from "lucide-react";
import useRentalDistribution from "@/hooks/spv/useRentalDistrubution";
import { formatCurrency, formatCurrencyWithZero } from "@/lib/format.utility";
import { useNavigate, useLocation } from "react-router-dom";

export function Metrics() {
  const { distribution, loading, error } = useRentalDistribution();
  const navigate = useNavigate();
  const location = useLocation();
  const handleSwitchTab = (newTab: string) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("tab", newTab); // update tab
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };
  if (error) return <p className="text-red-500">{error}</p>;
  if (loading) return <p>Loading metrics...</p>;
  return (
    <div className="space-y-6">
      {/* Top metrics row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Available for Distribution
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    distribution?.asset?.rentalInformation?.netMonthlyRent ?? 0
                  )}
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-2">
                {/* <DollarSign className="h-5 w-5 text-green-600" /> */}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Next Distribution
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">
                    {/* ${distribution?.netIncome || 0 */}
                    {formatCurrency(
                      distribution?.asset?.rentalInformation?.netMonthlyRent ||
                        0
                    )}
                  </p>
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-700"
                  >
                    Monthly
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">In days</p>
              </div>
              <div className="rounded-lg bg-purple-50 p-2">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Active Investors
                </p>
                <p className="text-2xl font-bold">
                  {distribution?.investors?.length || 0}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total investment: Ksh{" "}
                  {distribution?.totalAmountInvested
                    ?.reduce((acc, curr) => acc + curr.totalAmountInvested, 0)
                    .toFixed(2)
                    .toLocaleString() || 0}
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 p-2">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Annual Yield
                </p>
                <p className="text-2xl font-bold">{0}%</p>
                <p className="text-sm text-muted-foreground">
                  Occupancy rate: {0}%
                </p>
              </div>
              <div className="rounded-lg bg-orange-50 p-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed sections grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Income Breakdown */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold">
              Income Breakdown
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Monthly income from Horizon Properties SPV assets
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    distribution?.asset?.rentalInformation?.grossMonthlyRent ??
                      0
                  )}
                </span>
              </div>
              <Badge
                variant="outline"
                className="text-green-600 border-green-200"
              >
                Monthly
              </Badge>
            </div>

            <div className="space-y-3">
              {distribution?.expenses?.map((expense, idx) => {
                const percentage =
                  (expense.amount /
                    (distribution?.asset?.rentalInformation?.grossMonthlyRent ||
                      1)) *
                  100;

                return (
                  <div
                    key={expense.code || idx}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 bg-gray-800 rounded"
                        style={{
                          width: `${Math.max(8, percentage)}px`,
                        }}
                      />
                      <span className="text-sm">
                        {expense.label} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <span className="text-sm text-red-600">
                      -{formatCurrency(expense.amount)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Net Income Section */}
            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Net Distributable Income</span>
                <span className="text-lg font-bold text-green-600">
                  {(() => {
                    const gross =
                      distribution?.asset?.rentalInformation
                        ?.grossMonthlyRent ?? 0;
                    const totalExpenses =
                      distribution?.expenses?.reduce(
                        (sum, e) => sum + (e.amount || 0),
                        0
                      ) ?? 0;
                    return formatCurrency(gross - totalExpenses);
                  })()}
                </span>
              </div>
            </div>

            <Button variant="outline" className="w-full bg-transparent">
              View Income Details
            </Button>
          </CardContent>
        </Card>

        {/* Next Distribution */}
        {/* <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold">
              Next Distribution
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Scheduled for June 30, 2023
            </p>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">June 30, 2023</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-0"
                  >
                    Quarterly
                  </Badge>
                </div>

                <div>
                  <p className="text-2xl font-bold">$11,125</p>
                  <p className="text-sm opacity-90">
                    Total distribution amount
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Days remaining</span>
                    <span>12 days</span>
                  </div>
                  <Progress value={75} className="bg-white/20" />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-200"
                >
                  Scheduled
                </Badge>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Recipients
                </span>
                <span className="text-sm font-medium">4 active investors</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Distribution method
                </span>
                <span className="text-sm font-medium">
                  Proportional to investment
                </span>
              </div>
            </div>

            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Configure Distribution
            </Button>
          </CardContent>
        </Card> */}

        {/* Recent Activity */}
        {/* <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Latest transactions and events for Horizon Properties SPV
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-50 p-2">
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">
                    Monthly rental income received
                  </p>
                  <p className="text-sm text-green-600 font-medium">$12,500</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  May 15, 2023
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-purple-50 p-2">
                  <DollarSign className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">
                    Q1 Distribution completed
                  </p>
                  <p className="text-sm text-purple-600 font-medium">$10,250</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  March 31, 2023
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-50 p-2">
                  <UserPlus className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">
                    New investor added: Tech Ventures
                  </p>
                  <p className="text-sm text-blue-600 font-medium">+$375,000</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  March 15, 2023
                </span>
              </div>
            </div>

            <Button variant="outline" className="w-full bg-transparent">
              View All Activity
            </Button>
          </CardContent>
        </Card> */}

        {/* Top Investors */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold">
              Top Investors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              By investment amount in Horizon Properties SPV
            </p>

            <div className="space-y-4">
              {distribution?.allocations.map((investor, idx) => {
                const initials = investor?.investors?.fullName
                  ? investor?.investors?.fullName?.split(" ").map((n) => n[0])
                  : "";
                return (
                  <div
                    key={investor.investors?.investorId + idx}
                    className="flex items-center gap-3"
                  >
                    <Avatar className="h-10 w-10">
                      {investor.investors?.avatar ? (
                        <img
                          src={investor.investors?.avatar}
                          alt={investor.investors?.fullName || "Investor"}
                        />
                      ) : (
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-xs">
                          {initials}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {investor.investors?.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {investor.tokens} shares ({investor.ownershipPercentage}
                        %)
                      </p>
                    </div>
                    <span className="text-sm font-bold">
                      {formatCurrencyWithZero(investor.investedAmount)}
                    </span>
                  </div>
                );
              })}
            </div>

            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => handleSwitchTab("investors")}
            >
              View All Investors
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
