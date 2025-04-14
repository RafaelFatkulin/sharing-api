import { t } from "elysia";

export const IdParamSchema = t.Object({
  id: t.Number({ minimum: 1, multipleOf: 1 }),
});
