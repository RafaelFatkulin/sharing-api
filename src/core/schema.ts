import { t } from "elysia";

export const IdParamSchema = t.Object({
  id: t.Number({ minimum: 1, multipleOf: 1 }),
});

export const IdStringParamSchema = t.Object({
  id: t.String({ minimum: 1, multipleOf: 1 }),
});

export const PaginationQuerySchema = t.Object({
  page: t.Optional(t.Numeric({ minimum: 1, default: 1 })),
  perPage: t.Optional(t.Numeric({ minimum: 1, maximum: 10000, default: 10 })),
})

export const SlugParamSchema = t.Object({
  slug: t.String({ minimum: 1, multipleOf: 1 }),
});

export const ErrorSchema = t.Object({
  error: t.Optional(t.String()),
  details: t.Optional(t.Record(t.String(), t.Array(t.String()))),
  cause: t.Optional(t.String())
})

export const MetaSchema = t.Object({
  total: t.Number(),
  page: t.Number(),
  perPage: t.Number(),
  totalPages: t.Number(),
})