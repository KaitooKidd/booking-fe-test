'use client';

import { z } from 'zod';
import { CustomerDataTable } from '~/components/layouts/tables/customers/DataTable';
import { customerColumns } from '~/components/layouts/tables/customers/columns';
import { customerInfo } from '~/components/layouts/tables/customers/data';
import { customerInfoSchema } from '~/components/layouts/tables/customers/schema';
import useCustomers from '~/hooks/useCustomers';

interface CustomersPageProps {}

function getData() {
  const data = customerInfo;
  return z.array(customerInfoSchema).parse(data);
}

export default function CustomersPage({}: CustomersPageProps) {
  // const data = getData();

  const users = useCustomers();
  if (users.isLoading) return <div>Loading...</div>;
  if (users.error) return <div>Error!</div>;

  return <CustomerDataTable data={users.data ?? []} columns={customerColumns as any} />;
}
