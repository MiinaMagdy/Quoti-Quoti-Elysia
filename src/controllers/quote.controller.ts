import { Elysia, error, t } from "elysia";
import mongoose from "mongoose";

import { quoteOptionalSchema, quoteSchema } from "../models";
import { QuoteService } from "../services/";

export const quote = new Elysia({ prefix: "/quotes" })
  .onBeforeHandle(({ set }) => {
    set.headers = { "content-type": "application/json" };
  })
  .onAfterHandle(({ response }) => JSON.stringify(response))
  .get(
    "/",
    ({ query }) => {
      return QuoteService.findQuotes(query);
    },
    {
      query: quoteOptionalSchema,
    }
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      const objectId = new mongoose.Types.ObjectId(id);
      return QuoteService.findQuoteById(objectId);
    },
    {
      params: t.Object({
        id: t.String({ pattern: "^[0-9a-fA-F]{24}$" }),
      }),
    }
  )
  .post(
    "/",
    async ({ body, set }) => {
      set.status = "Created";
      return QuoteService.addQuote(body);
    },
    {
      body: quoteSchema,
    }
  )
  .patch(
    "/:id",
    async ({ params: { id }, body }) => {
      return QuoteService.updateQuote(id, body);
    },
    {
      body: quoteOptionalSchema,
    }
  )
  .delete("/:id", async ({ params: { id }, set }) => {
    await QuoteService.deleteQuote(id);
    set.status = "No Content";
  });
