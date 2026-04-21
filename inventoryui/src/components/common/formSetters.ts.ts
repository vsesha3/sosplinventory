import type { Dispatch, SetStateAction, ChangeEvent } from "react";
 // or wherever DateValue comes from
import type {  DateValue } from '@mantine/dates';
export function createFormSetters<T>(
  setForm: Dispatch<SetStateAction<T>>
) {
  const set = <K extends keyof T>(field: K) =>
    (value: T[K]) =>
      setForm((prev) => ({ ...prev, [field]: value }));

  const setDate = <K extends keyof T>(field: K) =>
    (value: DateValue) =>
      setForm((prev) => ({ ...prev, [field]: value as T[K] }));

  const setStr = <K extends keyof T>(field: K) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.currentTarget.value;
      setForm((prev) => ({ ...prev, [field]: value as T[K] }));
    };

  return { set, setDate, setStr };
}