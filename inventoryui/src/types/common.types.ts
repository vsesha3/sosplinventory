export interface DropDownOption {
  value: string;
  label: string;
  prefix?: string;
  quantity?: number | string;
  remainingQty?: number | string;
}

export interface DropDownApiResponse {
  success: boolean;
  message: string;
  data: DropDownOption[];
}