import { useGetTransactionsQuery } from "@/lib/redux/services/transactionApi";
import { SVGLoaderFetch, NoRecordFound } from "../Options";
import { TransactionDetailDrawer } from "./TransactionDetailDrawer";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { useState } from "react";
import { useRouter } from "next/navigation";

const statusStyles = {
  Success: { color: "text-emerald-500", bg: "bg-emerald-500" },
  Failed: { color: "text-rose-500", bg: "bg-rose-500" },
  Pending: { color: "text-orange-400", bg: "bg-orange-400" },
  Reversed: { color: "text-brand-gold", bg: "bg-brand-gold" },
};

export function TransactionTable() {
  const router = useRouter();
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const { data: response, isLoading } = useGetTransactionsQuery({ limit: 5 });
  const transactions = response?.data.transactions || [];

  return (
    <div className="bg-white p-8 rounded-[6px] border border-gray-200   flex flex-col gap-6">
      <TransactionDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        transaction={selectedTransaction}
      />
      <div className="flex justify-between items-center">
        <h3 className="text-[18px] font-black text-brand-charcoal">Recent Transactions</h3>
        <Button
          shape="rounded-sm"
          iconRight={<Icon name="sort" folder="dashboardIcon" size="sm" />}
          className="bg-brand-charcoal hover:bg-black text-white text-[11px] font-black px-6 h-9 rounded-[6px]  "
        >
          Filter
        </Button>
      </div>

      <div className="admin-table-container">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Transaction Id</th>
              <th>Order Date</th>
              <th className="pl-4">Status</th>
              <th>Amount</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <SVGLoaderFetch colSpan={6} text="Fetching..." />
            ) : transactions.length === 0 ? (
              <NoRecordFound colSpan={6} text="No transactions." />
            ) : transactions.map((tx, i) => (
              <tr key={i} className="group border-b border-gray-200 last:border-0">
                <td className="text-[13px] font-black text-brand-charcoal">{i + 1}.</td>
                <td className="text-[13px] font-black text-brand-charcoal">{tx.transactionId}</td>
                <td className="text-[11px] font-bold text-gray-600">{new Date(tx.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${statusStyles[tx.status as keyof typeof statusStyles]?.bg || "bg-gray-400"}`}></span>
                    <span className="text-[12px] font-bold text-brand-charcoal">{tx.status}</span>
                  </div>
                </td>
                <td className="text-[13px] font-black text-brand-charcoal">₦{tx.amount.toLocaleString()}</td>
                <td className="text-right">
                  <button
                    className="p-1 px-2 text-[10px] font-black text-brand-charcoal uppercase hover:bg-gray-100 rounded-[4px] transition-all"
                    onClick={() => {
                      setSelectedTransaction(tx);
                      setIsDetailDrawerOpen(true);
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          shape="rounded-sm"
          variant="ghost"
          className="border border-brand-charcoal/20 text-brand-charcoal text-[10px] font-black uppercase tracking-widest px-8 h-10 rounded-[6px] hover:bg-brand-charcoal/5"
          onClick={() => router.push("/transactions")}
        >
          View All Transactions
        </Button>
      </div>
    </div>
  );
}
