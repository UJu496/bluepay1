export const BLUEPAY_BPC_CODE = "BPC2026_TQ85_VTD54_DV5T_46Qa_TAQ96"
export const BLUEPAY_BPC_PURCHASE_AMOUNT = 10750

export function isValidBpcCode(value: string) {
  return value.trim().toUpperCase() === BLUEPAY_BPC_CODE.toUpperCase()
}
