export type ChallengeFormState = {
  id?: string;
  name: string;
  accountSize: string;
  price: string;
  profitTarget: string;
  maxDrawdown: string;
  profitSplit: string;
  published: boolean;
  sortOrder: string;
};

export const emptyChallengeForm: ChallengeFormState = {
  name: "",
  accountSize: "",
  price: "",
  profitTarget: "",
  maxDrawdown: "",
  profitSplit: "",
  published: true,
  sortOrder: "0",
};

export function challengeToForm(c: {
  id: string;
  name: string;
  accountSize: string | null;
  price: number | null;
  profitTarget: string | null;
  maxDrawdown: string | null;
  profitSplit: string | null;
  published: boolean;
  sortOrder: number;
}): ChallengeFormState {
  return {
    id: c.id,
    name: c.name,
    accountSize: c.accountSize ?? "",
    price: c.price != null ? String(c.price) : "",
    profitTarget: c.profitTarget ?? "",
    maxDrawdown: c.maxDrawdown ?? "",
    profitSplit: c.profitSplit ?? "",
    published: c.published,
    sortOrder: String(c.sortOrder),
  };
}

export function formToPayload(form: ChallengeFormState) {
  return {
    name: form.name,
    accountSize: form.accountSize || null,
    price: form.price === "" ? null : Number(form.price),
    profitTarget: form.profitTarget || null,
    maxDrawdown: form.maxDrawdown || null,
    profitSplit: form.profitSplit || null,
    published: form.published,
    sortOrder: parseInt(form.sortOrder, 10) || 0,
  };
}
