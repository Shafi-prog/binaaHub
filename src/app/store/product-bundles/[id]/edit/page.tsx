"use client"
// @ts-nocheck
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, ArrowLeft } from "lucide-react"

interface BundleItem {
  id: string
  product_id: string
  product_title: string
  quantity: number
  required: boolean
  allow_quantity_change: boolean
  discount_percentage?: number
  sort_order: number
}

interface Product {
  id: string
  title: string
}

interface BundleFormData {
  title: string
  handle: string
  description: string
  bundle_type: "fixed" | "dynamic" | "kit"
  items: BundleItem[]
}

export default function ProductBundleEdit() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BundleFormData>({
    defaultValues: {
      title: "",
      handle: "",
      description: "",
      bundle_type: "fixed",
      items: []
    }
  })

  const bundleItems = watch("items") || []
  const id = params?.id

  useEffect(() => {
    loadAvailableProducts()
    if (id) {
      loadBundle(id as string)
    }
  }, [id])

  const loadAvailableProducts = async () => {
    try {
      // TODO: Replace with actual API call
      setAvailableProducts([
        { id: "prod_1", title: "Product 1" },
        { id: "prod_2", title: "Product 2" },
        { id: "prod_3", title: "Product 3" },
      ])
    } catch (error) {
      console.error("Error loading products:", error)
    }
  }

  const loadBundle = async (bundleId: string) => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      const mockBundle = {
        title: "Construction Bundle",
        handle: "construction-bundle",
        description: "Essential construction materials",
        bundle_type: "fixed",
        items: [
          {
            id: "bi_1",
            product_id: "prod_1",
            product_title: "Product 1", 
            quantity: 2,
            required: true,
            allow_quantity_change: false,
            discount_percentage: 10,
            sort_order: 1
          }
        ]
      }
      
      // Set form values with proper typing
      setValue("title", mockBundle.title)
      setValue("handle", mockBundle.handle)
      setValue("description", mockBundle.description)
      setValue("bundle_type", mockBundle.bundle_type as "fixed" | "dynamic" | "kit")
      setValue("items", mockBundle.items)
    } catch (error) {
      console.error("Error loading bundle:", error)
    } finally {
      setLoading(false)
    }
  }

  const addBundleItem = () => {
    const newItem: BundleItem = {
      id: `temp_${Date.now()}`,
      product_id: "",
      product_title: "",
      quantity: 1,
      required: true,
      allow_quantity_change: false,
      sort_order: bundleItems.length + 1
    }
    setValue("items", [...bundleItems, newItem])
  }

  const removeBundleItem = (index: number) => {
    const updatedItems = bundleItems.filter((_, i) => i !== index)
    setValue("items", updatedItems)
  }

  const updateBundleItem = (index: number, field: string, value: any) => {
    const updatedItems = [...bundleItems]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setValue("items", updatedItems)
  }

  const onSubmit = async (data: BundleFormData) => {
    try {
      setLoading(true)
      console.log("Saving bundle:", data)
      // TODO: Replace with actual API call
      router.push("/store/product-bundles")
    } catch (error) {
      console.error("Error saving bundle:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/store/product-bundles")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Bundles
        </Button>
        <h1 className="text-2xl font-bold">
          {id ? "Edit Product Bundle" : "Create Product Bundle"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Bundle Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Bundle Title *</Label>
                <Input
                  id="title"
                  {...register("title", { required: "Title is required" })}
                  placeholder="Enter bundle title"
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="handle">Handle *</Label>
                <Input
                  id="handle"
                  {...register("handle", { required: "Handle is required" })}
                  placeholder="bundle-handle"
                />
                {errors.handle && (
                  <p className="text-sm text-red-600">{errors.handle.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                {...register("description")}
                placeholder="Bundle description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bundle_type">Bundle Type</Label>
              <select 
                value={watch("bundle_type")} 
                onChange={(e) => setValue("bundle_type", e.target.value as "fixed" | "dynamic" | "kit")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select bundle type</option>
                <option value="fixed">Fixed Bundle</option>
                <option value="dynamic">Dynamic Bundle</option>
                <option value="kit">Product Kit</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Bundle Items</CardTitle>
            <Button type="button" onClick={addBundleItem} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent>
            {bundleItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No items added yet. Click "Add Item" to start building your bundle.
              </p>
            ) : (
              <div className="space-y-4">
                {bundleItems.map((item, index) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBundleItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Product *</Label>
                        <select
                          value={item.product_id}
                          onChange={(e) => {
                            const value = e.target.value;
                            const product = availableProducts.find(p => p.id === value)
                            updateBundleItem(index, "product_id", value)
                            updateBundleItem(index, "product_title", product?.title || "")
                          }}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        >
                          <option value="">Select product</option>
                          {availableProducts.map(product => (
                            <option key={product.id} value={product.id}>
                              {product.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateBundleItem(index, "quantity", parseInt(e.target.value) || 1)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Discount %</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={item.discount_percentage || ""}
                          onChange={(e) => updateBundleItem(index, "discount_percentage", parseFloat(e.target.value) || undefined)}
                          placeholder="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Sort Order</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.sort_order}
                          onChange={(e) => updateBundleItem(index, "sort_order", parseInt(e.target.value) || 1)}
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`required-${index}`}
                          checked={item.required}
                          onCheckedChange={(checked) => updateBundleItem(index, "required", checked)}
                        />
                        <Label htmlFor={`required-${index}`}>Required</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`quantity-change-${index}`}
                          checked={item.allow_quantity_change}
                          onCheckedChange={(checked) => updateBundleItem(index, "allow_quantity_change", checked)}
                        />
                        <Label htmlFor={`quantity-change-${index}`}>Allow quantity change</Label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/store/product-bundles")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Bundle"}
          </Button>
        </div>
      </form>
    </div>
  )
}
