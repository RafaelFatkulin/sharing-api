import { t } from "elysia";

export const IdParamSchema = t.Object({
  id: t.Number({ minimum: 1, multipleOf: 1 }),
});

export const IdStringParamSchema = t.Object({
  id: t.String({ minimum: 1, multipleOf: 1 }),
});

export const ErrorSchema = t.Object({
  error: t.Optional(t.String()),
  details: t.Optional(t.Record(t.String(), t.Array(t.String()))),
  cause: t.Optional(t.String())
})