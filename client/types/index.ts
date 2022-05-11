export interface invoiceType {
  invoice_number: number
  title: string
  description: string
  amount: number
}

export interface invoiceArrayType extends Array<invoiceType>{}
