import VoucherForm from '@/components/admin/VoucherForm'
import React from 'react'
const Page = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Add New Voucher</h1>
          <p className="text-slate-600">Create a new voucher for your store</p>
        </div>
      </div>
      <VoucherForm />
    </div>
  )
}

export default Page