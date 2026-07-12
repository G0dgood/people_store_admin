"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import { StatCard } from "../../components/Admin/StatCard";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Pagination } from "../../components/Admin/Pagination";
import { TransactionDetailDrawer } from "../../components/Admin/TransactionDetailDrawer";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Checkbox from "@/app/components/Checkbox";
import { HiOutlineDocumentText } from "react-icons/hi2";

import { useGetTransactionsQuery, useGetTransactionStatsQuery } from "@/lib/redux/services/transactionApi";
import { NoRecordFound, SVGLoaderFetch } from "../../components/Options";
import { Tooltip } from "@/app/components/Tooltip";
import { HiArrowPath } from "react-icons/hi2";
import { StatCardSkeleton } from "../../components/Skeleton/StatCardSkeleton";

const statusStyles = {
	Success: { color: "text-emerald-500", bg: "bg-emerald-500" },
	Failed: { color: "text-rose-500", bg: "bg-rose-500" },
	Pending: { color: "text-orange-400", bg: "bg-orange-400" },
	Reversed: { color: "text-brand-gold", bg: "bg-brand-gold" },
};

export default function TransactionsPage() {
	const [activeTab, setActiveTab] = useState("All transactions");
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
	const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

	const { data: transactionsResponse, isLoading, refetch, isFetching } = useGetTransactionsQuery({
		status: activeTab === "All transactions" ? undefined : activeTab,
		page: currentPage,
		limit: rowsPerPage
	});

	const { data: statsResponse, isLoading: isLoadingStats } = useGetTransactionStatsQuery();

	const transactionsData = transactionsResponse?.data.transactions || [];
	const stats = statsResponse?.data;
	const pagination = transactionsResponse?.data.pagination;

	const toggleAll = () => {
		if (selectedIds.length === transactionsData.length && transactionsData.length > 0) {
			setSelectedIds([]);
		} else {
			setSelectedIds(transactionsData.map(t => t._id));
		}
	};

	const toggleItem = (id: string) => {
		setSelectedIds(prev =>
			prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
		);
	};

	return (
		<div className="flex flex-col gap-6">

			{/* Top Grid: Stats & Payment Method */}
			<div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
				{/* Stats Section (Left 2 columns in a 2x2 grid) */}
				<div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
					{isLoadingStats ? (
						<>
							<StatCardSkeleton />
							<StatCardSkeleton />
							<StatCardSkeleton />
							<StatCardSkeleton />
						</>
					) : (
						<>
							<StatCard
								title="Total Revenue"
								value={`₦${stats?.totalRevenue?.toLocaleString() || '0'}`}
								trendValue="14.4%"
								trendIsUp={true}
								periodLabel="Last 7 days"
							/>
							<StatCard
								title="Completed Transactions"
								value={stats?.successCount?.toString() || '0'}
								trendValue="20%"
								trendIsUp={true}
								periodLabel="Last 7 days"
							/>
							<StatCard
								title="Pending Transactions"
								value={stats?.pendingCount?.toString() || '0'}
								trendValue="85%"
								trendIsUp={true}
								periodLabel="Last 7 days"
							/>
							<StatCard
								title="Failed Transactions"
								value={stats?.failedCount?.toString() || '0'}
								trendValue="15%"
								trendIsUp={false}
								periodLabel="Last 7 days"
							/>
						</>
					)}
				</div>

				{/* Payment Method Card (Right 2 columns) */}
				<div className="xl:col-span-2 bg-white rounded-[6px] border border-[#1C1C1C1A] overflow-hidden flex flex-col p-6 gap-6">
					<div className="flex justify-between items-center">
						<h3 className="text-sm font-bold text-brand-charcoal">Payment Gateway</h3>
						<Button shape="rounded-sm" 
							variant="ghost"
							className="text-gray-300 hover:text-gray-600 !p-1"
						>
							<Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
						</Button>
					</div>

					<div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
						{/* Visual Card */}
						<div className="relative w-full max-w-[320px] h-[180px] rounded-[16px] overflow-hidden shadow-xl shadow-brand-gold/10 group">
							<div className="absolute inset-0 bg-gradient-to-br from-brand-gold via-brand-gold-light to-[#A6891F]"></div>
							{/* Pattern overlay */}
							<div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('/dashboardImage/image 270.png')] bg-cover"></div>

							<div className="relative h-full p-6 flex flex-col justify-between text-white">
								<div className="flex justify-between items-start">
									<span className="text-xl font-black italic tracking-tighter">Bloom & Mist</span>
									<div className="flex gap-1 items-center">
										<div className="w-8 h-8 rounded-full bg-white/20"></div>
										<div className="w-8 h-8 rounded-full bg-white/40 -ml-4"></div>
									</div>
								</div>

								<div className="flex flex-col gap-1">
									<p className="text-xs font-medium opacity-80">Primary Gateway</p>
									<p className="text-sm font-bold tracking-widest uppercase text-white">Paystack</p>
								</div>

								<div className="flex justify-between items-end">
									<div className="flex flex-col gap-1">
										<p className="text-lg font-bold tracking-[0.2em]">CONNECTED</p>
									</div>
									<div className="text-right">
										<p className="text-[10px] opacity-80">Status</p>
										<p className="text-xs font-bold">Active</p>
									</div>
								</div>
							</div>
						</div>

						{/* Metadata Info */}
						<div className="flex-1 flex flex-col gap-4 w-full">
							<div className="flex flex-col gap-3">
								<div className="flex justify-between items-center">
									<span className="text-xs font-bold text-gray-400">Total Count:</span>
									{isLoadingStats ? (
										<div className="h-3 w-12 bg-gray-100 rounded animate-pulse"></div>
									) : (
										<span className="text-xs font-bold text-brand-charcoal">{stats?.transactionCount || 0}</span>
									)}
								</div>
								<div className="flex justify-between items-center">
									<span className="text-xs font-bold text-gray-400">Success Rate:</span>
									{isLoadingStats ? (
										<div className="h-3 w-10 bg-gray-100 rounded animate-pulse"></div>
									) : (
										<span className="text-xs font-bold text-brand-gold">
											{stats?.transactionCount ? Math.round((stats.successCount / stats.transactionCount) * 100) : 0}%
										</span>
									)}
								</div>
								<div className="flex justify-between items-center">
									<span className="text-xs font-bold text-gray-400">Revenue:</span>
									{isLoadingStats ? (
										<div className="h-3 w-16 bg-gray-100 rounded animate-pulse"></div>
									) : (
										<span className="text-xs font-bold text-brand-charcoal">₦{stats?.totalRevenue?.toLocaleString() || 0}</span>
									)}
								</div>
							</div>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4 border-t border-gray-50">
						<Button shape="rounded-sm" variant="secondary"
							className="flex-1 h-12 border-dashed border-gray-200 text-gray-400 hover:text-brand-gold hover:border-brand-gold transition-all"
							iconLeft={<Icon name="circle-plus" folder="dashboardIcon" size="sm" />}
						>
							Manage Gateways
						</Button>
					</div>
				</div>
			</div>

			{/* Transaction History Card */}
			<div className="bg-white rounded-[6px] overflow-hidden flex flex-col border border-[#1C1C1C1A] rounded-[6px] ">
				{/* Controls Bar */}
				<div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
					<TabFilter
						tabs={["All transactions", "Success", "Pending", "Failed"]}
						activeTab={activeTab}
						onChange={setActiveTab} id={""} />

					<div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
						<Tooltip text="Refresh Transaction List">
							<Button shape="rounded-sm" variant="outline"
								className="border-gray-200 text-gray-500 group h-[38px]"
								iconLeft={<HiArrowPath size={16} className={`${isFetching ? 'animate-spin text-brand-gold' : 'text-gray-400 group-hover:text-white'} transition-colors`} />}
								onClick={() => refetch()}
								disabled={isLoading || isFetching}
							>
								{isFetching ? "Refreshing..." : "Refresh"}
							</Button>
						</Tooltip>
						<Input shape="rounded-sm" type="text"
							placeholder="Search payment history"
							containerClassName="w-full lg:w-80 xl:w-96"
							className="bg-white border-gray-200 placeholder:text-gray-400 text-xs font-medium"
							suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
						/>

						<div className="flex items-center gap-3 w-full sm:w-auto">
							<RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />
						</div>
					</div>
				</div>

				{/* Table */}
				<div className="admin-table-container ">
					<table>
						<thead>
							<tr>
								<th className="w-10 pl-8">
									<Checkbox
										checked={selectedIds.length === transactionsData.length && transactionsData.length > 0}
										onChange={toggleAll}
									/>
								</th>
								<th>Transaction Id</th>
								<th>Customer</th>
								<th className="text-center">Date</th>
								<th>Total</th>
								<th className="text-center">Method</th>
								<th>Status</th>
								<th className="text-right">Action</th>
							</tr>
						</thead>
						<tbody>
							{isLoading ? (
								<SVGLoaderFetch colSpan={8} text={"Fetching Transactions..."} />
							) : transactionsData.length === 0 ? (
								<NoRecordFound colSpan={8} text="No transactions found." />
							) : transactionsData.map((tx, idx) => (
								<tr key={idx} className="group">
									<td className="w-10 pl-8">
										<Checkbox
											checked={selectedIds.includes(tx._id)}
											onChange={() => toggleItem(tx._id)}
										/>
									</td>
									<td>
										<span className="text-xs font-bold text-gray-900">{tx.transactionId}</span>
									</td>
									<td className="text-xs font-bold text-gray-700">{tx.customer?.fullName || "Guest"}</td>
									<td className="text-xs font-bold text-gray-400 text-center">
										{new Date(tx.createdAt).toLocaleDateString()}
									</td>
									<td className="text-xs font-bold text-gray-900">₦{tx.amount.toLocaleString()}</td>
									<td className="text-xs font-bold text-gray-700 text-center">{tx.paymentMethod}</td>
									<td>
										<div className="flex items-center gap-2">
											<span className={`w-1.5 h-1.5 rounded-full ${statusStyles[tx.status as keyof typeof statusStyles]?.bg || "bg-gray-400"}`}></span>
											<span className={`text-xs font-bold ${statusStyles[tx.status as keyof typeof statusStyles]?.color || "text-gray-400"}`}>{tx.status}</span>
										</div>
									</td>
									<td className="text-right">
										<div className="flex justify-end gap-2 pr-4">
											<Tooltip text="View Receipt & Details">
												<Button shape="rounded-sm" variant="outline"
													className="!p-1.5 text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold transition-all"
													onClick={() => {
														setSelectedTransaction(tx);
														setIsDetailDrawerOpen(true);
													}}
												>
													<HiOutlineDocumentText size={14} />
												</Button>
											</Tooltip>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Pagination Footer */}
				<Pagination
					currentPage={currentPage}
					totalPages={pagination?.totalPages || 1}
					onPageChange={setCurrentPage}
				/>
			</div>

			<TransactionDetailDrawer
				isOpen={isDetailDrawerOpen}
				onClose={() => setIsDetailDrawerOpen(false)}
				transaction={selectedTransaction}
			/>
		</div>
	);
}
