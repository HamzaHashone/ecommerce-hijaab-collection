"use client";

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Package, DollarSign, Save, Loader, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useGetSettings, useUpdateSettings, useCreateSettings } from '@/lib/hooks/api'

interface Settings {
  _id: string
  quantityForLowStock: number
  highValueUserSpents: number
}

const AdminSettingsPage = () => {
  const [formData, setFormData] = useState({
    quantityForLowStock: 0,
    highValueUserSpents: 0
  })

  // TanStack Query hooks
  const { data: settingsData, isLoading, refetch } = useGetSettings()
  const { mutate: createSettings, isPending: isCreating } = useCreateSettings()
  const { mutate: updateSettings, isPending: isUpdating } = useUpdateSettings()

  const settings = settingsData?.settings?.[0] || null
  const isSaving = isCreating || isUpdating

  // Update form data when settings are loaded
  useEffect(() => {
    if (settings) {
      setFormData({
        quantityForLowStock: settings.quantityForLowStock,
        highValueUserSpents: settings.highValueUserSpents
      })
    } else if (settingsData?.settings?.length === 0) {
      // No settings found, set default values
      setFormData({
        quantityForLowStock: 10,
        highValueUserSpents: 500
      })
    }
  }, [settings, settingsData])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }))
  }

  const handleSave = () => {
    if (settings) {
      // Update existing settings
      updateSettings(
        { id: settings._id, data: formData },
        {
          onSuccess: () => {
            toast.success('Settings updated successfully')
            refetch()
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update settings')
          }
        }
      )
    } else {
      // Create new settings
      createSettings(formData, {
        onSuccess: () => {
          toast.success('Settings created successfully')
          refetch()
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to create settings')
        }
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-slate-900'>Settings</h1>
          <p className='text-slate-600'>Manage your application settings</p>
        </div>
      </div>

      {/* Settings Form */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Application Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quantity for Low Stock */}
            <div className="space-y-2">
              <Label htmlFor="quantityForLowStock" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Quantity for Low Stock Alert
              </Label>
              <Input
                id="quantityForLowStock"
                type="number"
                min="0"
                value={formData.quantityForLowStock}
                onChange={(e) => handleInputChange('quantityForLowStock', e.target.value)}
                placeholder="Enter minimum quantity"
                className="w-full"
              />
              <p className="text-sm text-slate-600">
                Products with stock below this number will be marked as low stock
              </p>
            </div>

            {/* High Value User Spent */}
            <div className="space-y-2">
              <Label htmlFor="highValueUserSpents" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                High Value Customer Threshold
              </Label>
              <Input
                id="highValueUserSpents"
                type="number"
                min="0"
                step="0.01"
                value={formData.highValueUserSpents}
                onChange={(e) => handleInputChange('highValueUserSpents', e.target.value)}
                placeholder="Enter amount threshold"
                className="w-full"
              />
              <p className="text-sm text-slate-600">
                Customers who have spent this amount or more are considered high value
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-amber-800 hover:bg-amber-900"
            >
              {isSaving ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  {settings ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {settings ? 'Update Settings' : 'Create Settings'}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Settings Display */}
      {settings && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Current Low Stock Threshold
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-600">
                  {settings.quantityForLowStock}
                </p>
                <p className="text-slate-600 mt-2">items</p>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Current High Value Threshold
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  ${settings.highValueUserSpents.toFixed(2)}
                </p>
                <p className="text-slate-600 mt-2">total spent</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default AdminSettingsPage
