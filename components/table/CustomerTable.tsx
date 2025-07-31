import React from "react";
import { Customer } from "@/actions/customer_info";
import { CustomerTableHeader, CustomerTableRow } from "./";
import { UsePaginationReturn } from "@/hooks/usePagination";

interface CustomerTableProps {
  customers: Customer[];
  pagination: UsePaginationReturn;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customer: Customer) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  pagination,
  onEditCustomer,
  onDeleteCustomer,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <CustomerTableHeader pagination={pagination} />
        <tbody className="bg-white divide-y divide-gray-200">
          {customers.map((customer: Customer, index: number) => (
            <CustomerTableRow
              key={customer.id}
              customer={customer}
              index={index}
              onEdit={onEditCustomer}
              onDelete={onDeleteCustomer}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
