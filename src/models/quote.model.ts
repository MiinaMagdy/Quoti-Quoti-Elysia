import { getModelForClass, ModelOptions, prop } from "@typegoose/typegoose";
import { t } from "elysia";

export const quoteSchema = t.Object({
  text: t.String(),
  author: t.String(),
  categories: t.Array(t.String(), { default: [] }),
  imageURL: t.Optional(t.String({ pattern: "https?://.+\\..+" })),
  authorInfo: t.Optional(t.String()),
});

export const quoteOptionalSchema = t.Object({
  ...Object.fromEntries(
    Object.entries(quoteSchema.properties).map(([key, value]) => [
      key,
      t.Optional(value),
    ])
  ),
});

type TQuote = typeof quoteSchema.static;

// Quote model schema
@ModelOptions({
  schemaOptions: { collection: "quotes" },
})
export class Quote implements TQuote {
  @prop({
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 500,
  })
  text!: string;

  @prop({
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 100,
  })
  author!: string;

  @prop({
    type: () => [String],
    default: [],
  })
  categories!: string[];

  @prop({
    trim: true,
    minlength: 1,
    maxlength: 500,
  })
  imageURL?: string;

  @prop({
    trim: true,
    minlength: 1,
    maxlength: 500,
  })
  authorInfo?: string;
}

export const QuoteModel = getModelForClass(Quote);
